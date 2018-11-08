import { LOCAL_STORAGE_SPLIT_SIZES_KEY, SETTINGS_FILE } from './config';

export const el = function (sel) { return document.querySelector(sel); };
export const addStyleString = function (str) {
  const node = document.createElement('style');

  node.innerHTML = str;
  document.body.appendChild(node);
}
export const addScriptString = function (str) {
  const node = document.createElement('script');

  node.innerHTML = str;
  document.body.appendChild(node);
}
export const addJSFile = function (path, done) {
  const node = document.createElement('script');

  node.src = path;
  node.addEventListener('load', done);
  document.body.appendChild(node);
}
export const addCSSFile = function (path, done) {
	// <link rel="stylesheet" type="text/css" href="./assets/css/styles.css" />
  const node = document.createElement('link');

  node.setAttribute('rel', 'stylesheet');
  node.setAttribute('type', 'text/css');
  node.setAttribute('href', path);
  node.addEventListener('load', done);
  document.body.appendChild(node);
}
export const debounce = function (func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};
export const getDemoAndSnippetIdx = function () {
  const hash = window.location.hash;

  if (hash && hash.split(',').length === 2) {
    return hash.split(',')
      .map(value => value.replace('#', ''))
      .map(Number);
  }
  return [0, 0];
}
export const getDemo = function (settings) {
  const [ demoIdx ] = getDemoAndSnippetIdx();

  return settings.demos[demoIdx];
}
export const setSplitting = function () {
  const isLocalStorageAvailable = typeof window.localStorage !== 'undefined';
  const defaultValues = [25, 75];
  const getSizes = () => {
    if (isLocalStorageAvailable) {
      let valueInStorage = localStorage.getItem(LOCAL_STORAGE_SPLIT_SIZES_KEY);

      if (valueInStorage) {
        valueInStorage = valueInStorage.split(',');
        if (valueInStorage.length === 2) {
          return valueInStorage.map(Number);
        }
      }
    }
    return defaultValues;
  }
  const split = Split(['.left', '.right'], {
      sizes: getSizes(),
      gutterSize: 4
  });
  isLocalStorageAvailable && setInterval(() => {
    localStorage.setItem(LOCAL_STORAGE_SPLIT_SIZES_KEY, split.getSizes().join(','))
  }, 4000);
}
export const getSettings = async function () {
  const res = await fetch(SETTINGS_FILE);
  return await res.json();
}
export const getResources = async function (settings) {
  return Promise.all(
    settings.resources.map(resource => {
      return new Promise(done => {
        const extension = resource.split('.').pop().toLowerCase();

        if (extension === 'js') {
          addJSFile(resource, done)
        } else if (extension === 'css') {
          addCSSFile(resource);
          done();
        } else {
          done();
        }
      });
    })
  );
}
export const basename = function (path) {
  return path.split('/').reverse()[0];
}