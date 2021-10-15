import { createMuiTheme, MuiThemeProvider, Theme } from "@material-ui/core";
import React, { useState } from "react";
import { ComponentProvider } from "../ComponentProvider";
import { Header } from "../Header";
import { Main } from "./Main";

const newDarkBlueTheme = createMuiTheme({
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  overrides: {
    MuiStepIcon: {
      active: {
        color: "#586199 !important",
      },
      completed: {
        color: "#2A376B !important",
      },
    },
    MuiInputBase: {
      root: {
        '& [class*="Mui-disabled"]': {
          color: "#6E6E6E",
        },
      },
    },
    MuiRadio: {
      root: {
        color: "#00638D !important",
      },
    },
    MuiCheckbox: {
      root: {
        color: "#586199 !important",
        "&.Mui-disabled": {
          color: "#9f9f9f !important",
        },
      },
    },
    MuiAccordionSummary: {
      root: {
        backgroundColor: "#2E97C5 !important",
      },
    },
  },
  palette: {
    primary: {
      main: "#586199",
      light: "#878ECA",
      dark: "#2A376B",
    },
    secondary: {
      main: "#64AAA2",
      light: "#95dcd3",
      dark: "#337B73",
    },
    error: {
      main: "#B00020",
      dark: "#790000",
      light: "#e94948",
    },
  },
});

const theme = createMuiTheme({
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  overrides: {
    MuiStepIcon: {
      active: {
        color: "#2E97C5 !important",
      },
      completed: {
        color: "rgb(0, 99, 141) !important",
      },
    },
    MuiInputBase: {
      root: {
        '& [class*="Mui-disabled"]': {
          color: "#6E6E6E",
        },
      },
    },
    MuiRadio: {
      root: {
        color: "#00638D !important",
      },
    },
    MuiCheckbox: {
      root: {
        color: "#00638D !important",
        "&.Mui-disabled": {
          color: "#9f9f9f !important",
        },
      },
    },
    MuiAccordionSummary: {
      root: {
        backgroundColor: "#2E97C5 !important",
      },
    },
  },
  palette: {
    primary: {
      main: "#2E97C5",
    },
    secondary: {
      main: "#00638D",
    },
  },
});

export const themeList: Record<string, Theme> = {
  v1: theme,
  v2: newDarkBlueTheme,
};

const App = () => {
  const legacyFrontend = React.useRef<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("va_theme") ?? "v1"
  );

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const theme = event.target.value as string;
    setCurrentTheme(theme);
    localStorage.setItem("va_theme", theme);
  };

  return (
    <div>
      <MuiThemeProvider theme={themeList[currentTheme]}>
        <ComponentProvider>
          <Header
            legacyFrontend={legacyFrontend.current}
            handleChange={handleChange}
            currentTheme={currentTheme}
            themeList={themeList}
          />
          <Main />
        </ComponentProvider>
      </MuiThemeProvider>
    </div>
  );
};

export default App;
