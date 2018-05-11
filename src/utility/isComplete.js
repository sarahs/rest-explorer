export default function isComplete(paramsArray, enteredParams, paramType) {
  if (paramType === "path") {
    return Object.keys(enteredParams).length === Object.keys(paramsArray).length
  }
  else {
    let requiredParamsArray = []
    if (Object.keys(paramsArray).length > 0) {
      paramsArray.map(q => q["required"] ? requiredParamsArray.push(q) : null)
      let enteredRequiredParamsArray = []
      requiredParamsArray.forEach((param) => {
        if (Object.keys(enteredParams).indexOf(param.name) !== -1) {
          enteredRequiredParamsArray.push(param)
        }
      })
      return JSON.stringify(enteredRequiredParamsArray) === JSON.stringify(requiredParamsArray)
    }
  }
}
