import './dashboard.scss'
import { db } from '../../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Box, Avatar } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useAuth } from '../../context/AuthContext'
import { useEffect } from 'react'
import { BsCardImage, BsCheckCircleFill } from "react-icons/bs";
import { useState } from 'react'
import { AiOutlineCloseCircle, AiFillCloseCircle, AiFillFileExcel } from "react-icons/ai";
import { motion } from 'framer-motion'
import avatarAdmin from '../../../src/assets/avatar-admin.jpg'
import avatarUser from '../../../src/assets/avatar-user.jpg'



export const Dashboard = () => {

  const { getUsers, usersList, getInfringement, infringementList } = useAuth();
  const [modalAprove, setModalAprove] = useState(false)
  const [dataPreview, setDataPreview] = useState({
    uf: "",
    fullname: "",
    dni: "",
    dominio: "",
    tipo: "",
    fecha: "",
    hora: "",
    aprove: false,
    observations: "",
    imagen: ""
  })
  const [dataSelected, setDataSelected] = useState([])
  //Se monta el componente y se obtienen los listados de users e infracciones que provienen de Firebase mediante
  //estas dos funciones que se encuentran en el context, getUsers y getInfringement que devuelven un array.
  useEffect(() => {
    getUsers()
  }, [])
  useEffect(() => {
    getInfringement()
  }, [])

  //Prepara la informacion que se va a renderizar en el modal para aprobacion de la infraccion.
  //Tambien cambia el dataSelected para tener en un estado la info completa de la fila seleccionada para realizar cambios en la db.
  const viewData = (data) => {
    setDataSelected(data)
    let { carID, date, dni, id, imageURL, lastname, name, observations, time, type, uf, aprove } = data;
    let dataToSend = { ...dataPreview, id: id, dni: dni, dominio: carID, fecha: date, fullname: name + " " + lastname, hora: time, tipo: type, uf: uf, imagen: imageURL, observations: observations, aprove: aprove };
    setDataPreview(dataToSend)
    setModalAprove(!modalAprove)
  }

  //Funcion que sirve que cambia la calve "aprove" a "true", esto modifica la db en Firestore y vuelve a recargar el grid.
  const aproveInfringement = async (data) => {
    let dataEdit = { ...data, aprove: true }
    try {
      const docRef = doc(db, `Infraccion/${data.id}`);
      const payload = { ...dataEdit }
      setDoc(docRef, payload)
      setModalAprove(!modalAprove)
      getInfringement()
    } catch (error) {
      console.log(error)
    }
    return
  }
  //Funcion que sirve que cambia la calve "aprove" a "false", esto modifica la db en Firestore y vuelve a recargar el grid.
  const rejectInfringement = async (data) => {
    let dataEdit = { ...data, aprove: false }
    try {
      const docRef = doc(db, `Infraccion/${data.id}`);
      const payload = { ...dataEdit }
      setDoc(docRef, payload)
      setModalAprove(!modalAprove)
      getInfringement()
    } catch (error) {
      console.log(error)
    }
    return
  }

  //DataGrid precisa de un array de columnas para renderizarlas, aqui se arma el array de columnas de la grid Usuarios.
  const columnsUsers = [
    { field: 'avatar', headerName: 'Avatar', width: 70, renderCell: params => <Avatar src={params.row.rol === 'admin' ? avatarAdmin : avatarUser} />, sortable: false, filtrable: false },
    { field: 'nombreUsuario', headerName: 'Nombre', width: 100 },
    { field: 'apellidoUsuario', headerName: 'Apellido', width: 100 },
    { field: 'correo', headerName: 'Email', width: 200 },
    { field: 'rol', headerName: 'Rol', width: 100, type: 'singleSelect', valueOptions: ['admin', 'user'], editable: true },
  ];
  //DataGrid precisa de un array de columnas para renderizarlas, aqui se arma el array de columnas de la grid Infracciones.
  const columnsInfractor = [
    { field: 'aprove', headerName: 'Estado', width: 100, renderCell: params => params.row.aprove ? <BsCheckCircleFill style={{ fontSize: "20px", fill: "green" }} /> : <AiFillCloseCircle style={{ fontSize: "22px", fill: "red" }} /> },
    { field: 'uf', headerName: 'UF', width: 100 },
    { field: 'date', headerName: 'Fecha', width: 100 },
    { field: 'time', headerName: 'Hora', width: 60 },
    { field: 'type', headerName: 'Tipo de Infraccion', width: 200 },
    { field: 'observations', headerName: 'Observaciones', width: 200 },
    { field: 'imageURL', headerName: 'Imagen', width: 100, renderCell: params => params.row.imageURL === "Sin imagen" ? <AiFillFileExcel style={{ fontSize: "20px" }} /> : <BsCardImage style={{ fontSize: "20px", cursor: "pointer" }} /> },
    { field: 'lastname', headerName: 'Apellido', width: 100 },
    { field: 'name', headerName: 'Nombre', width: 100 },
    { field: 'dni', headerName: 'DNI', width: 100 },
    { field: 'carID', headerName: 'Dominio', width: 100 },
  ];


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }} className="dashboard">
      <h2 className='dashboard_title'>Dashboard</h2>
      <div className='dashboard_container_boxes'>
        <Box className='dashboard_box_user'>
          <h4 className='dashboard_title-table'>Control de usuarios</h4>
          <DataGrid
            columns={columnsUsers}
            rows={usersList}
            getRowId={row => row.id}
            getRowSpacing={params => ({
              top: params.isFirstVisible ? 0 : 5,
              bottom: params.isLastVisible ? 0 : 5
            })}
          >
          </DataGrid>
        </Box>
        <Box className='dashboard_box_infringement'>
          <h4 className='dashboard_title-table'>Control de Infracciones</h4>
          <DataGrid
            columns={columnsInfractor}
            rows={infringementList}
            getRowId={row => row.id}
            getRowSpacing={params => ({
              top: params.isFirstVisible ? 0 : 5,
              bottom: params.isLastVisible ? 0 : 5
            })}
            isRowSelectable={(data) => viewData(data.row)}
          >
          </DataGrid>


          <div style={{ display: modalAprove ? "flex" : "none" }} className='modal_aprove'>
            <div className='modal_aprove_header'>
              <h4 className='modal_aprove_title'>Infracción: {dataPreview.tipo}</h4>
              <AiOutlineCloseCircle className='modal_aprove_btn-close' onClick={() => setModalAprove(!modalAprove)} />
            </div>
            <div className='modal_aprove_data-container'>
              <div className='modal_aprove_image-container'>
                {dataPreview.imagen === "Sin imagen" ? <p>Sin imagen</p> : <img className='modal_aprove_image' src={`${dataPreview.imagen}`} />}
              </div>
              <div className='modal_aprove_info'>
                <h3 className='modal_aprove_text'>UF: {dataPreview.uf}</h3>
                <h3 className='modal_aprove_text'>Nombre y Apellido: {dataPreview.fullname}</h3>
                <h3 className='modal_aprove_text'>DNI: {dataPreview.dni}</h3>
                <h3 className='modal_aprove_text'>Dominio: {dataPreview.dominio}</h3>
                <h3 className='modal_aprove_text'>Tipo: {dataPreview.tipo}</h3>
                <h3 className='modal_aprove_text'>Fecha: {dataPreview.fecha}</h3>
                <h3 className='modal_aprove_text'>Hora: {dataPreview.hora}</h3>
                <h3 className='modal_aprove_text'>Observaciones: {dataPreview.observations}</h3>
                <div className='modal_aprove_btn-container'>
                  <button className='modal_aprove_btn-aprove' onClick={() => aproveInfringement(dataSelected)}>Aprobar</button>
                  <button className='modal_aprove_btn-decline' onClick={() => rejectInfringement(dataSelected)}>Rechazar</button>
                </div>
              </div>

            </div>

          </div>
        </Box>
      </div>

    </motion.div>
  )
}

export default Dashboard