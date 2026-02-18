import React from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { useBoundStore } from "../stores/useBoundStore";
import { darkTheme, lightTheme } from "../theme";
import GlobalStyle from "../globalStyles";

interface ThemeProviderProps {
    children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const { theme } = useBoundStore();
    const currentTheme = theme === "dark" ? darkTheme : lightTheme;

    return (
        <StyledThemeProvider theme={currentTheme}>
            <GlobalStyle />
            {children}
        </StyledThemeProvider>
    );
};

export default ThemeProvider;
