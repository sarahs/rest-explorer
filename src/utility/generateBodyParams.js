export default function GenerateBodyParams(method, enteredBodyParams) {
    let filteredParams = Object.keys(enteredBodyParams)
      .filter(key => enteredBodyParams[key] !== '')
      .reduce((obj, key) => {
          obj[key] = enteredBodyParams[key]
          return obj
        }, {})
    if (method !== "GET" && Object.keys(filteredParams).length !== 0) {
      return JSON.stringify(filteredParams, null, 4)
    }
  }
