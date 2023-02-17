import {useState, useEffect} from 'react'
import {useAuth} from '../../context/AuthContext'
import {useNavigate} from 'react-router-dom'
import './login.scss'
import {motion} from 'framer-motion'


export const Login = () => {

  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState();

  const { login, loading, userInfo } = useAuth()

  const navigate = useNavigate()

  const handleChange = ({target: {name, value}}) =>{
    setUser({...user, [name]: value})
  }


  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
      setError('')
      await login(user);
    } catch (error) {
      setError(error.message)
    }
    
  }
  if (loading) return <h1>Loading...</h1>

  return (
    <motion.div className='login' 
    initial={{opacity: 0}} 
    animate={{opacity: 1}} 
    exit={{opacity: 0}}>
      <form className='login__form' onSubmit={handleSubmit}>
        {error && <span className='login__error'>{error}</span>}
        <div className='login__fields'>
          <label htmlFor="email" className='login__fields_label'>Email</label>
          <input type="email" name='email' className='login__fields_input' placeholder='Ingrese un email' onChange={handleChange}/> 
        </div>
        <div className='login__fields'>
          <label htmlFor="password" className='login__fields_label'>Contraseña</label>
          <input type="password" name='password' className='login__fields_input' placeholder='******' onChange={handleChange}/>
        </div>
        <button className='login__button'>Ingresar</button>
      </form>
    </motion.div>

  )
}
export default Login;