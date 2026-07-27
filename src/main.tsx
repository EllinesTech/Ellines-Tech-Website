import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { registerServiceWorker } from '@/hooks/usePwaInstall'
import { ensureSearchConsoleVerification } from '@/lib/analytics'
import { initMonitoring } from '@/lib/monitoring'

ensureSearchConsoleVerification()
initMonitoring()
registerServiceWorker()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
