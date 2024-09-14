const EditProfileModal = ({ handleSubmit, authUser }) => {
  console.log(authUser)
  return (
    <>
      <dialog id='edit_profile_modal' className='modal'>
        <div className='border-gray-700 shadow-md border rounded-md modal-box'>
          <h3 className='my-3 font-bold text-lg'>Update Profile</h3>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className='flex flex-wrap gap-2'>
              <input
                type='text'
                placeholder='Full Name'
                className='flex-1 border-gray-700 p-2 border rounded input input-md'
                name='fullName'
                defaultValue={authUser.fullName}
              />
              <input
                type='text'
                placeholder='Username'
                className='flex-1 border-gray-700 p-2 border rounded input input-md'
                name='username'
                defaultValue={authUser.username}
                disabled
              />
            </div>
            <div className='flex flex-wrap gap-2'>
              <input
                type='email'
                placeholder='Email'
                className='flex-1 border-gray-700 p-2 border rounded input input-md'
                name='email'
                defaultValue={authUser.email}
                disabled
              />
              <textarea
                placeholder='Bio'
                className='flex-1 border-gray-700 p-2 border rounded input input-md'
                name='bio'
                defaultValue={authUser.bio}
              />
            </div>
            <div className='flex flex-wrap gap-2'>
              <input
                type='password'
                placeholder='Current Password'
                className='flex-1 border-gray-700 p-2 border rounded input input-md'
                name='currentPassword'
                autoComplete='true'
              />
              <input
                type='password'
                placeholder='New Password'
                className='flex-1 border-gray-700 p-2 border rounded input input-md'
                name='newPassword'
                autoComplete='true'
              />
            </div>
            <input
              type='text'
              placeholder='Link'
              className='flex-1 border-gray-700 p-2 border rounded input input-md'
              name='link'
              autoComplete='true'
              defaultValue={authUser.link}
            />
            <button className='rounded-full text-white btn btn-primary btn-sm'>
              Update
            </button>
          </form>
        </div>

        {/* we can use label tag with 'modal-backdrop' class that covers the screen so we can close the modal when clicked outside -> from daisy UI */}
        <form method='dialog' className='modal-backdrop'>
          <button className='outline-none'>close</button>
        </form>
      </dialog>
    </>
  )
}

export default EditProfileModal
