# mock-middleware

为 FTL 页面和 Ajax 提供 mock 数据。配合 [freemarker-middleware](https://github.com/luobotang/freemarker-middleware) 使用。

## 介绍

采用 Freemarker 后端模板的工程，前端进行本地开发时 mock 数据非常麻烦。通过使用 [freemarker-middleware](https://github.com/luobotang/freemarker-middleware)，解决了前端本地渲染 *.ftl 模板文件的问题。对于模板渲染时的数据，freemarker-middleware 预留了通过 req.$data 提供数据的方式，而 mock-middleware 则提供了一套注入 req.$data 的机制，也就是向 Freemarker 模板提供 mock 数据。

请求进入 express，首先经由 mock-middleware 的处理，添加 req.$data，然后转到 freemarker-middleware，此时即可将数据用于渲染模板。

### map.js 配置文件

为识别不同 ftl 文件以提供不同的 mock 数据，首先需要提供一个 map.js 文件，提供了 ftl 路径和数据提供模块的地址，例如：

```javascript
exports.page = {
  '/about.ftl': './about'
}
```

### mock 数据模块文件

数据提供模块文件，可以是 JSON 文件直接提供数据，也可以是 JS 模块以函数方式同步或异步返回数据。

（1）JSON 方式返回数据

文件 about.json

```json
{
  "name": "luobo",
  "age": 18
}
```

（2）同步函数方式返回数据

文件 about.js

```javascript
module.exports = function(req) {
  return {
    name: 'luobo',
    age: 18
  }
}
```

（3）异步函数方式返回数据

文件 about.js

```javascript
module.exports = function(req, callback) {
  callback({
    name: 'luobo',
    age: 18
  })
}
```

### AJAX mock

对于 AJAX 接口，不需要将数据交由模板进行渲染，直接以 JSON 形式返回，此时在 map.js 增加 ajax 配置：

```javascript
exports.page = {
  '/about.ftl': './about'
}

exports.ajax = {
  '/getName': './getName'
}
```

对于的数据模块文件的形式，和之前相同。

### mock 数据方案

有时，对于同一个数据接口，要根据情况返回不同的数据以模拟不同的场景。可以将多个数据写到一个数据模块文件中，然后根据一定的条件返回不同数据。

为了更好满足这种需求，提供了 mock 数据方案，这个数据方案可以在运行时进行切换，以为相同接口返回不同数据。

首先，提供 config.js 配置文件：

```javascript
module.exports = {
  Name: {
    desc: '姓名',
    options: [{
      value: 'Tom',
      desc: 'Tom'
    }, {
      value: 'Luobo',
      desc: 'Luobo'
    }]
  }
}
```

数据方案 Name 在数据模块中可以通过 req.$config.Name 来获取到，方案的值为上面选项中的一个，缺省为第一个。

启动 express 后，可以在“/mock-config”页面对当前方案的值进行配置。

以数据模块“getName”为例，可以这样来根据数据方案切换返回数据：

```javascript
module.exports = function(req) {
  return {
    name: req.$config.Name
  }
}
```

由于是在运行时修改数据，不需要修改数据模块文件，可以更方便地模拟不同场景。

## 使用

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