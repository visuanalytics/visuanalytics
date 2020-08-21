import { useEffect, useCallback, useRef } from "react";
import { handleResponse, fetchTimeOut, getUrl } from "../util/fetchUtils";

export const useUploadTopic = (
  callBack?: (jsonData: any) => void,
  errorHandle?: (err: Error) => void
) => {
  const isMounted = useRef(true);

  const cb = useCallback(
    (topicName: string, file: Blob) => {
      const data = new FormData();
      data.append("config", file);
      data.append("name", topicName);

      fetchTimeOut(
        getUrl("/topic"),
        {
          method: "PUT",
          body: data,
        },
        5000
      )
        .then(handleResponse)
        .then((res_data: any) => {
          if (isMounted && callBack) callBack(res_data);
        })
        .catch((err: Error) => {
          if (isMounted && errorHandle) errorHandle(err);
        });
    },
    [callBack, errorHandle, isMounted]
  );

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  return cb;
};
