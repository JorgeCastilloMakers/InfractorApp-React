import './navbar.scss'
import poliAvatar from '../../../public/policia-avatar.png'


export const Navbar = () => {
  return (
    <nav className='nav'>
        <h2 className='nav_title'>Infractor App</h2><img className='nav_logo' src={`${poliAvatar}`} alt="icon-infractorApp" />
    </nav>
  )
}
