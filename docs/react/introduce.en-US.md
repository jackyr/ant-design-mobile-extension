---
order: 0
title: Ant Design Mobile of React Extension
---

`antd-mobile-extension` is the [Ant Design Mobile](http://mobile.ant.design)'s extension

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

## Installation and Usage

```bash
$ npm install antd-mobile-extension --save
```

Example of usage:

```jsx
import { ImageUpload } from 'antd-mobile-extension';
ReactDOM.render(<ImageUpload />, mountNode);
```

And import stylesheets manually:

```jsx
import 'antd-mobile-extension/dist/antd-mobile-extension.css';  // or 'antd-mobile-extension/dist/antd-mobile-extension.less'
```

##### Use modularized antd-mobil-extensione

**Note: Strongly recommended.**

The following two ways used to load the **only components you used**, select one of the ways you like.

- Use [babel-plugin-import](https://github.com/ant-design/babel-plugin-import) (Recommended)

   ```js
   // .babelrc or babel-loader option
   {
     "plugins": [
       ["import", { "libraryName": "antd-mobile-extension", "style": "css" }] // `style: true` for less
     ]
   }
   ```

   This allows you to import components from antd-mobile-extension without having to manually import the corresponding stylesheet. The babel plugin will automatically import stylesheets.

   ```jsx
   // import js and css modularly, parsed by babel-plugin-import
   import { ImageUpload } from 'antd-mobile-extension';
   ```

- Manually import

   ```jsx
   import ImageUpload from 'antd-mobile-extension/lib/image-upload';  // for js
   import 'antd-mobile-extension/lib/image-upload/style/css';        // for css
   // import 'antd-mobile-extension/lib/image-upload/style';         // that will import less
   ```

## Size

- Components are loaded on demand, in other words, components that are not imported are not packed.
- <p><a href="https://jackyr.github.io/ant-design-analysis/" target="_blank">The size and dependency analysis</a> of `./dist/antd-mobile-extension.min.js`</p>

## Environment Support

- `iOS`
- `Android 4.0+`
