import axios from 'axios';
export const request = axios.create({
  // baseURL: 'http://localhost:80/', //开发环境
  // baseURL: ' http://yuandifuhuo.natapp1.cc/', //生产环境
  baseURL: 'https://netease-cloud-music-api-master-roan.vercel.app/', //免费的生产环境

  timeout: 6000
});
