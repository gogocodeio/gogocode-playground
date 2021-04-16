import { createContainer } from 'unstated-next';
import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import { useMessageListener } from './hooks/useMessageListener';

declare global {
  interface Window {
    acquireVsCodeApi?: any;
  }
}

let vscode: any = null;

const showMessage = message as any;

function useVSCode() {
  let isInVsCode = Boolean(window.acquireVsCodeApi);

  const [filePaths, setFilePaths] = useState([]);
  const [currentPath, _setCurrentPath] = useState('');
  const [currentContent, _setCurrentContent] = useState('');

  useEffect(() => {
    if (!vscode && window.acquireVsCodeApi) {
      vscode = window.acquireVsCodeApi();
      vscode.postMessage({
        command: 'activated',
      });
    }
  }, []);

  useMessageListener((message) => {
    switch (message.command) {
      case 'file-paths':
        setFilePaths(message.filePaths);
        setCurrentPath(message.filePaths?.[0] || '');
        break;
      case 'file-content':
        if (message.path === currentPath) {
          _setCurrentContent(message.content);
        }
        break;
      case 'message':
        showMessage[message.type](message.content, message.duration);
        break;
      default:
        break;
    }
  });

  const postMessage = useCallback((message: { command: string; [k: string]: any }) => {
    vscode?.postMessage(message);
  }, []);

  const setCurrentPath = useCallback(
    (path: string) => {
      if (path) {
        postMessage({
          command: 'get-file-content',
          path,
        });
      }
      _setCurrentPath(path);
    },
    [postMessage],
  );

  const replaceOne = useCallback(
    (path: string, content: string) => {
      if (path) {
        postMessage({
          command: 'replace-one',
          path,
          content,
        });
      }
    },
    [postMessage],
  );

  return {
    isInVsCode,
    filePaths,
    currentPath,
    setCurrentPath,
    currentContent,
    replaceOne,
  };
}

export const VSCodeContainer = createContainer(useVSCode);
