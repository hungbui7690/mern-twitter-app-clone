import { FaRegComment } from 'react-icons/fa'
import { BiRepost } from 'react-icons/bi'
import { FaRegHeart } from 'react-icons/fa'
import { FaRegBookmark } from 'react-icons/fa6'
import { FaTrash } from 'react-icons/fa'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import LoadingSpinner from './LoadingSpinner'
import { formatPostDate } from '../../utils/date'
import { axiosInstance } from '../../utils/axios'

const Post = ({ post }) => {
  console.log(post)
  const [comment, setComment] = useState('')
  const { data: authUser } = useQuery({ queryKey: ['authUser'] })

  // The useQueryClient hook (to not be confused with the useQuery hook or QueryClient) is our entry point to interacting with our query cache. The useQueryClient hook returns the instance of the current QueryClient of our application.
  // const {
  //   prefetchQuery,
  //   fetchQuery,
  //   getQueryData,
  //   refetchQueries,
  //   getQueryState,
  //   setQueryDefaults,
  //   clear,
  // } = useQueryClient();
  const queryClient = useQueryClient()
  const postOwner = post.user
  const isLiked = post.likes.includes(authUser._id)
  const isMyPost = authUser._id === post.user._id
  const formattedDate = formatPostDate(post.createdAt)

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axiosInstance(`/posts/${post._id}`, {
          method: 'DELETE',
        })
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
      toast.success('Post deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const handleDeletePost = () => {
    deletePost()
  }

  const handlePostComment = (e) => {
    e.preventDefault()
  }

  const handleLikePost = () => {}

  return (
    <>
      <div className='flex items-start gap-2 border-gray-700 p-4 border-b'>
        <div className='avatar'>
          <Link
            to={`/profile/${postOwner.username}`}
            className='rounded-full w-8 overflow-hidden'
          >
            <img src={postOwner.profileImg || '/avatar-placeholder.png'} />
          </Link>
        </div>
        <div className='flex flex-col flex-1'>
          <div className='flex items-center gap-2'>
            <Link to={`/profile/${postOwner.username}`} className='font-bold'>
              {postOwner.fullName}
            </Link>
            <span className='flex gap-1 text-gray-700 text-sm'>
              <Link to={`/profile/${postOwner.username}`}>
                @{postOwner.username}
              </Link>
              <span>·</span>
              <span>{formattedDate}</span>
            </span>
            {isMyPost && (
              <span className='flex flex-1 justify-end'>
                {!isDeleting && (
                  <FaTrash
                    className='hover:text-red-500 cursor-pointer'
                    onClick={handleDeletePost}
                  />
                )}

                {isDeleting && <LoadingSpinner size='sm' />}
              </span>
            )}
          </div>
          <div className='flex flex-col gap-3 overflow-hidden'>
            <span>{post.text}</span>
            {post.img && (
              <img
                src={post.img}
                className='border-gray-700 border rounded-lg h-80 object-contain'
                alt=''
              />
            )}
          </div>
          <div className='flex justify-between mt-3'>
            <div className='flex justify-between items-center gap-4 w-2/3'>
              <div
                className='flex items-center gap-1 cursor-pointer group'
                onClick={() =>
                  document
                    .getElementById('comments_modal' + post._id)
                    .showModal()
                }
              >
                <FaRegComment className='group-hover:text-sky-400 w-4 h-4 text-slate-500' />
                <span className='group-hover:text-sky-400 text-slate-500 text-sm'>
                  {post.comments.length}
                </span>
              </div>
              {/* We're using Modal Component from DaisyUI */}
              <dialog
                id={`comments_modal${post._id}`}
                className='border-none modal outline-none'
              >
                <div className='border-gray-600 border rounded modal-box'>
                  <h3 className='mb-4 font-bold text-lg'>COMMENTS</h3>
                  <div className='flex flex-col gap-3 max-h-60 overflow-auto'>
                    {post.comments.length === 0 && (
                      <p className='text-slate-500 text-sm'>
                        No comments yet 🤔 Be the first one 😉
                      </p>
                    )}
                    {post.comments.map((comment) => (
                      <div key={comment._id} className='flex items-start gap-2'>
                        <div className='avatar'>
                          <div className='rounded-full w-8'>
                            <img
                              src={
                                comment.user.profileImg ||
                                '/avatar-placeholder.png'
                              }
                            />
                          </div>
                        </div>
                        <div className='flex flex-col'>
                          <div className='flex items-center gap-1'>
                            <span className='font-bold'>
                              {comment.user.fullName}
                            </span>
                            <span className='text-gray-700 text-sm'>
                              @{comment.user.username}
                            </span>
                          </div>
                          <div className='text-sm'>{comment.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form
                    className='flex items-center gap-2 border-gray-600 mt-4 pt-2 border-t'
                    onSubmit={handlePostComment}
                  >
                    <textarea
                      className='border-gray-800 p-1 border rounded w-full text-md resize-none textarea focus:outline-none'
                      placeholder='Add a comment...'
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button className='px-4 rounded-full text-white btn btn-primary btn-sm'>
                      {<LoadingSpinner size='md' />}
                    </button>
                  </form>
                </div>
                <form method='dialog' className='modal-backdrop'>
                  <button className='outline-none'>close</button>
                </form>
              </dialog>
              <div className='flex items-center gap-1 cursor-pointer group'>
                <BiRepost className='group-hover:text-green-500 w-6 h-6 text-slate-500' />
                <span className='group-hover:text-green-500 text-slate-500 text-sm'>
                  0
                </span>
              </div>
              <div
                className='flex items-center gap-1 cursor-pointer group'
                onClick={handleLikePost}
              >
                <FaRegHeart className='group-hover:text-pink-500 w-4 h-4 text-slate-500 cursor-pointer' />
                <span
                  className={`text-sm  group-hover:text-pink-500 ${
                    isLiked ? 'text-pink-500' : 'text-slate-500'
                  }`}
                >
                  {post.likes.length}
                </span>
              </div>
            </div>
            <div className='flex justify-end items-center gap-2 w-1/3'>
              <FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Post
