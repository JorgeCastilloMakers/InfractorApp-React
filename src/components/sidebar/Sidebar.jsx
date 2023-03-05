import { AiOutlineHome, AiOutlineUserAdd, AiOutlineDashboard, AiOutlineLogout } from 'react-icons/ai';
import { FiPlusCircle } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'
import './sidebar.scss'
import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { FiLayers } from 'react-icons/fi';

const icons = {
  home: <AiOutlineHome className="sidebar_icon" />,
  dashboard: <AiOutlineDashboard className="sidebar_icon" />,
  add: <FiPlusCircle className="sidebar_icon" />,
  userAdd: <AiOutlineUserAdd className="sidebar_icon" />,
  logout: <AiOutlineLogout className='sidebar_icon' />,
  layers: <FiLayers className='sidebar_icon' />
};

const itemsAdmin = [
  {
    name: 'Home',
    icon: icons.home,
    path: '/home',
    isActive: false
  },
  {
    name: 'Dashboard',
    icon: icons.dashboard,
    path: '/dashboard',
    isActive: false
  },
  {
    name: 'Crear infracción',
    icon: icons.add,
    path: '/add',
    isActive: false
  },
  {
    name: 'Crear usuario',
    icon: icons.userAdd,
    path: '/register',
    isActive: false
  },
];
const itemsUser = [
  {
    name: 'Home',
    icon: icons.home,
    path: '/home',
    isActive: false
  },
  {
    name: 'Crear infracción',
    icon: icons.add,
    path: '/add',
    isActive: false
  },
];

export const Sidebar = () => {
  const { logOut, userInfo } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => setIsSidebarOpen(prevState => !prevState), []);

  let sidebarRef = useRef(null)

  const handleLogOut = async () => {
    await logOut();
  };

  // Renderiza un elemento de la barra lateral y agrega una clase CSS adicional si isActive es verdadero
  const renderSidebarItem = useCallback((item) => (
    <NavLink to={item.path} key={item.path}>
      <li className={isSidebarOpen ? "sidebar_li" : "sidebar_li sidebar_li_open"}>
        {item.icon}
        <p className={isSidebarOpen ? "sidebar_li_p" : "sidebar_li_p sidebar_li_p_open"}>{item.name}</p>
        {item.isActive && <div className="sidebar_li_active" />}
      </li>
    </NavLink>
  ), [isSidebarOpen]);

  // Use useMemo para memorizar la matriz sidebarItems y evitar re-renders innecesarios.
  // Si el rol del usuario cambia, volvemos a calcular los elementos y la función renderSidebarItem con nuevos items.
  const sidebarItems = useMemo(() => {
    if (userInfo && userInfo.rol === "admin") {
      return itemsAdmin.map(renderSidebarItem);
    } else if (userInfo && userInfo.rol === "user") {
      return itemsUser.map(renderSidebarItem);
    } else {
      return [];
    }
  }, [userInfo, renderSidebarItem]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleSidebar, sidebarRef]);


  return (userInfo &&
    <nav className={isSidebarOpen ? "sidebar" : "sidebar open"} ref={sidebarRef}>
      <div className='li_bars' >
        <li className={isSidebarOpen ? "sidebar_li" : "sidebar_li sidebar_li_open"} onClick={toggleSidebar}>{icons.layers}<p className={isSidebarOpen ? "sidebar_li_p" : "sidebar_li_p sidebar_li_p_open"}>Menú</p></li>
      </div>
      {(userInfo.rol === "admin") && itemsAdmin.map((item, index) => renderSidebarItem(item, index))}
      {(userInfo.rol === "user") && itemsUser.map((item, index) => renderSidebarItem(item, index))}

      <div className='li_logOut'>
        <li className={isSidebarOpen ? "sidebar_li" : "sidebar_li sidebar_li_open"} onClick={handleLogOut}>{icons.logout} <p className={isSidebarOpen ? "sidebar_li_p" : "sidebar_li_p sidebar_li_p_open"} >Cerrar sesión</p></li>
      </div>
      <p className={isSidebarOpen ? "sidebar_footer" : "sidebar_footer sidebar_footer_open"} >Desarrollado por Jorge Castillo</p>
    </nav>
  )
}
