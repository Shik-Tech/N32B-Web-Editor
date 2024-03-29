import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import '@fontsource/roboto/300.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import store from './app/store';

const container = document.getElementById('root');
const root = createRoot(container);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  }
});
darkTheme.spacing(2);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </React.StrictMode >
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
