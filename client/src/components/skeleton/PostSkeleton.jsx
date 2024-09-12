const PostSkeleton = () => {
  return (
    <div className='flex flex-col gap-4 p-4 w-full'>
      <div className='flex items-center gap-4'>
        <div className='rounded-full w-10 h-10 shrink-0 skeleton'></div>
        <div className='flex flex-col gap-2'>
          <div className='rounded-full w-12 h-2 skeleton'></div>
          <div className='rounded-full w-24 h-2 skeleton'></div>
        </div>
      </div>
      <div className='w-full h-40 skeleton'></div>
    </div>
  )
}

export default PostSkeleton
