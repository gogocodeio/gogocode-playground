import { useMemo, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import clsx from 'clsx';
import copy from 'copy-to-clipboard';
import { useWindowSize } from 'react-use';
import { runPrettier, runGoGoCode } from '../utils/index';

import BaseEditor from './BaseEditor';
import DiffEditor from './DiffEditor';
import SplitPane from 'react-split-pane';
import { Switch, Button, Select, message } from 'antd';
import { useHashState } from '../hooks/useHashState';

const defaultWorkCode = runPrettier(`function transform($, sourceCode) {
  // 在这里返回你生成的代码
  return $(sourceCode).replace('const a = $_$', 'const a = 2').generate();
}`);
const defaultInputCode = runPrettier(`const a = 1;const b = 2`);

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

export default forwardRef(function PlayGround(props: { className?: string }, ref) {
  const hasSourceCode = true;
  const { width: winWidth, height: winHeight } = useWindowSize();

  const [hasPrettier, setHasPrettier] = useState(true);

  const [inputCode, setInputCode] = useState(defaultInputCode);
  const [workCode, setWorkCode] = useState(defaultWorkCode);
  const [inputLang, setInputLang] = useState('typescript');

  const [hashState, setHashState] = useHashState({
    inputCode: defaultInputCode,
    workCode: defaultWorkCode,
    inputLang: 'typescript',
  });

  useEffect(() => {
    setInputCode(hashState.inputCode);
    setWorkCode(hashState.workCode);
    setInputLang(hashState.inputLang);
  }, [hashState]);

  const transformedCode = useMemo(() => runGoGoCode(inputCode, workCode), [inputCode, workCode]);

  const prettierInputCode = useMemo(() => {
    return hasPrettier ? runPrettier(inputCode) : inputCode;
  }, [hasPrettier, inputCode]);

  const prettierTranformedCode = useMemo(() => {
    return hasPrettier ? runPrettier(transformedCode) : transformedCode;
  }, [hasPrettier, transformedCode]);

  const reset = () => {
    setWorkCode(defaultWorkCode);
    setInputCode(defaultInputCode);
    setInputLang('typescript');
  };

  useImperativeHandle(ref, () => ({
    shareCode: () => {
      setHashState({
        inputCode,
        workCode,
        inputLang,
      });
      const sucess = copy(window.location.href);
      if (sucess) {
        message.success('URL 已生成并拷贝到剪贴板', 3);
      }
    },
  }));

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
              <BaseEditor code={inputCode} onChange={setInputCode} language={inputLang} />
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
          <DiffEditor
            code1={prettierInputCode}
            code2={prettierTranformedCode}
            language={inputLang}
          />
        </div>
      </SplitPane>
    </div>
  );
});
