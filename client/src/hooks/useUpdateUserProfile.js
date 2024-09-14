import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { axiosInstance } from '../utils/axios'

const useUpdateUserProfile = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: updateProfile, isPending: isUpdateProfilePending } =
    useMutation({
      mutationFn: async (formData) => {
        try {
          const res = await axiosInstance.patch(`/user/update`, formData)
          return res.data
        } catch (error) {
          throw new Error(error.response.data)
        }
      },
      onSuccess: () => {
        toast.success('Profile updated successfully')
        Promise.all([
          queryClient.invalidateQueries({ queryKey: ['authUser'] }),
          queryClient.invalidateQueries({ queryKey: ['userProfile'] }),
        ])
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })

  return { updateProfile, isUpdateProfilePending }
}

export default useUpdateUserProfile
