import { Link } from 'react-router-dom'
import RightPanelSkeleton from '../skeleton/RightPanelSkeleton'
import { USERS_FOR_RIGHT_PANEL } from '../../utils/db/dummy'

const RightPanel = () => {
  const isLoading = false

  return (
    <div className='lg:block hidden my-4 ml-3'>
      <div className='top-7 sticky bg-[#16181C] p-4 rounded-md'>
        <p className='mb-5 font-bold text-white text-xl'>Who to follow</p>
        <div className='flex flex-col gap-4'>
          {/* item */}
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isLoading &&
            USERS_FOR_RIGHT_PANEL?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className='flex justify-between items-center gap-4'
                key={user._id}
              >
                <div className='flex items-center gap-2'>
                  <div className='avatar'>
                    <div className='rounded-full w-8'>
                      <img src={user.profileImg || '/avatar-placeholder.png'} />
                    </div>
                  </div>
                  <div className='flex flex-col'>
                    <span className='w-28 font-semibold truncate tracking-tight'>
                      {user.fullName}
                    </span>
                    <span className='text-slate-500 text-sm'>
                      @{user.username}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    className='bg-white hover:bg-white hover:opacity-90 rounded-full text-black btn btn-sm'
                    onClick={(e) => e.preventDefault()}
                  >
                    Follow
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}

export default RightPanel
