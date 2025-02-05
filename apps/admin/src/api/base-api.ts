import axios from 'axios'
import {toast} from "@admin/hooks/use-toast.ts";

export const BASE_DOMAIN = import.meta.env.VITE_BASE_DOMAIN
export const BASE_URL = `${BASE_DOMAIN}/ab/v1`

const api = axios.create({
  baseURL: BASE_URL,
})

export default api

const errorHandler = (error: any) => {
  toast({
    title: `${error.response.data.message}`,
    draggable: true,
    variant: 'destructive',
  })

  return Promise.resolve(error)
}

api.interceptors.request.use(config => {
  config.headers.Authorization = localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : null

  return config
})

api.interceptors.response.use(
  (response) => {

    return response
  },
  async (error) => {
    // const originalRequest = error.config
    // const serverCallUrl = originalRequest.url
    const status = error.response.status

    if (status === 401 && !window.location.href?.includes('/sign-in')){
      // let token = await refreshAccessToken()
      // setAccessToken(token)

      // originalRequest._retry = true
      // originalRequest.headers.authorization = `Bearer ${token}`

      // return axios(originalRequest)
      // return errorHandler(error)
      localStorage.removeItem('token')
      window.location.href = '/sign-in'
      // return errorHandler(error)
    } else return errorHandler(error)
  })
