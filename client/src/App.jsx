import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {
  HomePage,
  LoginPage,
  NotificationPage,
  ProfilePage,
  SignUpPage,
} from './pages'
import SharedLayout from './components/common/SharedLayout'

function App() {
  return (
    <div className='flex mx-auto max-w-6xl'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SharedLayout />}>
            <Route index element={<HomePage />} />
            <Route path='profile' element={<ProfilePage />} />
            <Route path='notifications' element={<NotificationPage />} />
          </Route>
          <Route path='login' element={<LoginPage />} />
          <Route path='signup' element={<SignUpPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
