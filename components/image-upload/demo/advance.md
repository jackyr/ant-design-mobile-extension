---
order: 2
title:
  zh-CN: 图片上传高级用法
  en-US: 'Image upload advance usage'
---

限制图片大小、处理上传响应等示例

````jsx
import { WingBlank, Toast, LocaleProvider } from 'antd-mobile';
import { ImageUpload } from 'antd-mobile-extension';
import enUS from 'antd-mobile/lib/locale-provider/en_US';
import imageUploadLocaleEnUS from 'antd-mobile-extension/lib/image-upload/locale/en_US';

const data = [{
  url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg',
  id: 1,
}, {
  url: 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg',
  id: 2,
}];

class ImageUploadExample extends React.Component {
  state = {
    files: data,
  }
  onChange = (files) => {
    console.log(files.map(f => f.id));
  }
  handlePick = (file) => {
    console.log(file);
    const { readFile, processPhoto, dataURItoBlob } = ImageUpload.utils;
    return new Promise((resolve, reject) => {
      const originFile = file.file;
      const isJPG = originFile.type === 'image/jpeg';
      if (!isJPG) {
        Toast.fail('You can only upload JPG file!');
        reject();
        return;
      }
      readFile(originFile, 'DataUrl', (result) => {
        processPhoto(result, {
          orientation: file.orientation,
          maxWidth: 500,
          maxHeight: 500,
          quality: 0.8,
        }, (dataUrl) => {
          const newFile = new File([dataURItoBlob(dataUrl)], originFile.name, {
            type: originFile.type,
            lastModified: originFile.lastModified,
          });
          console.log(originFile, newFile);
          file.file = newFile;
          file.url = dataUrl;
          file.orientation = 1;
          resolve(file);
        });
      });
    });
  }
  handleResponse = (response, file) => new Promise((resolve, reject) => {
    if (response.id) {
      file.id = response.id;
      resolve(file);
    } else {
      console.log(response.msg);
      reject(response.msg);
    }
  })
  handleRemove = () => new Promise((resolve, reject) => {
    setTimeout(() => {
      Toast.fail('Can not be removed!');
      reject();
    }, 200);
  })
  render() {
    const { files } = this.state;
    enUS.ImageUpload = imageUploadLocaleEnUS;
    return (
      <WingBlank>
        <LocaleProvider locale={enUS}>
          <ImageUpload
            defaultValue={files}
            action="https://jsonplaceholder.typicode.com/posts/"
            onChange={this.onChange}
            handlePick={this.handlePick}
            handleResponse={this.handleResponse}
            handleRemove={this.handleRemove}
          />
        </LocaleProvider>
      </WingBlank>
    );
  }
}

ReactDOM.render(<ImageUploadExample />, mountNode);
````
