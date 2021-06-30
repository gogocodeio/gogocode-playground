import prettier from 'prettier/standalone';
import parserTypeScript from 'prettier/parser-typescript';
import parserBabel from 'prettier/parser-babel';
import parserHtml from 'prettier/parser-html';
import { parse, stringify } from 'flatted';

export function noop() {}

export function runGoGoCode(
  gogocode: () => any,
  sourceCode: string,
  workCode: string,
  sourceCodePath: string = '',
) {
  try {
    // eslint-disable-next-line no-new-func
    const func = new Function('return ' + workCode)();
    return func(
      { source: sourceCode, path: sourceCodePath },
      { gogocode, parse, stringify },
      {},
    ).toString();
  } catch (e) {
    return '/**\n出错了！\n' + e + '\n**/';
  }
}

export function runPrettier(sourceCode: string, lang: string, printWidth: number = 30) {
  const preserMap: any = {
    javascript: 'babel',
    typescript: 'typescript',
    html: 'vue',
  };
  try {
    return prettier.format(sourceCode, {
      trailingComma: 'es5',
      tabWidth: 2,
      semi: false,
      singleQuote: true,
      printWidth,
      parser: preserMap[lang] || 'typescript',
      plugins: [parserTypeScript, parserBabel, parserHtml],
    });
  } catch (error) {
    return `/** prettier format failed, original file below: ${error} */
${sourceCode}
    `;
  }
}
