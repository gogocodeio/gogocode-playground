import { createContainer } from 'unstated-next';
import useScript from './hooks/useScript';

declare global {
  interface Window {
    gogocode?: any;
  }
}

function useGoGoCode() {
  const status = useScript(`https://unpkg.com/gogocode/umd/gogocode.min.js`);
  // const status = useScript(`/gogocode.js`);
  return {
    status,
    gogocode: window.gogocode,
  };
}

export const GoGoCodeConatiner = createContainer(useGoGoCode);
