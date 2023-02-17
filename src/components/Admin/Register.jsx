import {useState} from 'react'
import {useAuth} from '../../context/AuthContext'
import {motion} from 'framer-motion'
import './register.scss'

export const Register = () => {

  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState();

  const {signUp} = useAuth()

  const handleChange = ({target: {name, value}}) =>{
    setUser({...user, [name]: value})
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
      setError('')
      const {email, password, userName, userLastName, nameJob, rol} = user
      await signUp(email, password, userName, userLastName, nameJob, rol);
      {alert("usuario creado")}
      e.target.reset()
    } catch (error) {
      setError(error.message)
    }
    
  }


  return (
    <>
    <motion.form className='register' onSubmit={handleSubmit} 
    initial={{opacity: 0}} 
    animate={{opacity: 1}} 
    exit={{opacity: 0}}>
      <h2 className='register_title'>Crear usuario</h2>
      {error && <span className='register_server_error'>{error}</span>}
      <label htmlFor="email" className='register_label'>
        Email
        <small className='register_error'></small>
        <input type="email" className='register_input' name='email' placeholder='Ingrese un email' onChange={handleChange}/>
      </label>
        <label htmlFor="password" className='register_label'>
          Contraseña
          <small className='register_error'></small>
          <input type="password" className='register_input' name='password' placeholder='******' onChange={handleChange}/>
        </label>
        <label htmlFor="userName" className='register_label'>
          Nombre de Usuario
          <small className='register_error'></small>
          <input type="text" className='register_input' name='userName' placeholder='Nombre del usuario' onChange={handleChange}/>
        </label>
        <label htmlFor="userLastName" className='register_label'>
          Apellido del Usuario
          <small className='register_error'></small>
          <input type="text" className='register_input' name='userLastName' placeholder='Apellido del usuario' onChange={handleChange}/>
        </label>
        <label htmlFor="rol" className='register_label'>
          Tipo de usuario
          <small className='register_error'></small>
          <select name="rol" className='register_select' onChange={handleChange}>
            <option value=""  className='register_option'></option>
            <option value="user" className='register_option'>Usuario</option>
            <option value="admin" className='register_option'>Administrador</option>
          </select>
        </label>
        <label htmlFor="nameJob" className='register_label'>
          Puesto
          <small className='register_error'></small>
          <input type="text" className='register_input' name='nameJob' placeholder='Ingrese el puesto del usuario' onChange={handleChange}/>
        </label>
      <div  className='register_btn_container'>
          <button type='submit' className='register_btn_add'>Crear</button>
          <button type='reset'  className='register_btn_close'>Cancelar</button>
      </div>



    </motion.form>
    
    </>

  )
}
export default Register;