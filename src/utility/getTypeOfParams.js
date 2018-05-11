export default function getTypeOfParams(path, paramsList) {
  const mymatch = path.match(/:[^/]*/g)
  const pathParamsArray = mymatch ? mymatch.map(re => re.replace(':','')) : []
  let bodyParamsArray = []
  paramsList.forEach((param) => {
    if (pathParamsArray.indexOf(param.name) === -1) {
      bodyParamsArray.push(param)
    }
  })
  return [pathParamsArray, bodyParamsArray]
}
