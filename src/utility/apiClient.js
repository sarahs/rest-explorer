import axios from 'axios'

const apiClient = (apiBase, token = null) => {
  const defaultOptions = {
    baseURL: apiBase,
    timeout: 1000,
    headers: {
      Authorization: token ? `Token ${token}` : '',
      'Content-Type': 'application/json'
    }
  }

  return {
    get: (url, options = {}) => axios.get(url, { ...defaultOptions, ...options }),
    post: (url, data, options = {}) => axios.post(url, data, { ...defaultOptions, ...options }),
    patch: (url, data, options = {}) => axios.post(url, data, { ...defaultOptions, ...options }),
    put: (url, data, options = {}) => axios.put(url, data, { ...defaultOptions, ...options }),
    delete: (url, options = {}) => axios.delete(url, { ...defaultOptions, ...options }),
  }
}

export default apiClient
