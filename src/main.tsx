import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import './index.css'
import { loadRuntimeConfig } from './config.ts'

console.log('Main.tsx loaded - loading runtime configuration');

// Load runtime configuration before rendering the app
loadRuntimeConfig().then(() => {
  console.log('Runtime configuration loaded successfully');
  
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found!');
    document.body.innerHTML = '<h1>Error: Root element not found</h1>';
  } else {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </React.StrictMode>,
    );
  }
}).catch((error) => {
  console.error('[APP] Failed to load configuration:', error);
  // Still render the app with defaults from build-time config
  const rootElement = document.getElementById('root');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </React.StrictMode>,
    );
  }
});
}

