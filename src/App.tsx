import { useMemo, useState } from "react";
import { useLocalStorageState } from "ahooks";
import "./App.css";
import BaseEditor from "./components/BaseEditor";
import DiffEditor from "./components/DiffEditor";
import SplitPane from "react-split-pane";
import { Switch, Button, Select } from "antd";
import useWindowSize from "./hooks/useWindowSize";
import { runPrettier, runGoGoCode } from "./utils/index";

const INPUT_LANG_LIST = [
  {
    value: "typescript",
    label: "typescript",
  },
  {
    value: "javascript",
    label: "javascript",
  },
  {
    value: "html",
    label: "html",
  },
];

const defaultWorkCode = runPrettier(`function transform($, sourceCode) {
  // 在这里返回你生成的代码
  return $(sourceCode).replace('const a = $_$', 'const a = 2').generate();
}`);
const defaultCode1 = runPrettier(`const a = 1;const b = 2`);

function App() {
  const hasSourceCode = true;
  const [hasPrettier, setHasPrettier] = useState(true);
  const [workCode = defaultWorkCode, setWorkCode] = useLocalStorageState(
    "transformCode",
    defaultWorkCode
  );
  const [code1 = defaultCode1, setCode1] = useLocalStorageState(
    "inputCode",
    defaultCode1
  );

  const code2 = useMemo(() => runGoGoCode(code1, workCode), [code1, workCode]);

  const code1ToShow = useMemo(() => {
    return hasPrettier ? runPrettier(code1) : code1;
  }, [hasPrettier, code1]);

  const code2ToShow = useMemo(() => {
    return hasPrettier ? runPrettier(code2) : code2;
  }, [hasPrettier, code2]);

  const [inputLang = "typescript", setInputLang] = useLocalStorageState(
    "inputLang",
    "typescript"
  );

  const reset = () => {
    setWorkCode(defaultWorkCode);
    setCode1(defaultCode1);
    setInputLang("typescript");
  };

  const { width: winWidth, height: winHeight } = useWindowSize();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-dark flex-none flex justify-between px-6 py-4">
        <h1 className="text-xl text-white">GoGoCode PlayGround</h1>
        <div className="text-xl text-white">
          <a
            className="mr-5"
            href="https://gogocode.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            GoGoCode
          </a>
          <a
            className="mr-5"
            href="https://github.com/thx/gogocode"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>
        </div>
      </div>
      <div className="relative flex-auto">
        <SplitPane
          split="horizontal"
          defaultSize="55%"
          minSize={100}
          maxSize={winHeight - 130}
        >
          <SplitPane
            className="h-full w-full"
            split="vertical"
            defaultSize={hasSourceCode ? "49%" : "100%"}
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
                <BaseEditor
                  code={code1}
                  onChange={setCode1}
                  language={inputLang}
                />
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
              <BaseEditor
                code={workCode}
                onChange={setWorkCode}
                language="javascript"
              />
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
              code1={code1ToShow}
              code2={code2ToShow}
              language={inputLang}
            />
          </div>
        </SplitPane>
      </div>
    </div>
  );
}

export default App;
