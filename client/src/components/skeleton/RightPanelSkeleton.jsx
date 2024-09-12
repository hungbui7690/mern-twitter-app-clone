const RightPanelSkeleton = () => {
  return (
    <div className='flex flex-col gap-2 my-2 w-52'>
      <div className='flex items-center gap-2'>
        <div className='rounded-full w-8 h-8 shrink-0 skeleton'></div>
        <div className='flex flex-1 justify-between'>
          <div className='flex flex-col gap-1'>
            <div className='rounded-full w-12 h-2 skeleton'></div>
            <div className='rounded-full w-16 h-2 skeleton'></div>
          </div>
          <div className='rounded-full w-14 h-6 skeleton'></div>
        </div>
      </div>
    </div>
  )
}

export default RightPanelSkeleton
