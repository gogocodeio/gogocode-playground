import * as Comlink from 'comlink';
import { createContainer } from 'unstated-next';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import GoGoCodeWorker from 'worker-loader?inline=fallback!./workers/gogocode.worker.js';
import { useCallback, useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    gogocode?: any;
  }
}
interface WorkerConstructor {
  new(): Worker;
};

export function createWorkerService(Worker: WorkerConstructor, version: string, timeout: number = 5 * 1000) {
  let worker = new Worker();
  let workerWrapper = Comlink.wrap<any>(new Worker());
  let time = 0;
  let isBusy = false;
  workerWrapper.importGoGoCode(`https://unpkg.zhimg.com/gogocode@${version}/umd/gogocode.min.js`);

  return {
    restart() {
      worker.terminate();
      workerWrapper[Comlink.releaseProxy]();
      worker = new Worker();
      workerWrapper = Comlink.wrap(new Worker());
      workerWrapper.importGoGoCode(
        `https://unpkg.zhimg.com/gogocode@${version}/umd/gogocode.min.js`,
      );
      time = 0;
      isBusy = false;
    },
    async emit(sourceCode: string, workCode: string, sourceCodePath: string) {
      const currentTime = Date.now();

      if (isBusy) {
        if (currentTime - time < timeout) {
          return new Promise((resolve) => {
            setTimeout(async () => {
              resolve(this.emit(sourceCode, workCode, sourceCodePath));
            }, time + timeout - currentTime);
          });
        } else {
          this.restart();
        }
      }

      isBusy = true;
      time = currentTime;
      const transformed = await workerWrapper.runGoGoCode(sourceCode, workCode, sourceCodePath);
      isBusy = false;

      return transformed;
    },
    terminate() {
      worker.terminate();
      workerWrapper[Comlink.releaseProxy]();
    },
  };
}

function useGoGoCode() {
  const [versionStatus, setVersionStatus] = useState('loading');
  const [workerStatus, setWorkerStatus] = useState('loading');
  const [version, setVersion] = useState('');
  const gogocodeService = useRef<ReturnType<typeof createWorkerService>>();

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
    async (
      sourceCode: string,
      workCode: string,
      sourceCodePath: string = '',
      restartWorker: boolean = false,
    ) => {
      if (!version) {
        return '';
      }

      if (restartWorker && gogocodeService.current) {
        gogocodeService.current.restart();
      } else if (!gogocodeService.current) {
        gogocodeService.current = createWorkerService(GoGoCodeWorker, version);
      }

      const worker = gogocodeService.current;
      const transformed: string = await worker.emit(sourceCode, workCode, sourceCodePath);
      setWorkerStatus('ready');
      return transformed;
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
