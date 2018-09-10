# Honeypack 升级手册

1. 备份`path/to/webpack.config.js`，然后删除该文件
2. 在`.gitignore`中增加`.yo-rc.json`
3. 安装`honeypack@1`
4. 用你之前的方式重新运行即可
5. 如需定制webapck配置项，可以在首次运行后直接修改`path/to/webpack.config.js`
6. 注意：打包的时候需设定`NODE_ENV=production`
