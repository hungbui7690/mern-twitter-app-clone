import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import {
  HomePage,
  LoginPage,
  NotificationPage,
  ProfilePage,
  SignUpPage,
} from './pages'
import { LoadingSpinner, SharedLayout } from './components'
import toast, { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './utils/axios'

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'], // we use queryKey to give a unique name to our query and refer to it later
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/auth/me')
        return res.data
      } catch (error) {
        console.log(error)
        return null
      }
    },
    retry: false,
    onSuccess: (data) => {
      if (data.response) {
        toast.error(data.response.data.msg)
        return
      }
    },
  })

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <LoadingSpinner size='lg' />
      </div>
    )
  }

  console.log(authUser)

  return (
    <div className='flex mx-auto max-w-6xl'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={authUser && <SharedLayout />}>
            <Route
              index
              element={authUser ? <HomePage /> : <Navigate to='/login' />}
            />
            <Route
              path='profile/:username'
              element={authUser ? <ProfilePage /> : <Navigate to='/login' />}
            />
            <Route
              path='notifications'
              element={
                authUser ? <NotificationPage /> : <Navigate to='/login' />
              }
            />
          </Route>
          <Route
            path='login'
            element={!authUser ? <LoginPage /> : <Navigate to='/' />}
          />
          <Route
            path='signup'
            element={!authUser ? <SignUpPage /> : <Navigate to='/' />}
          />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  )
}

export default App
