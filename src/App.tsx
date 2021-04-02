import './App.css';
import PlayGound from './components/PlayGound';
import GithubStar from './components/GithubStar';
import clsx from 'clsx';

function Header(props: { className?: string }) {
  return (
    <div className={clsx(props.className, 'bg-dark flex justify-between px-6 py-4')}>
      <h1 className="text-xl text-white">GoGoCode PlayGround</h1>
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
  return (
    <div className="min-h-screen flex flex-col">
      <Header className="flex-none" />
      <PlayGound className="flex-auto" />
    </div>
  );
}

export default App;
