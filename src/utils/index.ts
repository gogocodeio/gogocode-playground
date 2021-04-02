import $ from 'gogocode';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';
import parserHtml from 'prettier/parser-html';

export function runGoGoCode(sourceCode: string, workCode: string) {
  try {
    // eslint-disable-next-line no-new-func
    const func = new Function('return ' + workCode)();
    return func($, sourceCode);
  } catch (e) {
    return '/**\n出错了！\n' + e + '\n**/';
  }
}

export function runPrettier(sourceCode: string) {
  try {
    return prettier.format(sourceCode, {
      trailingComma: 'es5',
      tabWidth: 2,
      semi: false,
      singleQuote: true,
      printWidth: 40,
      plugins: [parserBabel, parserHtml],
    });
  } catch (error) {
    return error.toString();
  }
}
