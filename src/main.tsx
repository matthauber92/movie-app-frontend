import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from '@store';
import './index.css';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            {/*<PersistGate persistor={persist} loading={null}>*/}
            <App />
            {/*</PersistGate>*/}
        </Provider>
    </React.StrictMode>
);
