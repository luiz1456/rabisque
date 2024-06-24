import { ToolsbarProvider } from './context/toolsbarContext'
import { BlackboardProvider } from './context/blackboardContext'
import { Home } from './pages/home'
import { GlobalStyle } from './styles/globalStyles'

function App() {
  return (
    <ToolsbarProvider>
      <BlackboardProvider>
        <GlobalStyle />
        <Home />
      </BlackboardProvider>
    </ToolsbarProvider>
  )
}

export default App
