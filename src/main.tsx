import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { LogisticsProvider } from './context/LogisticsContext'
import './index.css'
import 'flag-icons/css/flag-icons.min.css'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LogisticsProvider>
        <App />
      </LogisticsProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
