import { createGlobalStyle } from "styled-components";

export const lightTheme = {
  body: "#ffffff",
  page: {
    profile: {
      panel: {
        background: "#fff",
        text: "#202937",
        heading: "#6e7485",
        button: {
          outlined: {
            background: "transparent",
            border: "#757c85",
            text: "#757c85",
          },
          solid: {
            background: "#ffd808",
            border: "#ffd808",
            text: "#121925",
          },
        },
      },
    },
  },
};

export const darkTheme = {
  body: "#121925",
  page: {
    profile: {
      panel: {
        background: "rgba(174, 184, 200, 0.2)",
        text: "#fff",
        heading: "#aeb1ba",
        button: {
          outlined: {
            background: "transparent",
            border: "#dedfe4",
            text: "#dedfe4",
          },
          solid: {
            background: "#ffd808",
            border: "#ffd808",
            text: "#121925",
          },
        },
      },
    },
  },
};

export const GlobalStyles = createGlobalStyle`
    body {
      background: ${({ theme }) => theme.body};
      transition: all 0.50s linear;
      font-family: "Montserrat", sans-serif;
    }
`;
