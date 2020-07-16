import React from "react";
import { Progress } from "./Progress";

interface Props {
  data: any | undefined;
}

export const Load: React.FC<Props> = ({ children, data }) => {
  return <>{data ? children : <Progress />}</>;
};
