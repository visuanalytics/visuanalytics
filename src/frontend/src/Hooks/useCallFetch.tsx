import { useEffect, useCallback, useRef } from "react";

/**
 * Funktion um Json daten von einer URL zu bekommen.
 * Wird das Component entladen befor der Response da ist wird callBack nicht aufgrufen.
 *
 * @param url Request URL (siehe fetch)
 * @param parms Request parms (siehe fetch)
 * @param calBack Callback Funktion für einen erfolgreichen Request
 * @param errorHandle Callback Funktion für den Fehler fall
 */
export const useCallFetch = (
  url: RequestInfo,
  parms?: RequestInit,
  callBack?: (jsonData: any) => void,
  errorHandle?: (err: Error) => void
) => {
  const isMounted = useRef(true);

  const cb = useCallback(() => {
    fetch(url, parms)
      .then((res) => {
        if (!res.ok)
          throw new Error(`Network response was not ok, status: ${res.status}`);

        // TODO (Max) solve better?
        return res.status === 204 ? {} : res.json();
      })
      .then((data) => {
        if (isMounted && callBack) callBack(data);
      })
      .catch((err) => {
        if (isMounted && errorHandle) errorHandle(err);
      });
  }, [url, parms, callBack, errorHandle, isMounted]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  return cb;
};
