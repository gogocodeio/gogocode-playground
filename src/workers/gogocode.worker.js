/* eslint-disable no-restricted-globals */
// eslint-disable-next-line no-undef
importScripts('gogocode.js');

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

addEventListener('message', async (event) => {
  const { sourceCode, workCode, sourceCodePath } = event.data;

  function respond(data) {
    setTimeout(() => {
      postMessage({ _id: event.data._id, ...data });
    }, 0);
  }

  try {
    respond({
      transformed: runGoGoCode(sourceCode, workCode, sourceCodePath),
    });
  } catch (error) {
    respond({ error });
  }
});
