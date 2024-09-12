const ProfileHeaderSkeleton = () => {
  return (
    <div className='flex flex-col gap-2 my-2 p-4 w-full'>
      <div className='flex items-center gap-2'>
        <div className='flex flex-1 gap-1'>
          <div className='flex flex-col gap-1 w-full'>
            <div className='rounded-full w-12 h-4 skeleton'></div>
            <div className='rounded-full w-16 h-4 skeleton'></div>
            <div className='relative w-full h-40 skeleton'>
              <div className='-bottom-10 left-3 absolute border rounded-full w-20 h-20 skeleton'></div>
            </div>
            <div className='mt-4 ml-auto rounded-full w-24 h-6 skeleton'></div>
            <div className='mt-4 rounded-full w-14 h-4 skeleton'></div>
            <div className='rounded-full w-20 h-4 skeleton'></div>
            <div className='rounded-full w-2/3 h-4 skeleton'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeaderSkeleton
