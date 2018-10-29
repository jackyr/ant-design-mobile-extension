/* tslint:disable:no-bitwise */
export function assignObject(origin: any, target: any) {
  for (let key in target) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      origin[key] = target[key];
    }
  }
}

export function getRotation(orientation = 1) {
  let imgRotation = 0;

  switch (orientation) {
    case 3:
      imgRotation = 180;
      break;
    case 6:
      imgRotation = 90;
      break;
    case 8:
      imgRotation = 270;
      break;
    default:
  }

  return imgRotation;
}

export function readFile(file: Blob, readMethod: 'ArrayBuffer' | 'DataURL' | 'Text', callback: (result: any) => void) {
  const reader = new FileReader();
  let method = 'readAsDataURL';

  reader.onload = e => callback((e.target as any).result);
  reader.onerror = e => {
    console.error(`File could not be read! Code ${(e.target as any).error.code}`);
  };

  if (['ArrayBuffer', 'DataURL', 'Text'].indexOf(readMethod) > -1) {
    method = `readAs${readMethod}`;
  }
  reader[method as 'readAsArrayBuffer' | 'readAsDataURL' | 'readAsText'](file);
}

export function getOrientation(file: File, callback: (orientation: number) => void) {
  readFile(file.slice(0, 64 * 1024), 'ArrayBuffer', (result) => {
    const view = new DataView(result);
    if (view.getUint16(0, false) !== 0xffd8) {
      return callback(-2);
    }
    const length = view.byteLength;
    let offset = 2;

    while (offset < length) {
      const marker = view.getUint16(offset, false);
      offset += 2;
      if (marker === 0xffe1) {
        const tmp = view.getUint32((offset += 2), false);
        if (tmp !== 0x45786966) {
          return callback(-1);
        }
        const little = view.getUint16((offset += 6), false) === 0x4949;
        offset += view.getUint32(offset + 4, little);
        const tags = view.getUint16(offset, little);
        offset += 2;
        for (let i = 0; i < tags; i++) {
          if (view.getUint16(offset + i * 12, little) === 0x0112) {
            return callback(view.getUint16(offset + i * 12 + 8, little));
          }
        }
      } else if ((marker & 0xff00) !== 0xff00) {
        break;
      } else {
        offset += view.getUint16(offset, false);
      }
    }

    return callback(-1);
  });
}

export function processPhoto(
  srcBase64: string,
  option: { maxWidth: number, maxHeight: number, quality: number, orientation: number },
  callback: (targetBase64: string) => void,
) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return callback(srcBase64);
  }

  const img = new Image();
  img.onload = () => {
    const mimeString = srcBase64.split(',')[0].split(':')[1].split(';')[0];
    const orientation = isNaN(option.orientation) ? 1 : option.orientation - 0;
    const originW = img.width;
    const originH = img.height;
    const maxW = isNaN(option.maxWidth) ? 0 : option.maxWidth - 0;
    const maxH = isNaN(option.maxHeight) ? 0 : option.maxHeight - 0;
    let targetW = originW;
    let targetH = originH;
    let targetQ = isNaN(option.quality) ? 0 : option.quality - 0;

    if (maxW && !maxH && originW > maxW) {
      targetW = maxW;
      targetH = Math.round(maxW * (originH / originW));
    } else if (!maxW && maxH && originH > maxH) {
      targetH = maxH;
      targetW = Math.round(maxH * (originW / originH));
    } else if (maxW && maxH && (originW > maxW || originH > maxH)) {
      if (originW / originH > maxW / maxH) {
          targetW = maxW;
          targetH = Math.round(maxW * (originH / originW));
      } else {
          targetH = maxH;
          targetW = Math.round(maxH * (originW / originH));
      }
    }

    canvas.width = orientation > 4 ? targetH : targetW;
    canvas.height = orientation > 4 ? targetW : targetH;

    switch (orientation) {
      case 2:
        ctx.transform(-1, 0, 0, 1, targetW, 0);
        break;
      case 3:
        ctx.transform(-1, 0, 0, -1, targetW, targetH);
        break;
      case 4:
        ctx.transform(1, 0, 0, -1, 0, targetH);
        break;
      case 5:
        ctx.transform(0, 1, 1, 0, 0, 0);
        break;
      case 6:
        ctx.transform(0, 1, -1, 0, targetH, 0);
        break;
      case 7:
        ctx.transform(0, -1, -1, 0, targetH, targetW);
        break;
      case 8:
        ctx.transform(0, -1, 1, 0, 0, targetW);
        break;
      default:
        ctx.transform(1, 0, 0, 1, 0, 0);
    }

    ctx.drawImage(img, 0, 0, targetW, targetH);

    if (targetQ > 1 || targetQ <= 0) {
      targetQ = 0;
    }

    return callback(targetQ ? canvas.toDataURL('image/jpeg', targetQ) : canvas.toDataURL(mimeString));
  };

  img.src = srcBase64;
}

export function dataURItoBlob(base64Data: string) {
  let byteString;
  if (base64Data.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(base64Data.split(',')[1]);
  } else {
    byteString = unescape(base64Data.split(',')[1]);
  }
  const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
  let ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ia], { type: mimeString });
}
