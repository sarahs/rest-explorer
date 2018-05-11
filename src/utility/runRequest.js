import axios from 'axios'

export default function runRequest(method, submittedPath, submittedBody, apiBase, token) {

  console.log(token)
  console.log(method)
  console.log(submittedPath)
  console.log(submittedBody)

  const instance = axios.create({
    baseURL: apiBase
  })

  instance.defaults.headers.common['Authorization'] = token

  return "Placeholder! Response goes here."

  // const methodSwitch = (method, submittedPath, submittedBody) => ({
  //   "GET": axios.get(submittedPath),
  //   "POST": axios.post(submittedPath, {submittedBody}),
  //   "PUT": axios.put(submittedPath, {submittedBody}),
  //   "PATCH": axios.patch(submittedPath, {submittedBody}),
  //   "DELETE": axios.delete(submittedPath),
  // })[method]
  //
  // console.log(methodSwitch)
  //
  // methodSwitch(method, submittedPath, submittedBody)
  //   .then(function (response) {
  //     return response
  //   })
  //   .catch(function (error) {
  //     return error
  //   })
}
