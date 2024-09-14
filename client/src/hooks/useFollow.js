import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { axiosInstance } from '../utils/axios'

const useFollow = () => {
  const queryClient = useQueryClient()

  const { mutate: follow, isPending } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await axiosInstance.post(`/user/follow/${userId}`)
        return res.data
      } catch (error) {
        console.log(error.response.data.msg)
        return error
      }
    },
    onSuccess: (data) => {
      if (data.response) {
        toast.error(data.response.data.msg)
        return
      }
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['suggestedUsers'] }),
        queryClient.invalidateQueries({ queryKey: ['authUser'] }),
      ])
    },
  })

  return { follow, isPending }
}

export default useFollow
