const resolve = (dir) => require('path').join(__dirname, dir)

module.exports = {
  publicPath: '/bast-parctice',
  devServer: {
    port: 7070,
  },
  // configureWebpack: {
  //   resolve: {
  //     alias: {
  //       'comps': require('path').join(__dirname, 'src/components')
  //     }
  //   }
  // },
  configureWebpack(config) {
    config.resolve.alias.comps = require('path').join(__dirname, 'src/components')

    if (process.env.NODE_ENV === 'development') {
      config.name = 'vue-dev'
    } else {
      config.name = 'vue dest prod'
    }
  },
  chainWebpack(config) {
    config.module.rule('svg').exclude.add(resolve('src/icons')) // 排除项目文件
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end() // 包含项目文件
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'icon-[name]' })
  },
}
