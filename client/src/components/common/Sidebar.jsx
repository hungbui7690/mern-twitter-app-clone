import Logo from '../svgs/Logo'
import { MdHomeFilled } from 'react-icons/md'
import { IoNotifications } from 'react-icons/io5'
import { FaUser } from 'react-icons/fa'
import { BiLogOut } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../../utils/axios'
import toast from 'react-hot-toast'
import LoadingSpinner from './LoadingSpinner'
import { useAuthStore } from '../../zustand/useAuthStore'

const Sidebar = () => {
  const setIsLogin = useAuthStore((state) => state.setIsLogin)
  const queryClient = useQueryClient()
  const { mutate: logoutMutation, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axiosInstance.post('/auth/logout')
        setIsLogin(false)
        return res.data
      } catch (error) {
        return error
      }
    },
    onSuccess: (data) => {
      if (data.response) {
        toast.error(data.response.data.msg)
        return
      }
      toast.success('Logout successful')
      queryClient.invalidateQueries({ queryKey: ['authUser'] })
    },
  })

  const { data } = useQuery({ queryKey: ['authUser'] })

  return (
    <div className='md:flex-[2_2_0] border-gray-700 md:mx-0 pr-0 sm:pr-3 border-r w-18 max-w-52'>
      <div className='top-5 left-0 sticky flex flex-col px-4 w-20 md:w-full h-screen'>
        <Link to='/' className='flex justify-center md:justify-start'>
          <Logo className='hover:bg-stone-900 px-2 rounded-full w-12 h-12 fill-white' />
        </Link>
        <ul className='flex flex-col gap-3 mt-4'>
          <li className='flex justify-center md:justify-start'>
            <Link
              to='/'
              className='relative flex items-center gap-3 hover:bg-stone-900 py-2 pr-4 pl-2 rounded-full max-w-fit transition-all duration-300 cursor-pointer'
            >
              <MdHomeFilled className='w-8 h-8 text-white' />
              <span className='md:block hidden text-lg'>Home</span>
              <div className='top-1 left-7 absolute bg-primary rounded-full w-2 h-2'></div>
            </Link>
          </li>
          <li className='flex justify-center md:justify-start'>
            <Link
              to='/notifications'
              className='flex items-center gap-3 hover:bg-stone-900 py-2 pr-4 pl-2 rounded-full max-w-fit transition-all duration-300 cursor-pointer'
            >
              <IoNotifications className='w-6 h-6' />
              <span className='md:block hidden text-lg'>Notifications</span>
            </Link>
          </li>

          <li className='flex justify-center md:justify-start'>
            <Link
              to={`/profile/${data?.username}`}
              className='flex items-center gap-3 hover:bg-stone-900 py-2 pr-4 pl-2 rounded-full max-w-fit transition-all duration-300 cursor-pointer'
            >
              <FaUser className='w-6 h-6' />
              <span className='md:block hidden text-lg'>Profile</span>
            </Link>
          </li>
          <li className='flex justify-center md:justify-start'>
            <Link
              to={`/post}`}
              className='flex justify-center rounded-lg w-full'
            >
              <button className='inline-block bg-primary p-2 rounded-full w-full text-white'>
                Post
              </button>
            </Link>
          </li>
        </ul>
        {data && (
          <Link
            to={`/profile/${data.username}`}
            className='flex items-center gap-2 hover:bg-[#181818] mt-auto mb-10 px-4 py-2 rounded-full transition-all duration-300'
          >
            <div className='md:inline-flex hidden avatar'>
              <div className='rounded-full w-8'>
                <img src={data?.profileImg || '/avatar-placeholder.png'} />
              </div>
            </div>
            <div className='flex flex-1 justify-between items-center'>
              <div className='md:block hidden'>
                <p className='w-20 font-bold text-sm text-white truncate'>
                  {data?.fullName}
                </p>
                <p className='text-slate-500 text-sm'>@{data?.username}</p>
              </div>
              {isPending ? (
                <LoadingSpinner />
              ) : (
                <BiLogOut
                  className='w-5 h-5 cursor-pointer'
                  onClick={(e) => {
                    e.preventDefault()
                    logoutMutation()
                  }}
                />
              )}
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}

export default Sidebar
