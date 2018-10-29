import { ReactNode } from 'react';

export interface HttpRequestHeader {
  [key: string]: string;
}

export interface InputFileType {
  url: string;
  [propName: string]: any;
}

export interface FileType {
  url: string;
  uid: string;
  file: File | null;
  orientation: number;
  status?: 'uploading' | 'done' | 'error' | 'removed';
  percent?: number;
  response?: any;
  error?: any;
  [propName: string]: any;
}

export interface FileInputPropTypes {
  prefixCls?: string;
  className?: string;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  onPickSuccess?: (url: string, orientation: number, file: File) => void;
  onPickFail?: (msg: string) => void;
}

export interface RequestParam {
  action: string;
  filename: string;
  file: File;
  headers: HttpRequestHeader;
  data: Object;
  withCredentials: boolean;
  onProgress: (e: any) => void;
  onSuccess: (ret: any) => void;
  onError: (err: any, ret: any) => void;
}

export interface BaseType {
  action?: string;
  headers?: HttpRequestHeader;
  data?: Object;
  name?: string;
  withCredentials?: boolean;
  handleResponse?: (response: any, file?: FileType) => void | FileType | boolean | PromiseLike<any>;
  customRequest?: (param: RequestParam) => { abort?: () => void };
}

export interface ImageUploadPropTypes extends BaseType {
  prefixCls?: string;
  className?: string;
  style?: {};
  value?: Array<InputFileType>;
  defaultValue?: Array<InputFileType>;
  selectable?: boolean;
  multiple?: boolean;
  accept?: string;
  length?: number | string;
  children?: ReactNode;
  onPickChange?: (files: Array<FileType>, operationType: string, file: FileType) => void;
  onPickFail?: (msg: string) => void;
  onChange?: (files: Array<FileType>, operationType: string, file: FileType) => void;
  onImageClick?: (file: FileType, files: Array<FileType>) => void;
  handlePick?: (file: FileType, FileList: Array<FileType>) => void | FileType | boolean | PromiseLike<any>;
  handleRemove?: (file: FileType, FileList: Array<FileType>) => void | FileType | boolean | PromiseLike<any>;
}

export interface CardUploadPropTypes extends BaseType {
  prefixCls?: string;
  className?: string;
  style?: {};
  value?: InputFileType;
  defaultValue?: InputFileType;
  selectable?: boolean;
  accept?: string;
  children?: ReactNode;
  customRender?: (context: any) => ReactNode;
  onPickChange?: (file: FileType) => void;
  onPickFail?: (msg: string) => void;
  onChange?: (file: FileType) => void;
  handlePick?: (file: FileType) => void | FileType | boolean | PromiseLike<any>;
}
