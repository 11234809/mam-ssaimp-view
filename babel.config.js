module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage', // 按需引入 polyfills
                corejs: 3, // 使用 core-js@3
            },
        ],
    ],
    plugins: [
        ["import", {libraryName: "mam-base-ui"}, "mam-base-ui"],
        ["import", {libraryName: "mam-rnbdmp-ui"}, "mam-rnbdmp-ui"]
    ]
};