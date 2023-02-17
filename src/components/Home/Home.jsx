
import { useAuth } from "../../context/AuthContext";
import { FiPlusCircle } from 'react-icons/fi';
import Clock from "../clock/Clock";
import {AnimatePresence, motion} from 'framer-motion'
import './home.scss'
import { useNavigate} from 'react-router-dom'
import { useState,useEffect} from 'react'

export const Home = () => {

  const { loading, userInfo} = useAuth()
  const navigate = useNavigate()

  if (loading) return <h1>Loading...</h1>

  const handlePlus = () => navigate('/add');

  return (
    <>    
    <AnimatePresence>
      <motion.div 
        initial={{opacity: 0}} 
        animate={{opacity: 1}} 
        exit={{opacity: 0}} className="home">
        <div className="home_title">
          <h2>Hola, {userInfo.name}</h2>
        </div>
        <Clock className='home_clock'/>
        <h3 className="home_help">Toca el signo + para agregar una infracción</h3>
        <button className="add_infringement" onClick={handlePlus}><FiPlusCircle className="add_infringement_icon"/></button>   
      </motion.div>
    </AnimatePresence>
    </>
  )
}

export default Home;