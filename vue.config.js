const { defineConfig } = require("@vue/cli-service");
const path = require(`path`);
const timestamp = new Date().getTime();
module.exports = defineConfig({
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    outputDir: 'dist',
    assetsDir: "./static",
    indexPath: 'index.html',
    lintOnSave: false,
    transpileDependencies: true,
    productionSourceMap: false,
    devServer: {
        port: 8004,
        hot: true, //  模块热替换
        proxy: {
            "/api": {
                target: process.env.VUE_APP_API_HOST_URL,
                changeOrigin: true
            }
        },
        client: {
            overlay: false,
        },
    },
    lintOnSave: false,
    configureWebpack: {
        resolve: {
            extensions: [".mjs", ".js", ".jsx", ".vue", ".json", ".wasm", ".*"],
            symlinks: false,
            alias: {
                "@": path.resolve(__dirname, './src'),
                'vue$': 'vue/dist/vue.esm-bundler.js',
                vue: path.resolve(__dirname, `./node_modules/vue`)
            },
        },
        output: {
            // 修改输出js目录名及文件名
            filename: `js/[name]-test-${timestamp}.js`,
            chunkFilename: `js/[name]-test-${timestamp}.js`,
        },
    },
    // 使用 chainWebpack 方法
    chainWebpack: config => {
        // 添加 babel-polyfill 和 main.js 作为入口点
        config.entry('app').add('babel-polyfill').add('./src/main.js');
    },
});
