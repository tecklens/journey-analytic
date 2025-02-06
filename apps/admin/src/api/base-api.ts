import axios, {AxiosError, HttpStatusCode} from 'axios'
import {toast} from "@admin/hooks/use-toast.ts";
import {ACCESS_TOKEN} from "@admin/lib/constants.ts";
import axiosRetry from "axios-retry";

export const BASE_DOMAIN = import.meta.env.VITE_BASE_DOMAIN
export const BASE_URL = `${BASE_DOMAIN}/api/v1`

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

  return Promise.reject({...error})
}

api.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem(ACCESS_TOKEN) ? `Bearer ${sessionStorage.getItem(ACCESS_TOKEN)}` : null

  return config
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    const serverCallUrl = originalRequest.url
    const status = error.response?.status
    console.debug(error.response, serverCallUrl)

    if (status === 401 && !window.location.href?.includes('/sign-in') && !serverCallUrl?.includes('/refresh')) {
      const refresh_token = localStorage.getItem('refresh_token')

      if (refresh_token) {
        // * refresh token
        await refreshToken(error, () => {
          sessionStorage.removeItem(ACCESS_TOKEN)
          window.location.href = '/sign-in'
        })
      } else {
        sessionStorage.removeItem(ACCESS_TOKEN)
        window.location.href = '/sign-in'
      }
    } else return errorHandler(error)
  })

axiosRetry(api, { retries: 2 });

const refreshToken = async (_error: AxiosError, logout: any) => {
  try {
    const refresh_token = localStorage.getItem('refresh_token')
    const resp = await axios.get(`${BASE_URL}/auth/refresh`, {
      headers: {
        ...api.defaults.headers.common,
        Authorization: `Bearer ${refresh_token}`
      }
    });
    if (resp?.status === HttpStatusCode.Ok) {
      sessionStorage.setItem(ACCESS_TOKEN, resp.data?.token)
      window.dispatchEvent(new Event('storage'))

      api.defaults.headers.common['Authorization'] = resp.data?.token
      if (_error.config) {
        _error.config.headers.Authorization = resp.data?.token
        return api.request(_error.config)
      }
    } else {
      localStorage.removeItem('refresh_token')
      logout()
    }
  } catch (error) {
    localStorage.removeItem('refresh_token')
    logout();
    return;
  }
}