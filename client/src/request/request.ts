import axios from 'axios';
export const request = axios.create({
  // baseURL: 'http://localhost:8080/', //开发环境
  // baseURL: ' http://yuandifuhuo.natapp1.cc/', //生产环境
  baseURL: import.meta.env.VITE_WANGYIYUN_API_BASE_URL, // 读取环境变量
  timeout: 6000
});

request.interceptors.request.use(config => {
  const originParams =  config.params
  const newParams = {
    ...originParams,
    realIP:`116.25.146.177`
  }
  config.params = newParams
  return config;
})
