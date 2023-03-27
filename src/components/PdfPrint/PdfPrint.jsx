import './pdfPrint.scss'
import policiaIcon from '../../assets/policia-avatar.png'




export const PdfPrint = (props) => {
    const { dataPreview, componentRef } = props;

    return (
        <div ref={componentRef} className='pdf_print'>
            <div className='pdf_print_header'>
                <h2 className='pdf_print_title'>INFRACTOR APP</h2>
                <img className='pdf_print_logo' src={`${policiaIcon}`} alt="infractor-app-logo" />
            </div>
            <div className='pdf_print_data-container'>
                <div className='pdf_print_image-container'>
                    {dataPreview.imagen === "Sin imagen" ? <p>Sin imagen</p> : <img className='pdf_print_image' src={`${dataPreview.imagen}`} />}
                </div>
                <div className='pdf_print_info'>
                    <h3 className='pdf_print_text'>UF: {dataPreview.uf}</h3>
                    <h3 className='pdf_print_text'>Nombre y Apellido: {dataPreview.fullname}</h3>
                    <h3 className='pdf_print_text'>DNI: {dataPreview.dni}</h3>
                    <h3 className='pdf_print_text'>Dominio: {dataPreview.dominio}</h3>
                    <h3 className='pdf_print_text'>Tipo: {dataPreview.tipo}</h3>
                    <h3 className='pdf_print_text'>Fecha: {dataPreview.fecha}</h3>
                    <h3 className='pdf_print_text'>Hora: {dataPreview.hora}</h3>
                    <h3 className='pdf_print_text'>Observaciones: {dataPreview.observations}</h3>
                </div>
            </div>
            <div className='pdf_print_footer'>
                <h2 className='pdf_print_text'>Desarrollado por Jorge Castillo</h2>
            </div>


        </div>


    )
}

export default PdfPrint;