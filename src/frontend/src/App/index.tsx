import React from "react";
import { ComponentProvider } from "../ComponentProvider";
import { Main } from "./Main";

const App = () => {
  return (
    <div>
      <ComponentProvider>
        <Main />
      </ComponentProvider>
    </div>
  );
};

export default App;
