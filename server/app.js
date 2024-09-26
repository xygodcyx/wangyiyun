#!/usr/bin/env node
async function start() {
  // 如果需要手动修改anonymous_token，需要注释generateConfig调用
  require('./server').serveNcmApi({
    checkVersion: true,
    port: 80,
    // host: 'yuandifuhuo.dynv6.net/',
    // host: 'http://118.212.155.137',
  })
}
start()
