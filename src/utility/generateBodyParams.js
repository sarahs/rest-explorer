export default function GenerateBodyParams(method, enteredBodyParams) {
    if (method !== "GET" && Object.keys(enteredBodyParams).length !== 0) {
      return JSON.stringify(enteredBodyParams, null, 4)
    }
  }
