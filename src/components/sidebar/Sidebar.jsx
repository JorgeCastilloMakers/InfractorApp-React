import { AiOutlineHome, AiOutlineUserAdd, AiOutlineDashboard, AiOutlineLogout} from 'react-icons/ai';
import { FiPlusCircle } from 'react-icons/fi';
import { NavLink, useLocation } from 'react-router-dom';
import {useAuth} from '../../context/AuthContext'
import './sidebar.scss'
import { useState, useCallback, useEffect} from 'react'
import { FiLayers } from 'react-icons/fi';

const itemsAdmin = [
  {
    name: 'Home',
    icon: <AiOutlineHome className="sidebar_icon" />,
    path: '/home',
  },
  {
    name: 'Dashboard',
    icon: <AiOutlineDashboard className="sidebar_icon" />,
    path: '/dashboard',
  },
  {
    name: 'Crear infracción',
    icon: <FiPlusCircle className="sidebar_icon" />,
    path: '/add',
  },
  {
    name: 'Crear usuario',
    icon: <AiOutlineUserAdd className="sidebar_icon" />,
    path: '/register',
  },
];

const itemsUser = [
  {
    name: 'Home',
    icon: <AiOutlineHome className="sidebar_icon" />,
    path: '/home',
  },
  {
    name: 'Crear infracción',
    icon: <FiPlusCircle className="sidebar_icon" />,
    path: '/add',
  },
];



export const Sidebar = () => {
  const { logOut, userInfo } = useAuth();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen(prevState => !prevState), []);

  const handleLogOut = async () => {
    await logOut();
  };

  if (location.pathname === '/') {
    return null;
  }
        return (
            <>
                <nav className='sidebar' style={{width: isOpen ? "20%" : "40px"}}>
                <div className='li_bars' >
                      <li className='sidebar_li' style={{paddingLeft: !isOpen ? "10%" : "5%"}} onClick={toggle}><FiLayers className='sidebar_icon'/> <p className='sidebar_li_p' style={{display: isOpen ? "block" : "none"}}>Menú</p></li>
                </div>    
                    { (userInfo.rol === "admin") && itemsAdmin.map((item, index) => (
                        <NavLink to={item.path} key={index} >
                            <li className='sidebar_li' style={{paddingLeft: !isOpen ? "10%" : "5%"}}>{item.icon } <p className='sidebar_li_p' style={{display: isOpen ? "flex" : "none"}}>{item.name}</p></li>
                        </NavLink>
                    
                    ))}
                    
                    {(userInfo.rol === "user") && itemsUser.map((item, index) => (
                        <NavLink to={item.path} key={index} >
                            <li className='sidebar_li' style={{paddingLeft: !isOpen ? "10%" : "5%"}}>{item.icon } <p className='sidebar_li_p' style={{display: isOpen ? "flex" : "none"}}>{item.name}</p></li>

                        </NavLink>
                    ))}

                    <div className='li_logOut'>
                      <li className='sidebar_li' style={{paddingLeft: !isOpen ? "10%" : "5%"}} onClick={handleLogOut}><AiOutlineLogout className='sidebar_icon'/> <p className='sidebar_li_p' style={{display: isOpen ? "flex" : "none"}}>Cerrar sesión</p></li>
                    </div>
                    <p className='sidebar_footer' style={{display: isOpen ? "flex" : "none"}} >Desarrollado por Jorge Castillo</p>
                </nav>
            </>
        )
}
