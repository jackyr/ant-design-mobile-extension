---
order: 3
title:
  zh-CN: 卡片选择上传模式
  en-US: 'Image picker and upload card mode'
---

````jsx
import { WingBlank, WhiteSpace, LocaleProvider, SegmentedControl } from 'antd-mobile';
import { ImageUpload } from 'antd-mobile-extension';
import enUS from 'antd-mobile/lib/locale-provider/en_US';
import imageUploadLocaleEnUS from 'antd-mobile-extension/lib/image-upload/locale/en_US';

const CardUpload = ImageUpload.CardUpload;

class CardUploadExample extends React.Component {
  state = {
    lang: '中文',
  }
  onSegmentValueChange = (v) => {
    this.setState({
      lang: v,
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
  onPickChange = (file) => {
    console.log(file);
  }
  onChange = (file) => {
    console.log(file);
  }
  render() {
    enUS.ImageUpload = imageUploadLocaleEnUS;
    const upload = (
      <CardUpload
        action="https://jsonplaceholder.typicode.com/posts/"
        handleResponse={this.handleResponse}
        onPickChange={this.onPickChange}
        onChange={this.onChange}
      />
    );
    return (
      <WingBlank>
        <SegmentedControl
          values={['中文', 'en-US']}
          selectedIndex={['中文', 'en-US'].indexOf(this.state.lang)}
          onValueChange={this.onSegmentValueChange}
        />
        <WhiteSpace />
        {this.state.lang === 'en-US' ? <LocaleProvider locale={enUS}>{upload}</LocaleProvider> : upload}
        <WhiteSpace />
      </WingBlank>
    );
  }
}

ReactDOM.render(<CardUploadExample />, mountNode);
````
