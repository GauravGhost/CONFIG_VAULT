
import type { ReactNode } from "react"
import GlobalLoader from "../core/GlobalLoader"
import { Toaster } from "../ui/sonner"
import { ThemeProvider } from "../theme-provider"

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <ThemeProvider>
      <GlobalLoader />
      {children}
      <Toaster richColors closeButton />
    </ThemeProvider>
  )
}
