import { useMemo, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import clsx from 'clsx';
import copy from 'copy-to-clipboard';
import { useLocation, useWindowSize, useDebounce } from 'react-use';
import { runPrettier } from '../utils/index';
import { VSCodeContainer } from '../vscode-container';
import { GoGoCodeConatiner } from '../gogocode-container';
import BaseEditor from './BaseEditor';
import DiffEditor from './DiffEditor';
import SplitPane from 'react-split-pane';
import { Switch, Button, Select, message } from 'antd';
import { useHashState } from '../hooks/useHashState';

const defaultInputLang = 'typescript';
const defaultHasPrettier = true;
const defaultCompareOutput = true;

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
    label: 'HTML/Vue',
  },
];

export default forwardRef(function PlayGround(props: { className?: string }, ref) {
  const {
    isInVsCode,
    currentPath,
    currentContent,
    setCurrentPath,
    treeData,
    replaceOne: _replaceOne,
    replaceAll: _replaceAll,
  } = VSCodeContainer.useContainer();

  const { runGoGoCode } = GoGoCodeConatiner.useContainer();

  const hasSourceCode = !isInVsCode;

  const defaultWorkCode = useMemo(
    () =>
      isInVsCode
        ? runPrettier(
            `function transform(fileInfo, api, options) {
          const $ = api.gogocode;
          const source = fileInfo.source;
          // 在这里返回你生成的代码
          return $(source).replace('const a = $_$', 'const a = 2').generate();
        }`,
            'javascript',
            70,
          )
        : runPrettier(
            `function transform(fileInfo, api, options) {
          const $ = api.gogocode;
          const source = fileInfo.source;
          // 在这里返回你生成的代码
          return $(source).replace('const a = $_$', 'const a = 2').generate();
        }`,
            'javascript',
            70,
          ),
    [isInVsCode],
  );

  const defaultInputCode = useMemo(
    () =>
      isInVsCode
        ? runPrettier(
            `// 请右键选择要转换的文件，点击菜单中的用 GoGoCode 转换
        const a = 1;const b = 2;`,
            'javascript',
          )
        : runPrettier(`const a = 1;const b = 2`, 'javascript'),
    [isInVsCode],
  );

  const defaultHashState = {
    inputCode: defaultInputCode,
    workCode: defaultWorkCode,
    inputLang: defaultInputLang,
    hasPrettier: defaultHasPrettier,
    compareOutput: defaultCompareOutput,
  };

  const { width: winWidth, height: winHeight } = useWindowSize();

  const [hasPrettier, setHasPrettier] = useState(defaultHasPrettier);
  const [compareOutput, setCompareOutput] = useState(defaultCompareOutput);

  const [inputCode, setInputCode] = useState(defaultInputCode);
  const [workCode, setWorkCode] = useState(defaultWorkCode);
  const [inputLang, setInputLang] = useState(defaultInputLang);

  const [hashState, setHashState] = useHashState(defaultHashState);
  const location = useLocation();

  const [transformedCode, setTransformedCode] = useState('');

  useDebounce(
    async () => {
      const transformed = await runGoGoCode(inputCode, workCode, currentPath);
      setTransformedCode(transformed);
    },
    200,
    [inputCode, workCode, currentPath],
  );

  const prettierInputCode = useMemo(() => {
    return hasPrettier ? runPrettier(inputCode, inputLang) : inputCode;
  }, [hasPrettier, inputCode, inputLang]);

  const prettierTranformedCode = useMemo(() => {
    return hasPrettier ? runPrettier(transformedCode, inputLang) : transformedCode;
  }, [hasPrettier, transformedCode, inputLang]);

  useEffect(() => {
    setInputCode(hashState.inputCode);
    setWorkCode(hashState.workCode);
    setInputLang(hashState.inputLang);
    setHasPrettier(hashState.hasPrettier);
    setCompareOutput(hashState.compareOutput);
  }, [hashState]);

  useEffect(() => {
    if (currentContent) {
      setInputCode(currentContent);
    }
  }, [currentContent]);

  const reset = () => {
    setInputCode(defaultInputCode);
    setWorkCode(defaultWorkCode);
    setInputLang(defaultInputLang);
    window.history.pushState('', document.title, location.pathname || '' + location.search);
    isInVsCode && setCurrentPath('');
  };

  const restartWorker = async () => {
    const transformed = await runGoGoCode(inputCode, workCode, currentPath, true);
    setTransformedCode(transformed);
  };

  const shareCode = () => {
    setHashState({
      inputCode,
      workCode,
      inputLang,
      hasPrettier,
      compareOutput,
    });
    const link = isInVsCode
      ? `https://play.gogocode.io/${window.location.hash}`
      : window.location.href;
    const sucess = copy(link);
    if (sucess) {
      message.success('URL 已生成并拷贝到剪贴板', 2);
    }
  };

  const replaceOne = () => {
    if (!currentPath) {
      message.error('请先选择文件进行转换', 2);
      return;
    }
    _replaceOne(currentPath, transformedCode);
  };

  const replaceAll = () => {
    _replaceAll(treeData, workCode);
  };

  useImperativeHandle(ref, () => ({
    shareCode,
    replaceOne,
    replaceAll,
  }));

  const InputCodePane = (
    <div className="h-full">
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
      <BaseEditor
        code={inputCode}
        onChange={setInputCode}
        language={inputLang}
        onSave={shareCode}
      />
    </div>
  );

  const workCodePane = (
    <div className="h-full">
      <div className="bg-dark flex justify-between px-6 py-2 text-white border-gray-800 border-t">
        <div>转换代码(JavaScript)</div>
        <div>
          <Button type="link" onClick={reset}>
            重置代码
          </Button>
          <Button
            type="link"
            onClick={() => {
              setWorkCode(runPrettier(workCode, 'javascript', 70));
            }}
          >
            格式化
          </Button>
          <Button type="link" onClick={restartWorker}>
            重启转换服务
          </Button>
        </div>
      </div>
      <BaseEditor
        code={workCode}
        onChange={setWorkCode}
        language="javascript"
        onSave={() => {
          setWorkCode(runPrettier(workCode, 'javascript', 70));
          shareCode();
        }}
      />
    </div>
  );

  return (
    <div className={clsx(props.className, 'relative')}>
      <SplitPane split="horizontal" defaultSize="55%" minSize={100} maxSize={winHeight - 130}>
        {hasSourceCode ? (
          <SplitPane
            className="h-full w-full"
            split="vertical"
            defaultSize={hasSourceCode ? '49%' : '100%'}
            minSize={300}
            maxSize={winWidth - 300}
          >
            {InputCodePane}
            {workCodePane}
          </SplitPane>
        ) : (
          <div className="h-full w-full">{workCodePane}</div>
        )}

        <div className="h-full w-full">
          <div className="bg-dark flex justify-between px-6 py-2 text-white border-gray-800 border-t">
            <div className="flex">
              <div className="mr-5">{compareOutput ? '输入文件' : '输出文件'}</div>
              {currentPath && <span>{currentPath}</span>}
            </div>
            <div className="flex items-center">
              {compareOutput && <div className="mr-5">输出文件</div>}
              {isInVsCode && (
                <Select
                  options={INPUT_LANG_LIST}
                  value={inputLang}
                  onSelect={setInputLang}
                  className="w-32 mr-5"
                />
              )}
              <Switch
                className="mr-3"
                checkedChildren="对比"
                unCheckedChildren="对比"
                checked={compareOutput}
                onChange={setCompareOutput}
              />

              <Switch
                checkedChildren="格式化"
                unCheckedChildren="格式化"
                checked={hasPrettier}
                onChange={setHasPrettier}
              />
            </div>
          </div>
          {compareOutput ? (
            <DiffEditor
              code1={prettierInputCode}
              code2={prettierTranformedCode}
              language={inputLang}
            />
          ) : (
            <BaseEditor code={prettierTranformedCode} readOnly={true} language={inputLang} />
          )}
        </div>
      </SplitPane>
    </div>
  );
});
