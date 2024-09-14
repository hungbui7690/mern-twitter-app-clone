import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Posts from '../../components/common/Posts'
import ProfileHeaderSkeleton from '../../components/skeleton/ProfileHeaderSkeleton'
import EditProfileModal from './EditProfileModel'
import { FaArrowLeft } from 'react-icons/fa6'
import { IoCalendarOutline } from 'react-icons/io5'
import { FaLink } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import { useQuery } from '@tanstack/react-query'
import { formatMemberSinceDate } from '../../utils/date'
import useFollow from '../../hooks/useFollow'
import useUpdateUserProfile from '../../hooks/useUpdateUserProfile'
import { axiosInstance } from '../../utils/axios'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null)
  const [profileImg, setProfileImg] = useState(null)
  const [feedType, setFeedType] = useState('posts')
  const coverImgRef = useRef(null)
  const profileImgRef = useRef(null)
  const { username } = useParams()
  const { follow, isPending } = useFollow()
  const { data: authUser } = useQuery({ queryKey: ['authUser'] })
  const { data: POSTS } = useQuery({ queryKey: ['posts'] })

  const {
    data: user,
    isLoading,
    refetch: refetchProfile,
    isRefetching,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/user/profile/${username}`)
        return res.data
      } catch (error) {
        throw new Error(error.response.data)
      }
    },
    onError: (error) => {
      toast.error(error.msg)
    },
  })

  const { isUpdateProfilePending, updateProfile } = useUpdateUserProfile()
  const isCurrentUser = authUser._id === user?._id
  const memberSinceDate = formatMemberSinceDate(user?.createdAt)
  const amIFollowing = authUser?.following.includes(user?._id)

  const handleImgChange = (e, imgType) => {
    const file = e.target.files[0]
    imgType === 'coverImg' && setCoverImg(URL.createObjectURL(file))
    imgType === 'profileImg' && setProfileImg(URL.createObjectURL(file))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    // const data = Object.fromEntries(formData.entries())
    // console.log(data)
    updateProfile(formData)
    e.target.reset()
    setCoverImg(null)
    setProfileImg(null)
  }

  useEffect(() => {
    refetchProfile()
  }, [username, refetchProfile])

  return (
    <>
      <div className='flex-[4_4_0] border-gray-700 border-r min-h-screen'>
        {/* HEADER */}
        {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
        {!isLoading && !isRefetching && !user && (
          <p className='mt-4 text-center text-lg'>User not found</p>
        )}
        <div className='flex flex-col'>
          {!isLoading && !isRefetching && user && (
            <>
              <div className='flex items-center gap-10 px-4 py-2'>
                <Link to='/'>
                  <FaArrowLeft className='w-4 h-4' />
                </Link>
                <div className='flex flex-col'>
                  <p className='font-bold text-lg'>{user?.fullName}</p>
                  <span className='text-slate-500 text-sm'>
                    {POSTS?.length} posts
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* COVER IMG */}
                <div className='relative group/cover'>
                  <img
                    src={coverImg || user?.coverImg || '/cover.png'}
                    className='w-full h-52 object-cover'
                    alt='cover image'
                  />
                  {isCurrentUser && (
                    <div
                      className='top-2 right-2 absolute bg-gray-800 bg-opacity-75 opacity-0 group-hover/cover:opacity-100 p-2 rounded-full transition duration-200 cursor-pointer'
                      onClick={() => coverImgRef.current.click()}
                    >
                      <MdEdit className='w-5 h-5 text-white' />
                    </div>
                  )}

                  <input
                    type='file'
                    hidden
                    name='coverImg'
                    accept='image/*'
                    ref={coverImgRef}
                    onChange={(e) => handleImgChange(e, 'coverImg')}
                  />
                  <input
                    type='file'
                    hidden
                    name='profileImg'
                    accept='image/*'
                    ref={profileImgRef}
                    onChange={(e) => handleImgChange(e, 'profileImg')}
                  />
                  {/* USER AVATAR */}
                  <div className='-bottom-16 left-4 absolute avatar'>
                    <div className='relative rounded-full w-32 group/avatar'>
                      <img
                        src={
                          profileImg ||
                          user?.profileImg ||
                          '/avatar-placeholder.png'
                        }
                      />
                      <div className='top-5 right-3 absolute bg-primary opacity-0 group-hover/avatar:opacity-100 p-1 rounded-full cursor-pointer'>
                        {isCurrentUser && (
                          <MdEdit
                            className='w-4 h-4 text-white'
                            onClick={() => profileImgRef.current.click()}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex justify-end mt-5 px-4'>
                  {isCurrentUser && (
                    <button
                      className='rounded-full btn btn-outline btn-sm'
                      type='button'
                      onClick={() =>
                        document
                          .getElementById('edit_profile_modal')
                          .showModal()
                      }
                    >
                      Edit profile
                    </button>
                  )}
                  {!isCurrentUser && (
                    <button
                      className='rounded-full btn btn-outline btn-sm'
                      onClick={() => follow(user?._id)}
                    >
                      {isPending && 'Loading...'}
                      {!isPending && amIFollowing && 'Unfollow'}
                      {!isPending && !amIFollowing && 'Follow'}
                    </button>
                  )}
                  {(coverImg || profileImg) && (
                    <button
                      className='ml-2 px-4 rounded-full text-white btn btn-primary btn-sm'
                      type='submit'
                    >
                      {isUpdateProfilePending ? 'Updating...' : 'Update'}
                    </button>
                  )}
                </div>
              </form>

              {isCurrentUser && (
                <EditProfileModal
                  authUser={authUser}
                  handleSubmit={handleSubmit}
                />
              )}

              <div className='flex flex-col gap-4 mt-14 px-4'>
                <div className='flex flex-col'>
                  <span className='font-bold text-lg'>{user?.fullName}</span>
                  <span className='text-slate-500 text-sm'>
                    @{user?.username}
                  </span>
                  <span className='my-1 text-sm'>{user?.bio}</span>
                </div>

                <div className='flex flex-wrap gap-2'>
                  {/* this will show when current user has "link" updated */}
                  {user?.link && (
                    <div className='flex items-center gap-1'>
                      <>
                        <FaLink className='w-3 h-3 text-slate-500' />
                        <a
                          href='https://youtube.com/@hungbui7690'
                          target='_blank'
                          rel='noreferrer'
                          className='text-blue-500 text-sm hover:underline'
                        >
                          {user?.link}
                        </a>
                      </>
                    </div>
                  )}
                  <div className='flex items-center gap-2'>
                    <IoCalendarOutline className='w-4 h-4 text-slate-500' />
                    <span className='text-slate-500 text-sm'>
                      {memberSinceDate}
                    </span>
                  </div>
                </div>
                <div className='flex gap-2'>
                  <div className='flex items-center gap-1'>
                    <span className='font-bold text-xs'>
                      {user?.following.length}
                    </span>
                    <span className='text-slate-500 text-xs'>Following</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <span className='font-bold text-xs'>
                      {user?.followers.length}
                    </span>
                    <span className='text-slate-500 text-xs'>Followers</span>
                  </div>
                </div>
              </div>

              {/* FEED TYPE */}
              <div className='flex border-gray-700 mt-4 border-b w-full'>
                <div
                  className='relative flex flex-1 justify-center hover:bg-secondary p-3 transition duration-300 cursor-pointer'
                  onClick={() => setFeedType('posts')}
                >
                  Posts
                  {feedType === 'posts' && (
                    <div className='bottom-0 absolute bg-primary rounded-full w-10 h-1' />
                  )}
                </div>
                <div
                  className='relative flex flex-1 justify-center hover:bg-secondary p-3 text-slate-500 transition duration-300 cursor-pointer'
                  onClick={() => setFeedType('likes')}
                >
                  Likes
                  {feedType === 'likes' && (
                    <div className='bottom-0 absolute bg-primary rounded-full w-10 h-1' />
                  )}
                </div>
              </div>
            </>
          )}

          <Posts feedType={feedType} username={username} userId={user?._id} />
        </div>
      </div>
    </>
  )
}

export default ProfilePage
