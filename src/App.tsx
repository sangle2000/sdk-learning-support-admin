import './App.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes/route'
import { useEffect } from 'react'
import { loadUserFromRefresh } from './service/auth'

function App() {
  const accessToken = localStorage.getItem("adminAccessToken")

  useEffect(() => {
    if (accessToken) {
      loadUserFromRefresh()
    }
  }, [accessToken])

  return <RouterProvider router={router} />
}

export default App
