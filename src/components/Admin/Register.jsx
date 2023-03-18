import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'
import './register.scss'
import { useFormik } from 'formik';

export const Register = () => {

  const [user, setUser] = useState({
    email: '',
    password: '',
    userName: '',
    userLastName: '',
    rol: '',
    nameJob: ''
  });

  const [error, setError] = useState();

  const { signUp } = useAuth()

  const handleReset = () => {
    setUser({
      email: '',
      password: '',
      userName: '',
      userLastName: '',
      rol: '',
      nameJob: ''
    })
  }
  const regEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  const regExPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  const { values, errors, touched, handleBlur, resetForm, handleChange, handleSubmit } = useFormik({
    initialValues: {
      email: '',
      password: '',
      userName: '',
      userLastName: '',
      rol: '',
      nameJob: ''
    },
    validate: (values) => {
      const errors = {};
      if (!values.email) {
        errors.email = 'Es un campo requerido';
      }
      if (!regExPassword.test(values.password)) {
        errors.password = 'Mínimo ocho caracteres, al menos una letra mayúscula, una letra minúscula y un número'
      }
      if (!values.userName) {
        errors.userName = 'Es un campo requerido';
      }
      if (!values.userLastName) {
        errors.userLastName = 'Es un campo requerido';
      }
      if (!values.rol) {
        errors.rol = 'Es un campo requerido';
      }
      if (!values.nameJob) {
        errors.nameJob = 'Es un campo requerido';
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        setError('')
        const { email, password, userName, userLastName, nameJob, rol } = values;
        await signUp(email, password, userName, userLastName, nameJob, rol);
      } catch (error) {
        setError(error.message)
      }
      alert("se ha creado un usuario");
      resetForm();
      handleReset();
    }, onChange: async (e) => {
      const { name, value } = e.target;
      setUser({ ...user, [name]: value })
    },
    onBlur: () => {
      validateOnBlur
    }


  })


  return (
    <>
      <motion.form className='register' onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}>
        <h2 className='register_title'>Crear usuario</h2>
        {error && <span className='register_server_error'>{error}</span>}
        <label htmlFor="email" className='register_label'>
          Email
          {touched.email && <small className='register_error'>{errors.email}</small>}
          <input type="email" className='register_input' name='email' placeholder='Ingrese un email' onBlur={handleBlur} onChange={handleChange} />
        </label>
        <label htmlFor="password" className='register_label'>
          Contraseña
          {touched.password && <small className='register_error'>{errors.password}</small>}
          <input type="password" className='register_input' name='password' placeholder='******' onBlur={handleBlur} onChange={handleChange} />
        </label>
        <label htmlFor="userName" className='register_label'>
          Nombre de Usuario
          {touched.userName && <small className='register_error'>{errors.userName}</small>}
          <input type="text" className='register_input' name='userName' placeholder='Nombre del usuario' onBlur={handleBlur} onChange={handleChange} />
        </label>
        <label htmlFor="userLastName" className='register_label'>
          Apellido del Usuario
          {touched.userLastName && <small className='register_error'>{errors.userLastName}</small>}
          <input type="text" className='register_input' name='userLastName' placeholder='Apellido del usuario' onBlur={handleBlur} onChange={handleChange} />
        </label>
        <label htmlFor="rol" className='register_label'>
          Tipo de usuario
          {touched.rol && <small className='register_error'>{errors.rol}</small>}
          <select name="rol" className='register_select' onBlur={handleBlur} onChange={handleChange}>
            <option value="" className='register_option'></option>
            <option value="user" className='register_option'>Usuario</option>
            <option value="admin" className='register_option'>Administrador</option>
          </select>
        </label>
        <label htmlFor="nameJob" className='register_label'>
          Puesto
          {touched.nameJob && <small className='register_error'>{errors.nameJob}</small>}
          <input type="text" className='register_input' name='nameJob' placeholder='Ingrese el puesto del usuario' onBlur={handleBlur} onChange={handleChange} />
        </label>
        <div className='register_btn_container'>
          <button type='submit' className='register_btn_add'>Crear</button>
          <button type='reset' className='register_btn_close'>Cancelar</button>
        </div>

      </motion.form>

    </>

  )
}
export default Register;