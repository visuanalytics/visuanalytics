import React from "react";
import { ComponentProvider } from "../ComponentProvider";
import { Main } from "./Main";
import { Header } from "../Header";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";

const theme = createMuiTheme({
    typography: {
        fontFamily: 'Dosis',
    },
    overrides: {
        MuiStepIcon: {
            active: {
                color: '#2E97C5 !important'
            },
            completed: {
                color: '#2E97C5 !important'
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
