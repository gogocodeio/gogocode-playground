import { createContainer } from 'unstated-next';
import PQueue from 'p-queue';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import GoGoCodeWorker from 'worker-loader?inline=fallback!./workers/gogocode.worker.js';
import { useCallback, useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    gogocode?: any;
  }
}

export function createWorkerQueue(Worker: any, version: string) {
  const worker = new Worker();
  const queue = new PQueue({ concurrency: 1 });
  return {
    worker,
    emit(data: any) {
      queue.clear();
      const _id = performance.now();
      worker.postMessage({
        _current: _id,
        _importPath: `https://unpkg.zhimg.com/gogocode@${version}/umd/gogocode.min.js`,
      });
      return queue.add(
        () =>
          new Promise((resolve) => {
            function onMessage(event: any) {
              if (event.data._id !== _id) return;
              worker.removeEventListener('message', onMessage);
              resolve(event.data);
            }
            worker.addEventListener('message', onMessage);
            worker.postMessage({ ...data, _id });
          }),
      );
    },
    terminate() {
      worker.terminate();
    },
  };
}

function useGoGoCode() {
  const [versionStatus, setVersionStatus] = useState('loading');
  const [workerStatus, setWorkerStatus] = useState('loading');
  const [version, setVersion] = useState('');
  const gogocodeWorker = useRef<ReturnType<typeof createWorkerQueue>>();

  useEffect(() => {
    fetch('https://unpkg.com/gogocode/package.json')
      .then((res) => res.json())
      .then((pkg) => {
        setVersion(pkg.version);
        setVersionStatus('ready');
      })
      .catch((err) => {
        setVersionStatus('error');
      });
  }, []);

  const runGoGoCode = useCallback(
    async (sourceCode: string, workCode: string, sourceCodePath: string = '') => {
      if (!version) {
        return '';
      }
      if (!gogocodeWorker.current) {
        gogocodeWorker.current = createWorkerQueue(GoGoCodeWorker, version);
      }
      const worker = gogocodeWorker.current;
      const { canceled, error, transformed }: any = await worker.emit({
        sourceCode,
        workCode,
        sourceCodePath,
      });
      setWorkerStatus('ready');
      if (canceled) {
        return '';
      }
      if (error) {
        return error as string;
      }
      return transformed as string;
    },
    [version],
  );

  return {
    versionStatus,
    workerStatus,
    version,
    runGoGoCode,
  };
}

export const GoGoCodeConatiner = createContainer(useGoGoCode);
