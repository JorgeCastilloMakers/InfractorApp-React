import toast, { Toaster } from 'react-hot-toast';


export const Alert = () => {
  return (
    <div>
      {toast((t) => (
        <span>
          Custom and <b>bold</b>
          <button onClick={() => toast.dismiss(t.id)}>
            Dismiss
          </button>
        </span>
      ))}
    </div>
  )
}


export default Alert;