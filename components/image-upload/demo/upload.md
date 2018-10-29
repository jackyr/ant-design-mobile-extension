---
order: 1
title:
  zh-CN: 图片选择并上传
  en-US: 'Image picker and upload'
---

````jsx
import { WingBlank } from 'antd-mobile';
import { ImageUpload } from 'antd-mobile-extension';

const data = [{
  url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg',
}, {
  url: 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg',
}];

class ImageUploadExample extends React.Component {
  state = {
    files: data,
  }
  onPickChange = (files, type, file) => {
    console.log(files, type, file);
  }
  onChange = (files, type, file) => {
    console.log(files, type, file);
    this.setState({
      files,
    });
  }
  onImageClick = (file, files) => {
    console.log(file, files);
  }
  render() {
    const { files } = this.state;
    return (
      <WingBlank>
        <ImageUpload
          value={files}
          selectable={files.length < 7}
          multiple
          action="https://jsonplaceholder.typicode.com/posts/"
          onPickChange={this.onPickChange}
          onChange={this.onChange}
          onImageClick={this.onImageClick}
        />
      </WingBlank>
    );
  }
}

ReactDOM.render(<ImageUploadExample />, mountNode);
````
