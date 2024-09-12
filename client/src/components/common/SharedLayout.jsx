import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import RightPanel from './RightPanel'

const SharedLayout = () => {
  return (
    <>
      <Sidebar />
      <Outlet />
      <RightPanel />
    </>
  )
}
export default SharedLayout
