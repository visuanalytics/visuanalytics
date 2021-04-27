import React from "react";
import {ComponentProvider} from "../ComponentProvider";
import {Main} from "./Main";
import {Header} from "../Header";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";

const newDarkBlueTheme = createMuiTheme({
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    overrides: {
        MuiStepIcon: {
            active: {
                color: '#586199 !important'
            },
            completed: {
                color: '#2A376B !important'
            }
        },
        MuiInputBase: {
            root: {
                '& [class*="Mui-disabled"]': {
                    color: '#6E6E6E'
                }
            }
        },
        MuiRadio: {
            root: {
                color: "#00638D !important"
            },
        },
        MuiCheckbox: {
            root: {
                color: "#586199 !important",
                '&.Mui-disabled': {
                    color: "#9f9f9f !important"
                }
            },
        },
        MuiAccordionSummary: {
            root: {
                backgroundColor: '#2E97C5 !important'
            }
        },
        MuiButton: {
            disabled: {
                backgroundColor: "red",
            }
        }
    },
    palette: {
        primary: {
            main: '#586199',
            light: '#878ECA',
            dark: '#2A376B'
        },
        secondary: {
            main: '#64AAA2',
            light: '#95dcd3',
            dark: '#337B73'
        },
    }
});

const theme = createMuiTheme({
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    overrides: {
        MuiStepIcon: {
            active: {
                color: '#2E97C5 !important'
            },
            completed: {
                color: 'rgb(0, 99, 141) !important'
            }
        },
        MuiInputBase: {
            root: {
                '& [class*="Mui-disabled"]': {
                    color: '#6E6E6E'
                }
            }
        },
        MuiRadio: {
            root: {
                color: "#00638D !important"
            },
        },
        MuiCheckbox: {
            root: {
                color: "#00638D !important",
                '&.Mui-disabled': {
                    color: "#9f9f9f !important"
                }
            },
        },
        MuiAccordionSummary: {
            root: {
                backgroundColor: '#2E97C5 !important'
            }
        },
    },
    palette: {
        primary: {
            main: '#2E97C5'
        },
        secondary: {
            main: '#00638D'
        }
    }
});

const App = () => {
    return (
        <div>
            <MuiThemeProvider theme={newDarkBlueTheme}>
                <ComponentProvider>
                    <Header/>
                    <Main/>
                </ComponentProvider>
            </MuiThemeProvider>
        </div>
    );
};

export default App;
