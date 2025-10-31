import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
<<<<<<< HEAD
import './styles/main.css';
import App from './App.tsx'
=======
import './index.css'
import App from './App'
>>>>>>> 294629c6e2c92cc3ea407a75375a0427dae413c3

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
