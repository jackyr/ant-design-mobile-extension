import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import TouchFeedback from 'rmc-feedback';
import Base from './Base';
import FileInput from './FileInput';
import { CardUploadPropTypes, InputFileType, FileType } from './PropsType';
import { assignObject } from './utils';
import { getComponentLocale } from '../_util/getLocale';

function noop() {}

export default class CardUpload extends Base<
  CardUploadPropTypes,
  any
> {
  static defaultProps = {
    prefixCls: 'ame-image-upload-card',
    action: '',
    data: {},
    headers: {},
    name: 'file',
    withCredentials: false,
    onChange: noop,
    onPickFail: noop,
    handlePick: noop,
    handleResponse: noop,
    selectable: true,
    accept: 'image/*',
  };

  static contextTypes = {
    antLocale: PropTypes.object,
  };

  private gIndex: number = 0;

  constructor(props: CardUploadPropTypes) {
    super(props);
    let value;
    if ('value' in props) {
      value = props.value;
    } else if ('defaultValue' in props) {
      value = props.defaultValue;
    }

    this.state = {
      file: this.initFile(value),
    };
  }

  componentWillReceiveProps(nextProps: CardUploadPropTypes) {
    if ('value' in nextProps) {
      this.setState({
        file: this.initFile(nextProps.value),
      });
    }
  }

  getUid = () => `ame-image-upload-${Date.now()}-${this.gIndex++}`;

  initFile = (file?: InputFileType) => {
    if (!file) {
      return null;
    }
    if (!file.uid) {
      file.uid = this.getUid();
    }
    if (!file.file) {
      file.file = null;
    }
    if (!file.orientation) {
      file.orientation = 1;
    }
    return file;
  }

  addImage = (imgItem: FileType) => {
    const { handlePick } = this.props;

    Promise.resolve(typeof handlePick === 'function' && handlePick(imgItem)).then(res => {
      if (res === undefined || !!res) {
        if (res !== imgItem) {
          assignObject(imgItem, res);
        }

        this.setState({
          file: imgItem,
        });

        if (this.props.onPickChange) {
          this.props.onPickChange(imgItem);
        }
        if (this.props.action) {
          this.upload(imgItem, () => {
            if (this.props.onChange) {
              this.props.onChange(imgItem);
            }
          });
        } else {
          if (this.props.onChange) {
            this.props.onChange(imgItem);
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
    this.upload(imgItem, () => {
      if (this.props.onChange) {
        this.props.onChange(imgItem);
      }
    });
  }

  render() {
    const { prefixCls, className, style, selectable, accept, children, customRender }  = this.props;
    const { file } = this.state;

    const { cardUpload: locale } = getComponentLocale(
      this.props,
      this.context,
      'ImageUpload',
      () => require('./locale/zh_CN'),
    );

    const imgStyle = file ? {
      backgroundImage: `url(${file.url})`,
    } : {};

    const showMask = file && file.status && ['uploading', 'error'].indexOf(file.status) > -1;

    const msg = file && file.status === 'error' ? (
      <div className="item-mask-msg-err">{locale.failed}</div>
    ) : (<div>
      <span className="loading" />
      <span className="icon-text">{locale.uploading}</span>
    </div>);

    const selectEl = children || (
      <div className={`${prefixCls}-select`}>
        <div className="select-icon" />
        <div className="select-text">{locale.select}</div>
      </div>
    );

    const renderEl = file ? (
      <div
        className={`${prefixCls}-item-wrap`}
        style={!showMask ? { zIndex: 0 } : {}}
      >
        <div className={`${prefixCls}-item-content`} style={imgStyle} />
        {/* tslint:disable-next-line:jsx-no-multiline-js */}
        {showMask && <div
          className={`${prefixCls}-item-mask`}
          onClick={file.status === 'error' ? () => this.retryUpload(file) : () => {}}
        >
          <div className="item-mask-bg" />
          <div className="item-mask-msg">{msg}</div>
        </div>}
      </div>
    ) : selectEl;

    return (
      <div className={classnames(`${prefixCls}`, className)} style={style}>
        <TouchFeedback activeClassName={`${prefixCls}-btn-active`}>
          <div
            className={`${prefixCls}-item ${prefixCls}-btn`}
            role="button"
            aria-label="Choose and add image"
          >
            {typeof customRender === 'function' && customRender(this) || (file ? renderEl : selectEl)}
            <FileInput
              disabled={!selectable}
              accept={accept}
              onPickSuccess={this.onPickSuccess}
              onPickFail={this.onPickFail}
            />
          </div>
        </TouchFeedback>
      </div>
    );
  }
}
