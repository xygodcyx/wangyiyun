import axios from 'axios';
export const request = axios.create({
  // baseURL: 'http://localhost:80/', //开发环境
  // baseURL: ' http://yuandifuhuo.natapp1.cc/', //生产环境
  baseURL: '//music-server.quhou.top/', //免费的生产环境
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
