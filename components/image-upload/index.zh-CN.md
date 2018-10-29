---
category: Components
type: Data Entry
title: ImageUpload
subtitle: 图片选择上传
---

## API

属性 | 说明 | 类型 | 默认值
----|-----|------|------
| value    | 图片文件数组,元素为对象,包含属性 url（必选), 可能还有id, orientation, 以及业务需要的其它属性     | Array  | []  |
| defaultValue    | 初始默认数据，同value     | Array  | []  |
| selectable | 是否显示添加按钮  | boolean |  true |
| multiple | 是否支持多选  | boolean |  false |
| accept | 图片类型  | string |  'image/*' |
| length | 单行的图片数量  | string \| number | 4 |
| action | 上传的地址，为空时组件默认只选择不上传  | string | '' |
| headers | 上传的请求头部  | object | {} |
| data | 上传的请求参数  | object | {} |
| name | 发到后台的文件参数名	  | string | 'file' |
| withCredentials | 上传请求时是否携带 cookie  | boolean | false |
| children | 自定义选择区域 | ReactNode |   |
| customRequest    | 通过覆盖默认的上传行为，可以自定义自己的上传实现，详见 [customRequest](#customRequest) | Function |   |
| onPickChange    | files 值发生变化时的回调函数, 详见 [onPickChange](#onChange/onPickChange) | (files: Object, operationType: string, file: Object): void |   |
| onPickFail    | 文件选择失败时的回调函数  | (msg: string): void |   |
| onChange    | 文件上传状态改变时触发的回调函数, 详见 [onChange](#onChange/onPickChange)。只选择不上传模式下该回调函数也会触发，此时等同于onPickChange  | (files: Object, operationType: string, file: Object): void |   |
| onImageClick    | 点击图片触发的回调  | (file: Object, files: Object): void |   |
| handlePick    | 选择图片时触发的回调。函数返回file对象或假值。当返回假值时不会选中当前的图片。支持返回promise对象：resolve(file)、reject()  | (file: Object, files: Object): object \| boolean \| promise |   |
| handleResponse    | 上传请求得到响应时回调函数, 一般用于处理业务判断逻辑，例如修改file对象。函数返回file对象或假值。当返回假值时触发上传失败状态。支持返回promise对象：resolve(file)、reject(new Error()) | (response: any, file: Object): object \| boolean \| promise |   |
| handleRemove    | 删除图片时触发的回调。函数返回file对象或假值。当返回假值时不会删除当前的图片。支持返回promise对象：resolve(file)、reject()  | (file: Object, files: Object): object \| boolean \| promise |   |

### onChange/onPickChange

> 选择图片、删除图片会调用onPickChange。上传中、上传完成、上传失败都会调用onChange。

文件状态改变的回调，参数为：

1. `files` 当前的文件列表。

2. `operationType` 当前操作类型 - add: 新增 / remove: 移除

3. `file` 当前操作的文件对象。

   ```js
   {
      url: '',          // 本地选择的文件会以base64形式输出
      uid: 'uid',       // 组件内部产生的文件唯一标识
      file: {},         // input获取的原始文件对象
      orientation: 1,   // 图片旋转方向
      /* 只选择不上传模式没有下列四个字段 */
      status: 'done',   // 状态有：uploading done error removed
      percent: 100,     // 上传进度百分比
      response: {"status": "success"}, // 服务端响应内容
      error: Error,     // 上传报错信息
      /* 初始化传入或onResponse()方法处理得到的其他业务参数 */
      ...params,
   }
   ```

### customRequest

自定义请求函数应返回一个对象，可包含abort方法：

  ```ts
  (param: RequestParam) => { abort?: () => void }
  ```

接收参数对象：

  ```ts
  interface RequestParam {
    action: string;
    filename: string;
    file: File;
    headers: Object;
    data: Object;
    withCredentials: boolean;
    onProgress: (e: any) => void;
    onSuccess: (ret: any) => void;
    onError: (err: any, ret: any) => void;
  }
  ```

### ImageUpload.CardUpload

卡片选择上传模式

1. 该模式下不支持 `multiple`、`length`、`onImageClick`、`handleRemove` 属性

2. `value`、`defaultValue` 值为file对象，`onPickChange`、`onChange`、`handlePick` 的函数参数为file对象

3. 支持 `customRender` 属性，用以完全自定义渲染区域，参数context为实例内部this指针：

  ```ts
  (context: this) => ReactNode
  ```