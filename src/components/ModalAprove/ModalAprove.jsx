import './modalAprove.scss'
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useState, useRef } from 'react'
import { PdfPrint } from '../PdfPrint/PdfPrint';
import { useReactToPrint } from 'react-to-print'


export const ModalAprove = (props) => {
    const { dataPreview, modalAprove, setModalAprove, aproveInfringement, rejectInfringement, dataSelected } = props;
    const [verPdf, setVerPdf] = useState(false)


    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'emp-data',
        onAfterPrint: () => alert("Print success")
    });





    return (
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
                        {dataPreview.aprove && <button className='modal_aprove_btn-pdf' onClick={handlePrint}>Imprimir</button>}
                        <button className='modal_aprove_btn-decline' onClick={() => rejectInfringement(dataSelected)}>Rechazar</button>
                    </div>
                </div>
            </div>
            <div style={{ display: "none" }}>
                <PdfPrint componentRef={componentRef} dataPreview={dataPreview}></PdfPrint>
            </div>


        </div>

    );
}


export default ModalAprove;