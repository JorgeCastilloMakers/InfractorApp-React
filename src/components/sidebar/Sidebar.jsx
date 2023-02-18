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
                <nav className={isOpen ? "sidebar" : "sidebar open"}>
                <div className='li_bars' >
                      <li className={isOpen ? "sidebar_li" : "sidebar_li sidebar_li_open"} onClick={toggle}><FiLayers className='sidebar_icon'/> <p className={isOpen ? "sidebar_li_p" : "sidebar_li_p sidebar_li_p_open"}>Menú</p></li>
                </div>    
                    { (userInfo.rol === "admin") && itemsAdmin.map((item, index) => (
                        <NavLink to={item.path} key={index} >
                            <li className={isOpen ? "sidebar_li" : "sidebar_li sidebar_li_open"} >{item.icon } <p className={isOpen ? "sidebar_li_p" : "sidebar_li_p sidebar_li_p_open"} >{item.name}</p></li>
                        </NavLink>
                    
                    ))}
                    
                    {(userInfo.rol === "user") && itemsUser.map((item, index) => (
                        <NavLink to={item.path} key={index} >
                            <li className={isOpen ? "sidebar_li" : "sidebar_li sidebar_li_open"} >{item.icon } <p className={isOpen ? "sidebar_li_p" : "sidebar_li_p sidebar_li_p_open"} >{item.name}</p></li>

                        </NavLink>
                    ))}

                    <div className='li_logOut'>
                      <li className={isOpen ? "sidebar_li" : "sidebar_li sidebar_li_open"} onClick={handleLogOut}><AiOutlineLogout className='sidebar_icon'/> <p className={isOpen ? "sidebar_li_p" : "sidebar_li_p sidebar_li_p_open"} >Cerrar sesión</p></li>
                    </div>
                    <p className={isOpen ? "sidebar_footer" : "sidebar_footer sidebar_footer_open"} >Desarrollado por Jorge Castillo</p>
                </nav>
            </>
        )
}
