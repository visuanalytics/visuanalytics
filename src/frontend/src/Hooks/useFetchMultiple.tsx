import { useState, useEffect } from "react";
import { handleResponse } from "../util/fetchUtils";

// TODO Merge with useFetch (most code ist the same)
export function useFetchMultiple<T>(
  url: RequestInfo,
  parms?: RequestInit,
  errorHandle?: (err: Error) => void
): [T | undefined, () => void] {
  const [data, setData] = useState<T | undefined>();
  const [state, setState] = useState(false);

  const handleGetData = (data: any) => {
    setData(data);
  };

  const update = () => {
    setState(!state);
  };

  useEffect(() => {
    let isMounted = true;

    fetch(url, parms)
      .then(handleResponse)
      .then((data) => {
        if (isMounted) handleGetData(data);
      })
      .catch((err) => {
        if (isMounted && errorHandle) errorHandle(err);
      });

    return () => {
      isMounted = false;
    };
  }, [url, parms, errorHandle, state]);

  return [data, update];
}
