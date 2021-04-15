import { useCallback, useEffect } from 'react';

export function useMessageListener(onMessage: (message: any) => void) {
  const handleReceiveMessage = useCallback(
    (event: any) => {
      onMessage(event.data);
    },
    [onMessage],
  );

  useEffect(() => {
    window.addEventListener('message', handleReceiveMessage);
    return () => window.removeEventListener('message', handleReceiveMessage);
  }, [handleReceiveMessage]);
}
