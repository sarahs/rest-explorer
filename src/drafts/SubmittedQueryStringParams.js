import React from 'react'

const queryString = require('query-string')

const SubmittedQueryStringParams = ({method, enteredBodyParams}) => {
  if ((method === "GET" || method === "DELETE") && Object.keys(enteredBodyParams).length !== 0) {
    return "?" + queryString.stringify(enteredBodyParams)
  }
  else {
    return ""
  }
}

export default SubmittedQueryStringParams
