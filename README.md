## 开发

### Node.js

请使用 Node 14 版本
### Yarn

安装 Yarn：

`npm install -g yarn`

安装 Yrm：

`npm install -g yrm`

添加 tnpm 源：

`yrm add tnpm http://registry.npm.alibaba-inc.com/`

使用 tnpm 源：

`yrm use tnpm`

安装依赖：

`yarn`

### 启动

`yarn start`
## 发布

`yarn run createDaily`

`yarn run daily`

`yarn run publish`

切换到 gh-pages 分支，修改 index.html 的 cdn 前缀，commit & push 即可

添加github到远端：`git remote set-url github https://github.com/gogocodeio/gogocode-playground.git`

`git push github` 推送到 github

Gitlab 地址： https://gitlab.alibaba-inc.com/mm/gogocode-playground.git
Github 地址： https://github.com/gogocodeio/gogocode-playground.git


DEF 地址： https://work.def.alibaba-inc.com/app/155727/index