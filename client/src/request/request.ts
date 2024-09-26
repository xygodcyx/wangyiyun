import axios from 'axios';
export const request = axios.create({
  // baseURL: 'http://localhost:80/', //开发环境
  // baseURL: ' http://yuandifuhuo.natapp1.cc/', //生产环境
  baseURL: '//music-server.quhou.top/', //免费的生产环境
  timeout: 6000
});
