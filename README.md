# mock-middleware

为 FTL 页面和 Ajax 提供 mock 数据。配合（freemarker-middleware）使用。

## 准备

在项目下创建 mock 目录，包括：

```
- mock/
  - map.js
  - config.js
  - ajax/
  - page/
```

文件 ```map.js``` 记录页面、接口到对应数据文件的映射，例如：

```javascript
module.exports = {
  page: {
    '/page/one': './page/one',
    '/page/two': './page/two'
  },
  ajax: {
    '/api/foo': './ajax/foo',
    '/api/bar': './ajax/bar'
  }
}
```

文件 ```config.js``` 描述 mock 可用配置，以便接口数据可以根据配置进行切换不同类型，例如：

```javascript
module.exports = {
  IndexPage: {
    desc: '首页数据',
    options: [
      {value: 'Normal', desc: '正常'},
      {value: 'Error', desc: '数据异常'}
    ]
  }
}
```

数据文件模块返回数据，可以直接返回数据，也可以提供一个函数，例如：

```javascript
module.exports = function (req) {
  switch (req.$config.IndexPage) {
    case 'Error':
      return {errorMessage: '数据异常'}
    default:
      return {data: {message: 'Hello, world!'}}
  }
}
```

注：这里的 req.$config 来源于 mock 配置的结果。

## 使用

在开发服务配置中，加入：

```javascript
var MockMiddleware = require('mock-middleware')
var express = require('express')

var app = express()
app.use(MockMiddleware())
// ...
```

## 配置

开发服务器启动后，可以访问 ```/mock-config/``` 页面对 mock 进行配置，配置结果可以应用到 mock 数据模块（通过 req.$config）。