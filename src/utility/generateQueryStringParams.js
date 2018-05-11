export default function GenerateQueryStringParams(method, enteredBodyParams) {
  const queryString = require('query-string')

  if ((method === "GET" || method === "DELETE") && Object.keys(enteredBodyParams).length !== 0) {
    return "?" + queryString.stringify(enteredBodyParams)
  }
  else {
    return ""
  }
}
