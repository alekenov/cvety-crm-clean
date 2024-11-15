import { useEffect, useState } from 'react'
import { checkSupabaseConnection } from './lib/supabase'
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './router';

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await checkSupabaseConnection()
        setIsConnected(connected)
      } catch (error) {
        console.error('Ошибка при проверке подключения:', error)
      } finally {
        setLoading(false)
      }
    }

    checkConnection()
  }, [])

  if (loading) {
    return <div>Проверка подключения...</div>
  }

  if (!isConnected) {
    return <div>Ошибка подключения к базе данных</div>
  }

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </>
  );
}

export default App; 