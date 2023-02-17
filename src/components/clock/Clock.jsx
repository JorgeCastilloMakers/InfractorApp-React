import {useState, useEffect} from 'react'
import {motion} from 'framer-motion'
import './clock.scss'

export const Clock = () => {

const [time, setTime] = useState()

useEffect(() => {
  setInterval(() => {
    const date = new Date();
    setTime(date.toLocaleTimeString() )
  })
}, [1000])

  return (
    <>

    <motion.p className='clock'         
        initial={{opacity: 0}} 
        animate={{opacity: 1}} 
        exit={{opacity: 0}}
        >{time} HS
      </motion.p>

    </>
  )
}

export default Clock