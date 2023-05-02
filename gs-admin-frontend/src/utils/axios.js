import axios from 'axios'
import { AdminRoutes } from '../routes'
import { getItem, getLoginToken, removeLoginToken } from './storageUtils'

const axiosInstance = axios.create()

export const setupInterceptors = () => {
  const role = getItem('role')

  axiosInstance.interceptors.response.use(
    (res) => res,
    (error) => {
      if (error.response.status === 403) {
        removeLoginToken()
        window.location.href = AdminRoutes.AdminSignin
      }

      return Promise.reject(error)
    }
  )
}

const METHODS = {
  get: 'GET',
  post: 'POST',
  put: 'PUT',
  delete: 'DELETE'
}

const makeRequest = async (url, method, data = {}) => {
  const headers = {
    'Content-Type': 'application/json'
  }

  if (getLoginToken()) {
    headers.Authorization = `Bearer ${getLoginToken()}`
  }

  return axiosInstance({
    url,
    method,
    data,
    headers
  })
}

const getRequest = (url) => makeRequest(url, METHODS.get)

const postRequest = (url, data) => makeRequest(url, METHODS.post, data)

const putRequest = (url, data) => makeRequest(url, METHODS.put, data)

const deleteRequest = (url, data) => makeRequest(url, METHODS.delete, data)

export { getRequest, postRequest, putRequest, deleteRequest }
