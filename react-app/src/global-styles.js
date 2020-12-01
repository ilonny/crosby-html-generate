import { createGlobalStyle } from "styled-components";
import { Color } from "./lib/theme";

export const GlobalStyles = createGlobalStyle`
  body {
    font-family: "Helvetica", "Open Sans", sans-serif;
    height: 100vh;
    -webkit-font-smoothing: antialiased;
    color: ${Color.black}
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  :root {
    // font-size: 10px;
  }
  * {
    box-sizing: border-box;
    margin: 0px;
    padding: 0px;
    border-width: 0px;
  }
  body {
  }

  #root {
  }

  tt,
  code,
  kbd,
  samp,
  listing {
  }
`;
