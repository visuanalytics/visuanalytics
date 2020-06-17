import React from "react";
import { ComponentProvider } from "../ComponentProvider";
import { Main } from "./Main";
import { Header } from "../Header";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";

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
                '& [class*="Mui-disabled"]' : {
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
                color: "#00638D !important"
            }
        }
    }
});

const App = () => {
    return (
        <div>
            <MuiThemeProvider theme={theme}>
                <ComponentProvider>
                    <Header />
                    <Main />
                </ComponentProvider>
            </MuiThemeProvider>
        </div>
    );
};

export default App;
