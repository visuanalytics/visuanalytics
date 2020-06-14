import React from "react";
import {ComponentProvider} from "../ComponentProvider";
import {Main} from "./Main";
import {Header} from "../Header";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";

const theme = createMuiTheme({
    typography: {
        fontFamily: 'Dosis',
    },
});

const App = () => {
    return (
        <div>
            <MuiThemeProvider theme={theme}>
                <ComponentProvider>
                    <Header/>
                    <Main/>
                </ComponentProvider>
            </MuiThemeProvider>
        </div>
    );
};

export default App;
