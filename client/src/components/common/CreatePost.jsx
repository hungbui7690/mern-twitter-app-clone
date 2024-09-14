import { CiImageOn } from 'react-icons/ci'
import { BsEmojiSmileFill } from 'react-icons/bs'
import { useEffect, useRef, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../../utils/axios'
import toast from 'react-hot-toast'
import Emoji from '../emoji/Emoji'

const CreatePost = () => {
  const imgRef = useRef(null)
  const emojiRef = useRef(null)
  const emojiContainerRef = useRef(null)
  const [imgURL, setImgURL] = useState(null)
  const [openEmoji, setOpenEmoji] = useState(false)
  const [text, setText] = useState('')

  useEffect(() => {
    const handler = (e) => {
      if (
        !emojiRef?.current?.contains(e.target) &&
        !emojiContainerRef?.current?.contains(e.target)
      )
        setOpenEmoji(false)
    }
    document.addEventListener('mousedown', handler)

    return () => {
      document.removeEventListener('mousedown', handler)
    }
  })

  const { data: authUser } = useQuery({ queryKey: ['authUser'] })
  const queryClient = useQueryClient()

  const {
    mutate: createPost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await axiosInstance.post('/posts', formData)
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
      toast.success('Post created successfully')
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImgURL(URL.createObjectURL(file))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    createPost(formData)
    setImgURL(null)
    setText('')
    e.target.reset()
  }

  return (
    <div className='flex items-start gap-4 border-gray-700 p-4 border-b'>
      <div className='avatar'>
        <div className='rounded-full w-8'>
          <img src={authUser.profileImg || '/avatar-placeholder.png'} />
        </div>
      </div>
      <form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
        <textarea
          className='border-gray-800 p-0 border-none w-full text-lg resize-none textarea focus:outline-none'
          placeholder='What is happening?!'
          name='text'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {imgURL && (
          <div className='relative mx-auto w-72'>
            <IoCloseSharp
              className='top-0 right-0 absolute bg-gray-800 rounded-full w-5 h-5 text-white cursor-pointer'
              onClick={() => setImgURL(null)}
            />
            <img
              src={imgURL}
              className='mx-auto rounded w-full h-72 object-contain'
            />
          </div>
        )}

        <div className='flex justify-between py-2 border-t border-t-gray-700'>
          <div className='relative flex items-center gap-1'>
            <CiImageOn
              className='w-6 h-6 cursor-pointer fill-primary'
              onClick={() => imgRef.current.click()}
            />
            <div ref={emojiRef}>
              <BsEmojiSmileFill
                className='w-5 h-5 cursor-pointer fill-primary'
                onClick={() => setOpenEmoji(!openEmoji)}
              />
            </div>
            {openEmoji && (
              <Emoji
                emojiContainerRef={emojiContainerRef}
                setOpenEmoji={setOpenEmoji}
                setText={setText}
                text={text}
              />
            )}
          </div>
          <input
            type='file'
            name='img'
            accept='image/*'
            hidden
            ref={imgRef}
            onChange={handleImageChange}
          />
          <button className='px-4 rounded-full text-white btn btn-primary btn-sm'>
            {isPending ? 'Posting...' : 'Post'}
          </button>
        </div>
        {isError && <div className='text-red-500'>{error.message}</div>}
      </form>
    </div>
  )
}

export default CreatePost
