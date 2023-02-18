import { motion } from "framer-motion";
import { useState } from 'react';
import { db, uploadFile } from '../../../firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import './addInfringement.scss';
import { useFormik } from 'formik';
import * as Yup from 'yup';



const validationSchema = Yup.object({
  uf: Yup.string().trim().required('Campo requerido'),
  type: Yup.string().trim().required('Campo requerido'),
  date: Yup.date().max(new Date(), 'La fecha no puede ser superior a la actual').required('Campo requerido'),
  name: Yup.string().trim().required('Campo requerido'),
  lastname: Yup.string().trim().required('Campo requerido'),
  dni: Yup.number().integer('Debe ser un numero entero').required('Campo requerido').moreThan(6, 'Ingresa un DNI valido'),
  observations: Yup.string().required('Campo requerido'),
  carID: Yup.string().max(7, 'Ingresa un dominio valido'),
})

export const AddInfringement = () => {
  const [file, setFile] = useState(()=>{})
  const [date, setDate] = useState("" || { day: new Date().getDate(), month: (new Date().getMonth()) + 1, year: new Date().getFullYear() })
  const [data, setData] = useState({
      uf: '',
      type: '',
      date: ``,
      time: '',
      name: '',
      lastname: '',
      dni: '',
      observations: '',
      carID: '',
      imageURL: '',
      aprove: "false"
  })
  const [error, setError] = useState();

  let fecha = (`${date.year}-${date.month < 10 ? "0"+ date.month : date.month}-${date.day < 10 ? "0"+ date.day : date.day}`)

  let today = new Date();
  let hour = today.getHours();
  let minutes = today.getMinutes();
  let timeNow = `${hour}:${minutes}`


const handleReset = () => {
  setData({
    uf: '',
    type: '',
    date: '',
    time: '',
    name: '',
    lastname: '',
    dni: '',
    observations: '',
    carID: '',
    imageURL: ''
})
}
  const upToDatabase = async (data) => {
    
    try {
    const newInfringement = await addDoc(collection(db, "Infraccion"), {data});
    const docRef = doc(db, `Infraccion/${newInfringement.id}`);
    setDoc(docRef, {...data})
     alert("se cargo una nueva infraccion");
     setData('')
    } catch (error) {
      console.log(error)
    }
     
  }

  const { handleSubmit, errors, touched, handleChange, validateOnBlur, handleBlur, validate, values } = useFormik({
    initialValues: {
      uf: '',
      type: '',
      date: '',
      time: '',
      name: '',
      lastname: '',
      dni: '',
      observations: '',
      carID: '',
      imageURL: '',
      aprove: false
    },
    validationSchema,
    onSubmit: async (values) => {
      let imageUpload = await uploadFile(file).then()
      if(imageUpload === ""){
        imageUpload = "Sin imagen"
      }
      const infringement = { ...values, imageURL: `${imageUpload}` };
      setData(infringement)
      upToDatabase(infringement)
      handleReset();
    },
    onChange: async (e) => {
      const {name, value} = e.target;    
      setData({...data, [name]: value})
    },
    onBlur: () => {
      validateOnBlur
    }
    
  });

  return (
    <>
      
      <motion.form className="infringement"
        initial={{opacity: 0}} 
        animate={{opacity: 1}} 
        exit={{opacity: 0}}
        onSubmit={handleSubmit}>
        <div className="infringement_box"> 
          <h2 className='infringement_title'>Crear Infracción</h2>
          {error && <span className='infringement_server_error'>{error}</span>}
          <label className='infringement_label' htmlFor="uf">
            Unidad
            {touched.uf && <small className='infringement_error'>{errors.uf}</small>}
            <input className='infringement_input' type="text" name="uf" onChange={handleChange} onBlur={handleBlur} value={values.uf} />              
          </label>
          <label className='infringement_label' htmlFor="type">
            Tipo
            {touched.type && <small className='infringement_error'>{errors.type}</small>}            
            <select  className='infringement_select' name="type" onChange={handleChange} onBlur={ handleBlur } value={values.type}>
              <option value="Control de transito interno">Control de transito interno</option>
              <option value="Ruidos Molestos">Ruidos Molestos</option>
              <option value="Estacionamiento prohibo">Estacionamiento prohibo</option>
              <option value="Exceso de velocidad">Exceso de velocidad</option>
              <option value="Infracciones en obras de construcción">Infracciones en obras de construcción</option>
              <option value="Control de animales">Control de animales</option>
              <option value="Uso de áreas comunes">Uso de áreas comunes</option>
              <option value="Uso de áreas privadas">Uso de áreas privadas</option>
              <option value="Control de tránsito interno">Control de tránsito interno</option>
              <option value="Uso de Club House/SUM">Uso de Club House/SUM</option>
              <option value="Fallas en medida de seguridad">Fallas en medida de seguridad</option>
              <option value="Medioambiente">Medioambiente</option>
            </select>             
          </label>
          <label className='infringement_label' htmlFor="date">
            Fecha
            {touched.date && <small className='infringement_error'>{errors.date}</small>}
            <input className='infringement_input' type="date" name="date" defaultValue={fecha} onChange={handleChange} onBlur={ handleBlur } value={values.date}/>              
          </label>
          <label className='infringement_label' htmlFor="time">
            Hora
            <input className='infringement_input' type="time" name="time" defaultValue={timeNow} onChange={handleChange} onBlur={ handleBlur } value={values.time}/>  
          </label>
          <label className='infringement_label' htmlFor="name">
            Nombre
            {touched.name && <small className='infringement_error'>{errors.name}</small>}
            <input className='infringement_input' type="text" name="name" onChange={handleChange} onBlur={ handleBlur } value={values.name}/> 
          </label>
          <label className='infringement_label' htmlFor="lastname">
            Apellido
            {touched.lastname && <small className='infringement_error'>{errors.lastname}</small>}
            <input className='infringement_input' type="text" name="lastname" onChange={handleChange} onBlur={ handleBlur } value={values.lastname}/> 
          </label>

        </div>
        <div className="infringement_box_2nd">
          <label className='infringement_label' htmlFor="dni">
            DNI
            {touched.dni && <small className='infringement_error'>{errors.dni}</small>}
            <input className='infringement_input' type="number" name="dni" onChange={handleChange} onBlur={ handleBlur } value={values.dni}/> 
          </label>
          <label className='infringement_label' htmlFor="observations">
            Observaciones
            {touched.observations && <small className='infringement_error'>{errors.observations}</small>}
          <textarea className='infringement_textarea' name="observations"  cols="30" rows="10" onChange={handleChange} onBlur={ handleBlur } value={values.observations}></textarea> 
          </label>
          <label className='infringement_label' htmlFor="carID">
            Dominio
            {touched.carID && <small className='infringement_error'>{errors.carID}</small>}
            <input className='infringement_input' type="text" name="carID" onChange={handleChange} onBlur={ handleBlur } value={values.carID}/>
          </label>
          <label className='infringement_label' htmlFor="imageURL">
            Imagen
          <input className='infringement_input' type="file" name="imageURL"  onChange={e => setFile(e.target.files[0])}/>  
          </label>
        <div className="infringement_btn_container">
          <button type="submit" className='infringement_btn_add'>Agregar</button>             
          <button type="reset" className='infringement_btn_close' onClick={handleReset}>Cancelar</button>
        </div>

        </div>


        
        
      </motion.form>  
    </>
  )
}

export default AddInfringement