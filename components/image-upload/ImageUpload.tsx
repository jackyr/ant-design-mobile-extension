import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import TouchFeedback from 'rmc-feedback';
import Base from './Base';
import Flex from 'antd-mobile/lib/flex';
import FileInput from './FileInput';
import { ImageUploadPropTypes, InputFileType, FileType } from './PropsType';
import { getRotation, assignObject } from './utils';
import { getComponentLocale } from '../_util/getLocale';

function noop() {}

export default class ImageUpload extends Base<
  ImageUploadPropTypes,
  any
> {
  static FileInput: any;
  static CardUpload: any;
  static utils: any;

  static defaultProps = {
    prefixCls: 'ame-image-upload',
    action: '',
    data: {},
    headers: {},
    name: 'file',
    withCredentials: false,
    onPickChange: noop,
    onChange: noop,
    onImageClick: noop,
    onPickFail: noop,
    handlePick: noop,
    handleResponse: noop,
    handleRemove: noop,
    selectable: true,
    multiple: false,
    accept: 'image/*',
    length: 4,
  };

  static contextTypes = {
    antLocale: PropTypes.object,
  };

  private gIndex: number = 0;

  constructor(props: ImageUploadPropTypes) {
    super(props);
    let value;
    if ('value' in props) {
      value = props.value;
    } else if ('defaultValue' in props) {
      value = props.defaultValue;
    } else {
      value = [];
    }
    this.state = {
      files: this.initFiles(value),
    };
  }

  componentWillReceiveProps(nextProps: ImageUploadPropTypes) {
    if ('value' in nextProps) {
      this.setState({
        files: this.initFiles(nextProps.value),
      });
    }
  }

  getUid = () => `ame-image-upload-${Date.now()}-${this.gIndex++}`;

  initFiles = (files: Array<InputFileType> = []) => {
    files.forEach(v => {
      if (!v.uid) {
        v.uid = this.getUid();
      }
      if (!v.file) {
        v.file = null;
      }
      if (!v.orientation) {
        v.orientation = 1;
      }
    });
    return files;
  }

  removeImage = (imgItem: FileType) => {
    const { handleRemove } = this.props;
    const { files = [] } = this.state;

    Promise.resolve(typeof handleRemove === 'function' && handleRemove(imgItem, files)).then(res => {
      if (res === undefined || !!res) {
        const newImages: any[] = [];
        files.forEach((image: FileType) => {
          if (image !== imgItem) {
            newImages.push(image);
          }
        });
        this.setState({
          files: newImages,
        });

        if (this.props.onPickChange) {
          this.props.onPickChange(newImages, 'remove', imgItem);
        }
        if (this.props.action) {
          this.abort(imgItem);
        }
        if (this.props.onChange) {
          this.props.onChange(newImages, 'remove', imgItem);
        }
      }
    }).catch(noop);
  }

  addImage = (imgItem: FileType) => {
    const { handlePick } = this.props;
    const { files = [] } = this.state;

    Promise.resolve(typeof handlePick === 'function' && handlePick(imgItem, files)).then(res => {
      if (res === undefined || !!res) {
        if (res !== imgItem) {
          assignObject(imgItem, res);
        }

        const newImages = files.concat(imgItem);
        this.setState({
          files: newImages,
        });

        if (this.props.onPickChange) {
          this.props.onPickChange(newImages, 'add', imgItem);
        }
        if (this.props.action) {
          this.upload(imgItem, () => {
            if (this.props.onChange) {
              this.props.onChange(newImages, 'add', imgItem);
            }
          });
        } else {
          if (this.props.onChange) {
            this.props.onChange(newImages, 'add', imgItem);
          }
        }
      }
    }).catch(noop);
  }

  onPickSuccess = (url: any, orientation: number, file: File) => {
    this.addImage({
      url,
      uid: this.getUid(),
      orientation,
      file,
    });
  }

  onPickFail = (msg: string) => {
    if (this.props.onPickFail) {
      this.props.onPickFail(msg);
    }
  }

  retryUpload = (imgItem: FileType) => {
    const { files = [] } = this.state;
    this.upload(imgItem, () => {
      if (this.props.onChange) {
        this.props.onChange(files, 'add', imgItem);
      }
    });
  }

  onImageClick = (file: FileType) => {
    if (this.props.onImageClick) {
      this.props.onImageClick(file, this.state.files);
    }
  }

  render() {
    const {
      prefixCls,
      style,
      className,
      selectable,
      multiple,
      accept,
      children,
    } = this.props;

    const { files = [] } = this.state;

    const { imageUpload: locale } = getComponentLocale(
      this.props,
      this.context,
      'ImageUpload',
      () => require('./locale/zh_CN'),
    );

    const imgItemList: any[] = [];
    let count = parseInt('' + this.props.length, 10);
    if (count <= 0) {
      count = 4;
    }

    files.forEach((image: FileType) => {
      const imgStyle = {
        backgroundImage: `url(${image.url})`,
        transform: `rotate(${getRotation(image.orientation)}deg)`,
      };
      const showMask = image.status && ['uploading', 'error'].indexOf(image.status) > -1;
      const maskBgStyle = image.status === 'uploading' ? {
        opacity: (100 - (Math.floor((image.percent || 0) > 90 ? 90 : (image.percent || 0)))) / 100,
      }  : undefined;
      const percentTxt = `${Math.floor((image.percent || 0) > 99 ? 99 : (image.percent || 0))}%`;

      imgItemList.push(
        <Flex.Item
          key={`item-${image.uid}`}
        >
          <div className={`${prefixCls}-item`}>
            <div
              className={`${prefixCls}-item-remove`}
              role="button"
              aria-label="Click and Remove this image"
              // tslint:disable-next-line:jsx-no-multiline-js
              onClick={() => {
                this.removeImage(image);
              }}
            />
            <div
              className={`${prefixCls}-item-content`}
              role="button"
              aria-label="Image can be clicked"
              // tslint:disable-next-line:jsx-no-multiline-js
              onClick={() => {
                this.onImageClick(image);
              }}
              style={imgStyle}
            />
            {/* tslint:disable-next-line:jsx-no-multiline-js */}
            {showMask && <div
              className={`${prefixCls}-item-mask`}
              onClick={image.status === 'error' ? () => this.retryUpload(image) : () => {}}
            >
              <div className="item-mask-bg" style={maskBgStyle} />
              <div
                // tslint:disable-next-line:jsx-no-multiline-js
                className={classnames({
                  'item-mask-msg': true,
                  'item-mask-msg-err': image.status === 'error',
                })}
              >
                {image.status === 'error' ? locale.failed : locale.uploading}
                <br/>
                {image.status === 'error' ? locale.retry : percentTxt}
              </div>
            </div>}
          </div>
        </Flex.Item>,
      );
    });

    const selectEl = (
      <Flex.Item key="select">
        <TouchFeedback activeClassName={`${prefixCls}-btn-active`}>
          <div
            className={`${prefixCls}-item ${prefixCls}-btn`}
            role="button"
            aria-label="Choose and add image"
          >
            {children || <div className={`${prefixCls}-select`}>
              <div className="select-icon" />
            </div>}
            <FileInput
              accept={accept}
              multiple={multiple}
              onPickSuccess={this.onPickSuccess}
              onPickFail={this.onPickFail}
            />
          </div>
        </TouchFeedback>
      </Flex.Item>
    );

    let allEl = selectable ? imgItemList.concat([selectEl]) : imgItemList;
    const length = allEl.length;
    if (length !== 0 && length % count !== 0) {
      const blankCount = count - length % count;
      const fillBlankEl: any[] = [];
      for (let i = 0; i < blankCount; i++) {
        fillBlankEl.push(<Flex.Item key={`blank-${i}`} />);
      }
      allEl = allEl.concat(fillBlankEl);
    }
    const flexEl: any[][] = [];
    for (let i = 0; i < allEl.length / count; i++) {
      const rowEl = allEl.slice(i * count, i * count + count);
      flexEl.push(rowEl);
    }
    const renderEl = flexEl.map((item, index) => (
      <Flex key={`flex-${index}`}>{item}</Flex>
    ));

    return (
      <div className={classnames(`${prefixCls}`, className)} style={style}>
        <div className={`${prefixCls}-list`} role="group">
          {renderEl}
        </div>
      </div>
    );
  }
}
