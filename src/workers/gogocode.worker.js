/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
// eslint-disable-next-line no-undef

importScripts('https://unpkg.zhimg.com/comlink@4.3.1/dist/umd/comlink.min.js');

function runGoGoCode(sourceCode, workCode, sourceCodePath = '') {
  try {
    // eslint-disable-next-line no-new-func
    const func = new Function('return ' + workCode)();
    return func(
      { source: sourceCode, path: sourceCodePath },
      { gogocode: self.gogocode },
      {},
    ).toString();
  } catch (e) {
    return '/**\n出错了！\n' + e + '\n**/';
  }
}

const worker = {
  importPath: 'https://unpkg.zhimg.com/gogocode/umd/gogocode.min.js',
  importGoGoCode(importPath, cb) {
    if (!self.gogocode) {
      this.importPath = importPath;
      importScripts(importPath);
      cb && cb();
    } else {
      cb && cb();
    }
  },
  runGoGoCode(sourceCode, workCode, sourceCodePath) {
    if (!self.gogocode) {
      importScripts(this.importPath);
      return runGoGoCode(sourceCode, workCode, sourceCodePath);
    } else {
      return runGoGoCode(sourceCode, workCode, sourceCodePath);
    }
  },
};

Comlink.expose(worker);
