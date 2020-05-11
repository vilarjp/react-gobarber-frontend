import { createGlobalStyle, keyframes } from 'styled-components';

export default createGlobalStyle`
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  outline: 0;
  font-family: 'Roboto Slab', serif;
}

body {
  background: #312E38;
  color: #FFF;
  -webkit-font-smoothing: antialiased;
}

body, input, button {
  font-size: 16px;
}

h1, h2, h3, h4, h5, h6, strong {
  font-weight: 500;
}

button {
  cursor: pointer;
  border: 0;
  background: transparent;
}
`;

export const fadeBackground = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;
