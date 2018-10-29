import React from 'react';
import request from './request';
import { BaseType, FileType, HttpRequestHeader } from './PropsType';
import { assignObject } from './utils';

export default class Base<T extends BaseType, S> extends React.Component<T, S> {
  private reqs: any = {};

  constructor(props: T) {
    super(props);
  }

  upload = (imgItem: FileType, fn: () => void) => {
    const { action, data, headers, withCredentials, customRequest, name } = this.props;

    this.onStart(imgItem);
    fn();

    const params = {
      action: action as string,
      filename: name as string,
      file: imgItem.file as File,
      data: data as Object,
      headers: headers as HttpRequestHeader,
      withCredentials: withCredentials as boolean,
      onProgress: (e: any) => {
        this.onProgress(e, imgItem);
      },
      onSuccess: (ret: any) => {
        delete this.reqs[imgItem.uid];
        this.onSuccess(ret, imgItem, () => {
          fn();
        });
      },
      onError: (err: any, ret: any) => {
        delete this.reqs[imgItem.uid];
        this.onError(err, ret, imgItem);
        fn();
      },
    };

    if (customRequest) {
      this.reqs[imgItem.uid] = customRequest(params);
    } else {
      this.reqs[imgItem.uid] = request(params);
    }
  }

  abort(imgItem: FileType) {
    if (this.reqs[imgItem.uid] && this.reqs[imgItem.uid].abort) {
      this.reqs[imgItem.uid].abort();
    }
    imgItem.status = 'removed';
  }

  onStart(imgItem: FileType) {
    imgItem.status = 'uploading';
    imgItem.percent = 0;
    imgItem.response = null;
    imgItem.error = null;
    this.forceUpdate();
  }

  onProgress(e: any, imgItem: FileType) {
    imgItem.percent = e.percent;
    this.forceUpdate();
  }

  onSuccess(ret: any, imgItem: FileType, fn: () => void) {
    const { handleResponse } = this.props;

    imgItem.status = 'done';
    imgItem.response = ret;

    Promise.resolve(typeof handleResponse === 'function' && handleResponse(ret, imgItem)).then(res => {
      if (res === undefined || !!res) {
        if (res !== imgItem) {
          assignObject(imgItem, res);
        }
        this.forceUpdate();
        fn();
      } else {
        this.onError(new Error(), ret, imgItem);
        fn();
      }
    }).catch(res => {
      this.onError(res instanceof Error ? res : new Error(res), ret, imgItem);
      fn();
    });
  }

  onError(err: any, ret: any, imgItem: FileType) {
    imgItem.status = 'error';
    imgItem.response = ret;
    imgItem.error = err;
    this.forceUpdate();
  }
}
