import './App.css';
import PlayGound from './components/PlayGound';
import GithubStar from './components/GithubStar';
import clsx from 'clsx';
import { useRef } from 'react';

import { Button } from 'antd';

function Header(props: { className?: string; onShare: () => void }) {
  return (
    <div className={clsx(props.className, 'bg-dark flex justify-between px-6 py-4')}>
      <div className="flex items-center">
        <h1 className="text-xl text-white mr-4">GoGoCode PlayGround</h1>
        <Button size="large" onClick={props.onShare}>
          Share
        </Button>
      </div>
      <div className="text-base text-white flex items-center">
        <a className="mr-5" href="https://gogocode.io" target="_blank" rel="noopener noreferrer">
          GoGoCode.io
        </a>
        <GithubStar />
      </div>
    </div>
  );
}

function App() {
  const playground = useRef(null);
  return (
    <div className="min-h-screen flex flex-col">
      <Header
        className="flex-none"
        onShare={() => {
          if (playground.current) {
            //@ts-ignore
            playground.current.shareCode();
          }
        }}
      />
      <PlayGound className="flex-auto" ref={playground} />
    </div>
  );
}

export default App;
