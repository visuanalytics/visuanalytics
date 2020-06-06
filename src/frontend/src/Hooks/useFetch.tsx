import { useState, useEffect } from "react";

/**
 * Funktion um Json daten beim laden eines React Components zu bekommen.
 * Wird das Component entladen befor der Response da ist, wird der Response ignoriert.
 *
 * @param url Request URL (siehe fetch)
 * @param parms Request parms (siehe fetch)
 * @param errorHandle Callback Funktion für den Fehler fall
 */
export const useFetch = (
  url: RequestInfo,
  parms?: RequestInit,
  errorHandle?: (err: Error) => void
) => {
  const [data, setData] = useState<any>();

  const handleGetData = (data: any) => {
    setData(data);
  };

  useEffect(() => {
    let isMounted = true;

    fetch(url, parms)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) handleGetData(data);
      })
      .catch((err) => {
        if (isMounted && errorHandle) errorHandle(err);
      });

    return () => {
      isMounted = false;
    };
  }, [url, parms, errorHandle]);

  return data;
};
