import Post from './Post'
import PostSkeleton from '../skeleton/PostSkeleton'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { axiosInstance } from '../../utils/axios'
import { usePostStore } from '../../zustand/usePostStore'

// feedType: "forYou" or "following"
const Posts = ({ username, userId }) => {
  const { feedType } = usePostStore((state) => state)

  const getPostEndpoint = () => {
    switch (feedType) {
      case 'forYou':
        return '/posts'
      case 'following':
        return '/posts/following'
      case 'posts':
        return `/posts/user/${username}`
      case 'likes':
        return `/posts/likes/${userId}`
      default:
        return '/posts'
    }
  }

  const POST_ENDPOINT = getPostEndpoint()
  // console.log(POST_ENDPOINT)

  // const { data: posts, isLoading, refetch, isRefetching, status, fetchStatus } = useQuery({
  // refetch -> manual refetching -> https://www.basedash.com/blog/efficient-data-synchronization-with-react-query-mastering-refetch-techniques
  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(POST_ENDPOINT)
        // console.log('Posts: ', res)
        return res.data
      } catch (error) {
        console.error(error.response.data.msg)
        return error
      }
    },
    // refetchType: 'all',
  })

  useEffect(() => {
    refetch()
  }, [feedType, refetch, username])

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className='flex flex-col justify-center'>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className='my-4 text-center'>No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  )
}

export default Posts
