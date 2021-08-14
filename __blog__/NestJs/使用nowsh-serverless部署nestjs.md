now.sh（vercel）是一个免费的网站应用托管平台，支持serverless functions功能，可以运行nodejs服务器，可以部署静态网站、服务端ssr渲染的网站，也支持文件存储（/tmp目录）。下面示例将nestjs部署到vercel：

### 安装now.sh

```bash
sudo npm i -g now

# 登陆
now login # 会提示打开vercel操作
```

### 为你的Nestjs应用创建一个now配置

在nestjs项目目录下创建now.json文件

name是起一个应用名，用于管理，其他配置不变

```json
{
  "version": 2,
  "name": "nest-api-analyse-imports",
  "builds": [
    {
      "src": "dist/main.js",
      "use": "@now/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/main.js"
    }
  ]
}
```

### 部署Nestjs应用到vercel

```bash
yarn build && now
```

提示Inspect链接就是vercel上当前项目的状态，部署成功后输出一个Preview链接就是应用访问入口。

示例：

[nest-api-analyse-imports](https://github.com/Saber2pr/nest-api-analyse-imports)
