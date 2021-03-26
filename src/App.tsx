import { useMemo, useState } from 'react';
import './App.css';
import BaseEditor from './components/BaseEditor';
import DiffEditor from './components/DiffEditor';
import SplitPane from 'react-split-pane';
import $ from 'gogocode';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';
import parserHtml from 'prettier/parser-html';
import { Switch } from 'antd';
import useWindowSize from './hooks/useWindowSize';

const defaultWorkCode = `function transform($, sourceCode) {
  // 在这里返回你生成的代码
  return $(sourceCode).replace('const a = $_$', 'const a = 2').generate();
}`;
const defaultCode1 = `const a = 1
const b = 2`;

function runGoGoCode(sourceCode: string, workCode: string) {
  try {
    // eslint-disable-next-line no-new-func
    const func = new Function('return ' + workCode)();
    return func($, sourceCode);
  } catch (e) {
    return '/**\n出错了！\n' + e + '\n**/';
  }
}

function runPrettier(sourceCode: string) {
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

function App() {
  const hasSourceCode = true;
  const [hasPrettier, setHasPrettier] = useState(true);
  const [workCode, setWorkCode] = useState(defaultWorkCode);
  const [code1, setCode1] = useState(defaultCode1);
  const code2 = runGoGoCode(code1, workCode);

  const code1ToShow = useMemo(() => {
    return hasPrettier ? runPrettier(code1) : code1;
  }, [hasPrettier, code1]);

  const code2ToShow = useMemo(() => {
    return hasPrettier ? runPrettier(code2) : code2;
  }, [hasPrettier, code2]);

  const { width: winWidth, height: winHeight } = useWindowSize();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="text-xl bg-dark flex-none px-6 py-4 text-white">
        GoGoCode PlayGround
      </div>
      <div className="relative flex-auto">
        <SplitPane
          split="horizontal"
          defaultSize="50%"
          minSize={100}
          maxSize={winHeight - 100}
        >
          <SplitPane
            className="h-full w-full"
            split="vertical"
            defaultSize={hasSourceCode ? '50%' : '100%'}
            minSize={100}
            maxSize={winWidth - 100}
          >
            {hasSourceCode && (
              <div className="h-full flex-1">
                <BaseEditor
                  code={code1}
                  onChange={setCode1}
                  language="typescript"
                />
              </div>
            )}
            <div className="h-full flex-1">
              <BaseEditor
                code={workCode}
                onChange={setWorkCode}
                language="javascript"
              />
            </div>
          </SplitPane>
          <div className="h-full w-full">
            <div className="bg-dark flex justify-between px-6 py-2 text-white border-gray-800 border-t">
              <div>对比结果</div>
              <div>
                <Switch
                  checkedChildren="格式化"
                  unCheckedChildren="格式化"
                  checked={hasPrettier}
                  onChange={setHasPrettier}
                />
              </div>
            </div>
            <DiffEditor code1={code1ToShow} code2={code2ToShow} />
          </div>
        </SplitPane>
      </div>
    </div>
  );
}

export default App;
