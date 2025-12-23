import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from '@store';
import { ThemeProvider } from '@mui/material';
import { getAppTheme } from './theme.ts';
import { Analytics } from '@vercel/analytics/next';
import './index.css';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <Analytics />
        <Provider store={store}>
            <ThemeProvider theme={getAppTheme('dark')}>
                {/*<PersistGate persistor={persist} loading={null}>*/}
                <App />
                {/*</PersistGate>*/}
            </ThemeProvider>
        </Provider>
    </React.StrictMode>
);
