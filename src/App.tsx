import './App.css';
import PlayGound from './components/PlayGound';
import GithubStar from './components/GithubStar';
import Sidebar from './components/Sidebar';
import clsx from 'clsx';
import { useRef } from 'react';
import { Button, Spin } from 'antd';
import { VSCodeContainer } from './vscode-container';
import { GoGoCodeConatiner } from './gogocode-container';

function Header(props: {
  className?: string;
  onShare: () => void;
  onReplaceOne: () => void;
  onReplaceAll: () => void;
}) {
  const { isInVsCode, treeData } = VSCodeContainer.useContainer();
  const { status, gogocode } = GoGoCodeConatiner.useContainer();
  return (
    <div className={clsx(props.className, 'bg-dark flex justify-between px-6 py-4')}>
      <div className="flex items-center">
        <h1 className="text-xl text-white mr-4">GoGoCode PlayGround</h1>
        {isInVsCode && (
          <Button type="primary" className="mr-2" size="large" onClick={props.onReplaceOne}>
            Replace
          </Button>
        )}
        {isInVsCode && treeData.length > 0 && (
          <Button size="large" className="mr-2" onClick={props.onReplaceAll}>
            Replace All
          </Button>
        )}
        <Button size="large" onClick={props.onShare}>
          Share
        </Button>
      </div>
      <div className="text-base text-white flex items-center">
        <a className="mr-5" href="https://gogocode.io" target="_blank" rel="noopener noreferrer">
          GoGoCode{status === 'ready' ? gogocode.version : ''}
        </a>
        <GithubStar />
      </div>
    </div>
  );
}

function InnerApp() {
  const playground = useRef(null);
  const { status } = GoGoCodeConatiner.useContainer();
  return (
    <div className="h-screen w-screen flex flex-col">
      <Header
        className="flex-none"
        onShare={() => {
          if (playground.current) {
            //@ts-ignore
            playground.current.shareCode();
          }
        }}
        onReplaceOne={() => {
          if (playground.current) {
            //@ts-ignore
            playground.current.replaceOne();
          }
        }}
        onReplaceAll={() => {
          if (playground.current) {
            //@ts-ignore
            playground.current.replaceAll();
          }
        }}
      />

      {status === 'ready' ? (
        <div className="flex h-full">
          <Sidebar />
          <PlayGound className="flex-auto" ref={playground} />
        </div>
      ) : (
        <div className="flex h-full justify-center items-center">
          <Spin size="large" />
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <GoGoCodeConatiner.Provider>
      <VSCodeContainer.Provider>
        <InnerApp />
      </VSCodeContainer.Provider>
    </GoGoCodeConatiner.Provider>
  );
}

export default App;
