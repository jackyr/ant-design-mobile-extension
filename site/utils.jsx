/* eslint no-useless-escape: 0 */
export function getMenuItems(moduleData, locale, categoryOrder, typeOrder) {
  const menuMeta = moduleData.map(item => item.meta);
  const menuItems = [];
  const sortFn = (a, b) => (a.order || 0) - (b.order || 0);
  menuMeta.sort(sortFn).forEach((meta) => {
    if (!meta.category) {
      menuItems.push(meta);
    } else {
      const category = meta.category[locale] || meta.category;
      let group = menuItems.filter(i => i.title === category)[0];
      if (!group) {
        group = {
          type: 'category',
          title: category,
          children: [],
          order: categoryOrder[category],
        };
        menuItems.push(group);
      }
      if (meta.type) {
        let type = group.children.filter(i => i.title === meta.type)[0];
        if (!type) {
          type = {
            type: 'type',
            title: meta.type,
            children: [],
            order: typeOrder[meta.type],
          };
          group.children.push(type);
        }
        type.children.push(meta);
      } else {
        group.children.push(meta);
      }
    }
  });
  return menuItems.map((i) => {
    if (i.children) {
      i.children = i.children.sort(sortFn);
    }
    return i;
  }).sort(sortFn);
}

export function isZhCN(pathname) {
  return /-cn\/?$/.test(pathname);
}

export function getLocalizedPathname(path, zhCN) {
  const pathname = path.startsWith('/') ? path : `/${path}`;
  if (!zhCN) { // to enUS
    return /\/?index-cn/.test(pathname) ? '/' : pathname.replace('-cn', '');
  } else if (pathname === '/') {
    return '/index-cn';
  } else if (pathname.endsWith('/')) {
    return pathname.replace(/\/$/, '-cn/');
  }
  return `${pathname}-cn`;
}

export function ping(callback) {
  // eslint-disable-next-line
  const url = 'https://private-a' + 'lipay' + 'objects.alip' + 'ay.com/alip' + 'ay-rmsdeploy-image/rmsportal/RKuAiriJqrUhyqW.png';
  const img = new Image();
  let done;
  const finish = (status) => {
    if (!done) {
      done = true;
      img.src = '';
      callback(status);
    }
  };
  img.onload = () => finish('responded');
  img.onerror = () => finish('error');
  img.src = url;
  return setTimeout(() => finish('timeout'), 1500);
}

export function isLocalStorageNameSupported() {
  const testKey = 'test';
  const storage = window.localStorage;
  try {
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
}

export function collectDocs(docs) {
  // locale copy from layout
  const locale = (window.localStorage && localStorage.getItem('locale') !== 'en-US') ?
    'zh-CN' : 'en-US';
  const docsList = Object.keys(docs)
    .map(key => docs[key])
    .map((value) => {
      if (typeof value !== 'function') {
        return value[locale] || value.index[locale] || value.index;
      }
      return value;
    })
    .map(fn => fn());
  return docsList;
}

export function getQuery(key) {
  const val = window.location.search
    .replace(/^\?/, '')
    .split('&')
    .filter(item => item)
    .map(item => item.split('='))
    .find(item => item[0] && item[0] === key);

  return val && val[1];
}

export function injectPreactDevtool() {
  /* eslint-disable no-undef,global-require, no-console */
  if (typeof PREACT_DEVTOOLS !== 'undefined' && PREACT_DEVTOOLS) {
    console.log('inject preact devtools');
    require('preact/debug');
  }
}
