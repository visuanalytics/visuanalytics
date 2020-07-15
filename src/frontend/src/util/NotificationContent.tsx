import React from "react";

interface Props {}

export const NotificationContent: React.FC<Props> = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );
};
