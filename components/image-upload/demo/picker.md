---
order: 0
title:
  zh-CN: 简单的图片选择
  en-US: 'Simple image picker'
---

````jsx
import { WingBlank } from 'antd-mobile';
import { ImageUpload } from 'antd-mobile-extension';

class ImageUploadExample extends React.Component {
  onChange = (files, type, file) => {
    console.log(files, type, file);
  }
  render() {
    return (
      <WingBlank>
        <ImageUpload
          onChange={this.onChange}
        />
      </WingBlank>
    );
  }
}

ReactDOM.render(<ImageUploadExample />, mountNode);
````
