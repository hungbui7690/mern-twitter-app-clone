import { CiImageOn } from 'react-icons/ci'
import { BsEmojiSmileFill } from 'react-icons/bs'
import { useRef, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5'

const CreatePost = () => {
  const [text, setText] = useState('')
  const [img, setImg] = useState(null)

  const imgRef = useRef(null)

  const isPending = false
  const isError = false

  const data = {
    profileImg: '/avatars/boy1.png',
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Post created successfully')
  }

  const handleImgChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImg(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className='flex items-start gap-4 border-gray-700 p-4 border-b'>
      <div className='avatar'>
        <div className='rounded-full w-8'>
          <img src={data.profileImg || '/avatar-placeholder.png'} />
        </div>
      </div>
      <form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
        <textarea
          className='border-gray-800 p-0 border-none w-full text-lg resize-none textarea focus:outline-none'
          placeholder='What is happening?!'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {img && (
          <div className='relative mx-auto w-72'>
            <IoCloseSharp
              className='top-0 right-0 absolute bg-gray-800 rounded-full w-5 h-5 text-white cursor-pointer'
              onClick={() => {
                setImg(null)
                imgRef.current.value = null
              }}
            />
            <img
              src={img}
              className='mx-auto rounded w-full h-72 object-contain'
            />
          </div>
        )}

        <div className='flex justify-between py-2 border-t border-t-gray-700'>
          <div className='flex items-center gap-1'>
            <CiImageOn
              className='w-6 h-6 cursor-pointer fill-primary'
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill className='w-5 h-5 cursor-pointer fill-primary' />
          </div>
          <input type='file' hidden ref={imgRef} onChange={handleImgChange} />
          <button className='px-4 rounded-full text-white btn btn-primary btn-sm'>
            {isPending ? 'Posting...' : 'Post'}
          </button>
        </div>
        {isError && <div className='text-red-500'>Something went wrong</div>}
      </form>
    </div>
  )
}

export default CreatePost
