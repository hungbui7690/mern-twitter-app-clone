import Notification from '../model/Notification.js'

export const getNotifications = async (req, res) => {
  const userId = req.user._id

  const notifications = await Notification.find({ to: userId }).populate({
    path: 'from',
    select: 'username profileImg',
  })

  await Notification.updateMany({ to: userId }, { read: true })

  res.status(200).json(notifications)
}

export const deleteNotifications = async (req, res) => {
  const userId = req.user._id
  await Notification.deleteMany({ to: userId })
  res.status(200).json({ message: 'Notifications deleted successfully' })
}
