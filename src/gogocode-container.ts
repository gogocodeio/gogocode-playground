import { createContainer } from 'unstated-next';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import GoGoCodeWorker from 'worker-loader!./workers/gogocode.worker.js';
import { createWorkerQueue } from './utils/workers';
import { useCallback, useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    gogocode?: any;
  }
}

function useGoGoCode() {
  const [status, setStatus] = useState('loading');
  const [version, setVersion] = useState('');
  const gogocodeWorker = useRef<ReturnType<typeof createWorkerQueue>>();

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

  const runGoGoCode = useCallback(
    async (sourceCode: string, workCode: string, sourceCodePath: string = '') => {
      if (!gogocodeWorker.current) {
        gogocodeWorker.current = createWorkerQueue(GoGoCodeWorker);
      }
      const worker = gogocodeWorker.current;
      const { canceled, error, transformed }: any = await worker.emit({
        sourceCode,
        workCode,
        sourceCodePath,
      });
      if (canceled) {
        return '';
      }
      if (error) {
        return error as string;
      }
      return transformed as string;
    },
    [],
  );

  return {
    status,
    version,
    runGoGoCode,
  };
}

export const GoGoCodeConatiner = createContainer(useGoGoCode);
