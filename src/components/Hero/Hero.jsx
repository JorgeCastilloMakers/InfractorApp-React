import heroImage from '../../assets/cwok_casual_3.png' 
import pulse from '../../assets/pulse-grey.gif' 
import './hero.scss'

export const Hero = ({children}) => {
  return (
    <div className="hero">
          <div className="hero_box">
              <h1 className='hero_box_title'>Bienvenido a Infractor App</h1>
              <div>
                <h2 className='hero_box_subtitle'>Inicia sesión para comenzar a administrar tus infracciones.</h2>
                <p className='hero_box_pharagraph'>Si no tienes cuenta ponte en contacto con el Administrador</p>
              </div>
              <div className='hero_box_image_container'>
                <img className='hero_box_image' src={`${heroImage}`} alt="" />
                  <img className='hero_box_image_effect' src={`${pulse}` } />              
              </div>  

          </div>      
          <div className="hero_box_form">
              {children}
            </div>
    </div>
  )
}


export default Hero