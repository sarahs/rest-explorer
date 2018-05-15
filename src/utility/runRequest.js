import axios from 'axios'

export default function runRequest(apiClient,

  const apiClient = axios.create({
    baseURL: apiBase,
    timeout: 1000
  })

  apiClient.defaults.headers.common['Authorization'] = token

  apiClient.get(submittedPath)
    .then(response => handleSuccessResponse(response))
    .catch(error => handleErrorResponse(error))


  // return "Placeholder! Response goes here."

  // methodSwitch(method, submittedPath, submittedBody) {
  //   var methodCalls = {
  //     'GET': axios.get(submittedPath)
  //       .then(function(response){
  //         return response
  //       })
  //       .catch(function (error) {
  //         return error
  //       }),
  //     'POST': axios.post(submittedPath, submittedBody)
  //       .then(function(response){
  //         return response
  //       })
  //       .catch(function (error) {
  //         return error
  //       }),
  //     'PUT': axios.put(submittedPath, submittedBody)
  //       .then(function(response){
  //         return response
  //       })
  //       .catch(function (error) {
  //         return error
  //       }),
  //     'PATCH': axios.patch(submittedPath, submittedBody)
  //       .then(function(response){
  //         return response
  //       })
  //       .catch(function (error) {
  //         return error
  //       }),
  //     'PATCH': axios.delete(submittedPath)
  //       .then(function(response){
  //         return response
  //       })
  //       .catch(function (error) {
  //         return error
  //       }),
  //   };
  //
  //   if (typeof methodCalls[method] !== 'function') {
  //     throw new Error('Invalid action.');
  //   }
  //
  //   return methodCalls[method]();
  // }
}
