### ChatDemo
启动前后端项目前，请通过pnpm install安装工作区依赖

#### 前端项目启动
启动前，请在frontend目录下设置相对应的.env环境变量参数，参考.env.example文件
```shell
pnpm -F frontend dev
```

#### 后端项目启动
启动前,请确保docker-compose里面postgres容器已经启动
如果需要更换第三方OpenAPI URL和Secret，请参考backend目录下的.env.example文件，进行相对设置

```shell
cd ./packages/backend
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
pnpm -F backend start
```
