import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { useLocalStorageState } from 'ahooks';
import useWindowSize from '../hooks/useWindowSize';
import { runPrettier, runGoGoCode } from '../utils/index';

import BaseEditor from './BaseEditor';
import DiffEditor from './DiffEditor';
import SplitPane from 'react-split-pane';
import { Switch, Button, Select } from 'antd';

const defaultWorkCode = runPrettier(`function transform($, sourceCode) {
  // 在这里返回你生成的代码
  return $(sourceCode).replace('const a = $_$', 'const a = 2').generate();
}`);
const defaultCode1 = runPrettier(`const a = 1;const b = 2`);

const INPUT_LANG_LIST = [
  {
    value: 'typescript',
    label: 'TypeScript',
  },
  {
    value: 'javascript',
    label: 'JavaScript',
  },
  {
    value: 'html',
    label: 'HTML',
  },
];

export default function PlayGround(props: { className?: string }) {
  const hasSourceCode = true;
  const [hasPrettier, setHasPrettier] = useState(true);
  const [workCode = defaultWorkCode, setWorkCode] = useLocalStorageState(
    'transformCode',
    defaultWorkCode,
  );
  const [code1 = defaultCode1, setCode1] = useLocalStorageState('inputCode', defaultCode1);

  const code2 = useMemo(() => runGoGoCode(code1, workCode), [code1, workCode]);

  const code1ToShow = useMemo(() => {
    return hasPrettier ? runPrettier(code1) : code1;
  }, [hasPrettier, code1]);

  const code2ToShow = useMemo(() => {
    return hasPrettier ? runPrettier(code2) : code2;
  }, [hasPrettier, code2]);

  const [inputLang = 'typescript', setInputLang] = useLocalStorageState('inputLang', 'typescript');

  const reset = () => {
    setWorkCode(defaultWorkCode);
    setCode1(defaultCode1);
    setInputLang('typescript');
  };

  const { width: winWidth, height: winHeight } = useWindowSize();
  return (
    <div className={clsx(props.className, 'relative')}>
      <SplitPane split="horizontal" defaultSize="55%" minSize={100} maxSize={winHeight - 130}>
        <SplitPane
          className="h-full w-full"
          split="vertical"
          defaultSize={hasSourceCode ? '49%' : '100%'}
          minSize={100}
          maxSize={winWidth - 100}
        >
          {hasSourceCode && (
            <div className="h-full flex-1">
              <div className="bg-dark flex justify-between px-6 py-2 text-white border-gray-800 border-t">
                <div>待转换代码</div>
                <div>
                  <Select
                    options={INPUT_LANG_LIST}
                    value={inputLang}
                    onSelect={setInputLang}
                    className="w-32"
                  />
                </div>
              </div>
              <BaseEditor code={code1} onChange={setCode1} language={inputLang} />
            </div>
          )}
          <div className="h-full flex-1">
            <div className="bg-dark flex justify-between px-6 py-2 text-white border-gray-800 border-t">
              <div>转换代码(JavaScript)</div>
              <div>
                <Button type="link" className="mr5" onClick={reset}>
                  重置代码
                </Button>
                <Button
                  type="link"
                  onClick={() => {
                    setWorkCode(runPrettier(workCode));
                  }}
                >
                  格式化
                </Button>
              </div>
            </div>
            <BaseEditor code={workCode} onChange={setWorkCode} language="javascript" />
          </div>
        </SplitPane>
        <div className="h-full w-full">
          <div className="bg-dark flex justify-between px-6 py-2 text-white border-gray-800 border-t">
            <div>转换结果对比</div>
            <div>
              <Switch
                checkedChildren="格式化"
                unCheckedChildren="格式化"
                checked={hasPrettier}
                onChange={setHasPrettier}
              />
            </div>
          </div>
          <DiffEditor code1={code1ToShow} code2={code2ToShow} language={inputLang} />
        </div>
      </SplitPane>
    </div>
  );
}
