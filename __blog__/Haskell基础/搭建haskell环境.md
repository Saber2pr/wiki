推荐使用Docker镜像+Vscode Remote Container插件开发：

Dockerfile

```dockerfile
FROM haskell:latest

# setup
RUN stack setup

# other tools
RUN apt update
RUN apt install curl
RUN apt install git

# proxy
ENV http_proxy "host.docker.internal:10809"
ENV https_proxy "host.docker.internal:10809"
```

> 注意这里使用了v2ray代理

haskell的包管理和构建执行工具使用stack，

创建一个项目：

```bash
stack new my-project
cd my-project
```

运行项目:

```bash
stack run
```
