import { StatusCodes } from 'http-status-codes'
import BadRequestError from '../errors/bad-request.js'
import Notification from '../model/Notification.js'
import UnauthorizedError from '../errors/unauthorized.js'

export const getAllNotifications = async (req, res) => {
  const userId = req.user._id

  // get all notifications for the current user
  const notifications = await Notification.find({ to: userId }).populate({
    path: 'from',
    select: 'username profileImg',
  })

  // set read=true
  await Notification.updateMany({ to: userId }, { read: true })
  res.status(200).json(notifications)
}

export const deleteNotification = async (req, res) => {
  const { id: notificationID } = req.params
  const userId = req.user._id

  // find the notification by id
  const notification = await Notification.findById(notificationID)

  // if notification not found, throw an error
  if (!notification)
    throw new BadRequestError(`No notification with id ${notificationID}`)

  // if the user is not the owner of the notification, throw an error
  if (notification.to.toString() !== userId.toString())
    throw new UnauthorizedError(
      'You are not allowed to delete this notification'
    )

  // delete the notification
  await Notification.findByIdAndDelete(notificationID)

  res.status(200).json({ message: 'Notifications deleted successfully' })
}

export const deleteAllNotifications = async (req, res) => {
  const userId = req.user._id

  // delete all notifications for the current user
  await Notification.deleteMany({ to: userId })
  res.status(200).json({ message: 'Notifications deleted successfully' })
}
