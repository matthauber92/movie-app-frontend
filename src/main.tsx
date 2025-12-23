import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from '@store';
import { ThemeProvider } from '@mui/material';
import { getAppTheme } from './theme.ts';
import { Analytics } from '@vercel/analytics/react';
import './index.css';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={getAppTheme('dark')}>
                <Analytics />
                {/*<PersistGate persistor={persist} loading={null}>*/}
                <App />
                {/*</PersistGate>*/}
            </ThemeProvider>
        </Provider>
    </React.StrictMode>
);
