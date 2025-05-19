import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    *, *:after, *:before {
        margin: 0;
        padding: 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        text-decoration: none;
        list-style-type: none;
    }
    body {
        font-family: 'Roboto', 'Helvetica', 'Helvetica Neue', 'Arial', sans-serif;
    }
    button {
        border-style: solid;
        border: 0;
    }
`;

export default GlobalStyle;
