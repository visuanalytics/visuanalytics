import React from "react";
import { ComponentProvider } from "../ComponentProvider";
import { Main } from "./Main";
import { Header } from "../Header";

const App = () => {
  return (
    <div>
      <ComponentProvider>
        <Header />
        <Main />
      </ComponentProvider>
    </div>
  );
};

export default App;
