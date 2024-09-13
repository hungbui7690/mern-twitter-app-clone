import { Logo, LoadingSpinner } from '../../components'
import { Link } from 'react-router-dom'
import { MdOutlineMail } from 'react-icons/md'
import { FaUser } from 'react-icons/fa'
import { MdPassword } from 'react-icons/md'
import { MdDriveFileRenameOutline } from 'react-icons/md'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../../utils/axios'
import toast from 'react-hot-toast'

const SignUpPage = () => {
  const queryClient = useQueryClient()
  const {
    mutate: signupMutation,
    isError,
    isPending,
  } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await axiosInstance.post('/auth/signup', formData)
        console.log('signup: ', res)
        return res.data
      } catch (error) {
        console.error(error.response.data.msg)
        return error
      }
    },
    onSuccess: (data) => {
      if (data.response) {
        toast.error(data.response.data.msg)
        return
      }

      toast.success('Account created successfully')
      queryClient.invalidateQueries({ queryKey: ['authUser'] }) // QueryClient is used to interact with a cache
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    signupMutation(data)
  }

  return (
    <div className='flex mx-auto px-10 max-w-screen-xl h-screen'>
      <div className='lg:flex flex-1 justify-center items-center hidden'>
        <Logo className='lg:w-2/3 fill-white' />
      </div>
      <div className='flex flex-col flex-1 justify-center items-center'>
        <form
          className='flex flex-col gap-4 mx-auto md:mx-20 lg:w-2/3'
          onSubmit={handleSubmit}
        >
          <Logo className='lg:hidden w-24 fill-white' />
          <h1 className='font-extrabold text-4xl text-white'>Join today.</h1>
          <label className='flex items-center gap-2 input-bordered rounded input'>
            <MdOutlineMail />
            <input
              type='email'
              className='grow'
              placeholder='Email'
              name='email'
              defaultValue='user@gmail.com'
            />
          </label>
          <div className='flex flex-wrap gap-4'>
            <label className='flex flex-1 items-center gap-2 input-bordered rounded input'>
              <FaUser />
              <input
                type='text'
                className='grow'
                placeholder='Username'
                name='username'
                defaultValue='user'
              />
            </label>
            <label className='flex flex-1 items-center gap-2 input-bordered rounded input'>
              <MdDriveFileRenameOutline />
              <input
                type='text'
                className='grow'
                placeholder='Full Name'
                name='fullName'
                defaultValue='user'
              />
            </label>
          </div>
          <label className='flex items-center gap-2 input-bordered rounded input'>
            <MdPassword />
            <input
              type='password'
              className='grow'
              placeholder='Password'
              name='password'
              autoComplete='true'
              defaultValue='121212'
            />
          </label>
          <button
            className='rounded-full text-white btn btn-primary'
            disabled={isPending}
          >
            {isPending ? <LoadingSpinner /> : 'Sign Up'}
          </button>
          {isError && <p className='text-red-500'>Something went wrong</p>}
        </form>
        <div className='flex flex-col gap-2 mt-4 lg:w-2/3'>
          <p className='text-lg text-white'>
            Already have an account?{' '}
            <Link to='/login'>
              <span className='text-primary'>click here</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
