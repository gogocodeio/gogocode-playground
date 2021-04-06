import LZString from 'lz-string';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHash } from 'react-use';

export function getStateFromHash(hash: string) {
  const codeHash = hash.replace(/^#code\//, '');
  if (!hash) {
    return {};
  }
  try {
    return JSON.parse(LZString.decompressFromEncodedURIComponent(codeHash) || '{}');
  } catch (_) {
    return {};
  }
}

export function getHashFromState<T>(code: T) {
  const hash = `#code/${LZString.compressToEncodedURIComponent(JSON.stringify(code))}`;
  return hash;
}

export function useHashState<T>(defaultState: T) {
  const [hash, setHash] = useHash();
  const hashState: T = useMemo(() => getStateFromHash(hash), [hash]);
  const [state, _setState] = useState(defaultState);

  useEffect(() => {
    if (hash !== '') {
      _setState(hashState);
    }
  }, [_setState, hashState, hash]);

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
