export const handleResponse = (res: Response): Object => {
  if (!res.ok)
    throw new Error(`Network response was not ok, status: ${res.status}`);

  // TODO (Max) solve better?
  return res.status === 204 ? {} : res.json();
};
