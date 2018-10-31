---
order: 0
title: Ant Design Mobile Extension
---

`antd-mobile-extension` 是 [Ant Design Mobile](http://mobile.ant.design) 的扩展

<div class="pic-plus">
  <img width="160" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg">
  <span>+</span>
  <img width="160" src="https://t.alipayobjects.com/images/rmsweb/T16xRhXkxbXXXXXXXX.svg">
</div>

<style>
.pic-plus > * {
  display: inline-block;
  vertical-align: middle;
}
.pic-plus {
  margin: 40px 0;
}
.pic-plus span {
  font-size: 30px;
  color: #aaa;
  margin: 0 40px;
}
</style>

## 安装及使用

```bash
$ npm install antd-mobile-extension --save
```

组件使用实例：

```jsx
import { ImageUpload } from 'antd-mobile-extension';
ReactDOM.render(<ImageUpload />, mountNode);
```

引入样式：

```jsx
import 'antd-mobile-extension/dist/antd-mobile-extension.css';  // or 'antd-mobile-extension/dist/antd-mobile-extension.less'
```

##### 按需加载

**注意：强烈推荐使用。**

下面两种方式都可以**只加载**用到的组件，选择其中一种方式即可。

- 使用 [babel-plugin-import](https://github.com/ant-design/babel-plugin-import)（推荐）。

   ```js
   // .babelrc or babel-loader option
   {
     "plugins": [
       ["import", { libraryName: "antd-mobile-extension", style: "css" }] // `style: true` 会加载 less 文件
     ]
   }
   ```

   然后只需从 antd-mobile-extension 引入模块即可，无需单独引入样式。

   ```jsx
   // babel-plugin-import 会帮助你加载 JS 和 CSS
   import { ImageUpload } from 'antd-mobile-extension';
   ```

- 手动引入

   ```jsx
   import ImageUpload from 'antd-mobile-extension/lib/image-upload';  // 加载 JS
   import 'antd-mobile-extension/lib/image-upload/style/css';        // 加载 CSS
   // import 'antd-mobile-extension/lib/image-upload/style';         // 加载 LESS
   ```

## 体积

- 按需加载：只需引入业务中需要的组件即可，未 import 进来的组件不会打包进来。
- <p>`./dist/antd-mobile-extension.min.js`的文件<a href="https://jackyr.github.io/ant-design-analysis/antd-mobile-extension@1.0.0-stats.html" target="_blank">大小及依赖分析</a></p>

## 浏览器支持

- `iOS`
- `Android 4.0+`
