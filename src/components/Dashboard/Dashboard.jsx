import './dashboard.scss'
import { Box, Avatar } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useAuth } from '../../context/AuthContext'
import { useEffect, useMemo } from 'react'
import { BsCardImage, BsCheckCircleFill } from "react-icons/bs";
import { useState } from 'react'
import { AiOutlineCloseCircle, AiFillCloseCircle, AiFillFileExcel } from "react-icons/ai";
import { motion } from 'framer-motion'



export const Dashboard = () => {

  const { getUsers, usersList, getInfringement, infringementList } = useAuth();

  const [modalOpen, setModalOpen] = useState(false)
  const [modalAprove, setModalAprove] = useState(false)
  const [imagePreview, setImagePreview] = useState()
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

  useEffect(() => {
    getUsers()
  }, [])

  useEffect(() => {
    getInfringement()
  }, [])

  const viewImage = (image) => {
    setImagePreview(image)
    setModalOpen(!modalOpen)
  }

  const viewData = (data) => {

    let { carID, date, dni, id, imageURL, lastname, name, observations, time, type, uf } = data;
    let dataToSend = { ...dataPreview, dni: dni, dominio: carID, fecha: date, fullname: name + " " + lastname, hora: time, tipo: type, uf: uf, imagen: imageURL, observations: observations };
    setDataPreview(dataToSend)
    setModalAprove(!modalAprove)
  }

  const columnsUsers = useMemo(() => [
    { field: 'avatar', headerName: 'Avatar', width: 70, renderCell: params => <Avatar src={params.row.avatar} />, sortable: false, filtrable: false },
    { field: 'nombreUsuario', headerName: 'Nombre', width: 100 },
    { field: 'apellidoUsuario', headerName: 'Apellido', width: 100 },
    { field: 'correo', headerName: 'Email', width: 200 },
    { field: 'rol', headerName: 'Rol', width: 100, type: 'singleSelect', valueOptions: ['admin', 'user'], editable: true },
  ], [])

  const columnsInfractor = useMemo(() => [
    { field: 'aprove', headerName: 'Estado', width: 100, renderCell: params => params.row.aprove ? <BsCheckCircleFill style={{ fontSize: "20px" }} /> : <AiFillCloseCircle style={{ fontSize: "20px", textAlign: "center" }} /> },
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
  ], [])

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
          <div style={{ display: modalOpen ? "flex" : "none" }} className='modal'>
            <div className='modal_header'>
              <h4 className='modal_title'>Imagen</h4>
              <AiOutlineCloseCircle className='modal_btn-close' onClick={() => setModalOpen(!modalOpen)} />
            </div>
            <div className='modal_image-container'>
              <img className='modal_image' src={`${imagePreview}`} />
            </div>
          </div>
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
                  <button className='modal_aprove_btn-aprove'>Aprobar</button>
                  <button className='modal_aprove_btn-decline' onClick={() => setModalAprove(!modalAprove)}>Rechazar</button>
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