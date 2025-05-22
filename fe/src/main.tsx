import './lib/three-devtools-polyfill';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import viVN from 'antd/lib/locale/vi_VN';
import App from './App';

import 'antd/dist/reset.css';
import './styles/main.scss';
import './index.css';

const theme = {
  token: {
    colorPrimary: '#1677ff',
    borderRadius: 6,
  },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={viVN} theme={theme}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);