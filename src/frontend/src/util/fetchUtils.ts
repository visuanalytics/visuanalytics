export const handleResponse = (res: Response): Object => {
  if (!res.ok)
    throw new Error(`Network response was not ok, status: ${res.status}`);

  // TODO (Max) solve better?
  return res.status === 204 ? {} : res.json();
};

export function getUrl(url: string) {
  if (process.env.REACT_APP_VA_SERVER_URL)
    return process.env.REACT_APP_VA_SERVER_URL + "/visuanalytics" + url;

  return "/visuanalytics" + url;
}

export function fetchTimeOut(
  url: RequestInfo,
  parms: RequestInit | undefined,
  timeout: number
) {
  const abort = new AbortController();
  parms = { ...parms, signal: abort.signal };

  const timer = setTimeout(() => abort.abort(), timeout);

  return fetch(url, parms).finally(() => clearTimeout(timer));
}
