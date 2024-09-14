const data = [
  '😀',
  '😁',
  '😂',
  '🤣',
  '😃',
  '😄',
  '😅',
  '😆',
  '😉',
  '😊',
  '😋',
  '😎',
  '😍',
  '😘',
  '🥰',
  '😗',
  '😙',
  '😚',
  '🙂',
  '🤗',
  '🤐',
  '😐',
  '😪',
  '😥',
]

const Emoji = ({ emojiContainerRef, setOpenEmoji, text, setText }) => {
  return (
    <div className='top-10 absolute bg-slate-950 w-48' ref={emojiContainerRef}>
      <div className='border-slate-700 grid grid-cols-4 border rounded-md'>
        {data.map((emoji, index) => (
          <div
            key={index}
            className='text-2xl cursor-pointer'
            onClick={() => {
              setOpenEmoji(false)
              setText(text + emoji)
            }}
          >
            {emoji}
          </div>
        ))}
      </div>
    </div>
  )
}
export default Emoji
