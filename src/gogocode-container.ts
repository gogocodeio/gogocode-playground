import { createContainer } from 'unstated-next';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import GoGoCodeWorker from 'worker-loader!./workers/gogocode.worker.js';
import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    gogocode?: any;
  }
}

function useGoGoCode() {
  const [status, setStatus] = useState('loading');
  const [version, setVersion] = useState('');

  useEffect(() => {
    fetch('https://unpkg.com/gogocode/package.json')
      .then((res) => res.json())
      .then((pkg) => {
        setVersion(pkg.version);
        setStatus('ready');
      })
      .catch((err) => {
        setStatus('error');
      });
  }, []);

  const gogocodeWorker = useRef<Worker>();

  useEffect(() => {
    gogocodeWorker.current = new GoGoCodeWorker();
  }, []);

  // const status = useScript(`/gogocode.js`);
  return {
    status,
    version,
    gogocodeWorker,
  };
}

export const GoGoCodeConatiner = createContainer(useGoGoCode);
