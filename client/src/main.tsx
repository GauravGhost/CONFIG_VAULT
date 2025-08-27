import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RootLayout from './components/layout/RootLayout'
import { MyRouter } from './routes/routes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootLayout>
      <MyRouter />
    </RootLayout>
  </StrictMode>,
)
