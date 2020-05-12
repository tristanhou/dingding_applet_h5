const path = require('path');

const resolve = dir => {
    return path.join(__dirname, dir);
};
module.exports = {
    
    devServer: {
      host: '0.0.0.0',
      port: 8089,
      proxy: {
          '/proxy/*': {
              target: 'http://113.108.62.204:8090/', // 测试环境
              // target: 'http://0.0.0.0:9999/', // 本地环境
              // target: 'https://www.easy-mock.com/mock/5bce871a98c3e07240b7e07e/jimilbs',
              changeOrigin: true,
              pathRewrite: {
                  '^/proxy': ''
              }
          }
      }
    },
    lintOnSave: false,
    chainWebpack: config => {
      config.plugin('html').tap(args => {
          args[0].title = '工时统计'
          return args
        })
        config.resolve.alias
        .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
        .set('_c', resolve('src/components'));
    },
    css: {
      loaderOptions: {
        stylus: {
          'resolve url': true,
          'import': [
            './src/theme'
          ]
        }
      }
    },
    pluginOptions: {
      'cube-ui': {
        postCompile: true,
        theme: true
      }
    }
  }
  