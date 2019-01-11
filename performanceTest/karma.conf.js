module.exports = function (config) {
  config.set({
    basePath: __dirname,
    browsers: ['PhantomJS'],
    files: [
      '../node_modules/phantomjs-polyfill-find/find-polyfill.js',
      '../dist/performance-array.js', 
      './Runner.js', 
      './TestData.js', 
      './*.js'
    ],
    plugins: ['karma-phantomjs-launcher']
  });
}