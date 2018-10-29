import React from 'react';
import classnames from 'classnames';
import { FileInputPropTypes } from './PropsType';
import { getOrientation } from './utils';

function noop() {}

export default class FileInput extends React.Component<
  FileInputPropTypes,
  any
> {
  static defaultProps = {
    prefixCls: 'ame-image-upload-input',
    multiple: false,
    accept: 'image/*',
    onPickSuccess: noop,
    onPickFail: noop,
  };
  private fileSelectorInput: HTMLInputElement | null;

  constructor(props: FileInputPropTypes) {
    super(props);
  }

  onFileChange() {
    const fileSelectorEl = this.fileSelectorInput;
    if (fileSelectorEl && fileSelectorEl.files && fileSelectorEl.files.length) {
      const files = fileSelectorEl.files;
      for (let i = 0; i < files.length; i++) {
        this.parseFile(files[i], i);
      }
    }
    if (fileSelectorEl) {
      fileSelectorEl.value = '';
    }
  }

  parseFile = (file: File, index: number) => {
    const reader = new FileReader();
    reader.onload = e => {
      const dataURL = (e.target as any).result;
      if (!dataURL) {
        if (this.props.onPickFail) {
          this.props.onPickFail(`Fail to get the ${index} image`);
        }
        return;
      }

      let orientation = 1;
      getOrientation(file, res => {
        // -2: not jpeg , -1: not defined
        if (res > 0) {
          orientation = res;
        }
        if (this.props.onPickSuccess) {
          this.props.onPickSuccess(dataURL, orientation, file);
        }
      });
    };
    reader.readAsDataURL(file);
  }

  render() {
    const { prefixCls, className, accept, multiple, disabled } = this.props;

    return (
      <input
        className={classnames(`${prefixCls}`, className)}
        ref={(input) => { if (input) { this.fileSelectorInput = input; } }}
        type="file"
        accept={accept}
        // tslint:disable-next-line:jsx-no-multiline-js
        onChange={() => {
          this.onFileChange();
        }}
        multiple={multiple}
        disabled={disabled}
      />
    );
  }
}
