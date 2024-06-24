import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  :root {
    font-size: 62.5%; //10px
  }

  #root {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  html {
    height: 100%;
  }
  
  body {
    height: 100%;
    width: 100%;
    background-color: #1a1a1a;
  }
`
