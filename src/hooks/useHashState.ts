import LZString from 'lz-string';
import { useCallback, useMemo } from 'react';
import { useHash } from 'react-use';

export function getStateFromHash<T>(hash: string, defaultState?: T) {
  const codeHash = hash.replace(/^#code\//, '');
  if (!codeHash) {
    return defaultState ?? {};
  }
  try {
    const state = JSON.parse(LZString.decompressFromEncodedURIComponent(codeHash) || '');
    if (!Object.keys(state).length) {
      return defaultState ?? {};
    }
    return state;
  } catch (_) {
    return defaultState ?? {};
  }
}

export function getHashFromState<T>(code: T) {
  const hash = `#code/${LZString.compressToEncodedURIComponent(JSON.stringify(code))}`;
  return hash;
}

export function useHashState<T>(defaultState: T) {
  const [hash, setHash] = useHash();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const state: T = useMemo(() => getStateFromHash(hash, defaultState), [hash]);

  const setState = useCallback(
    (newState: T) => {
      setHash(
        getHashFromState({
          ...state,
          ...newState,
        }),
      );
    },
    [setHash, state],
  );
  return [state, setState] as const;
}
