import { createContext, useContext, useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, db } from '../../firebase'
import { collection, doc, getDocs, getDoc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import avatarAdmin from '../../src/assets/avatar-admin.jpg'
import avatarUser from '../../src/assets/avatar-user.jpg'

// Se crea un contexto para el manejo de autenticación en la aplicación
export const authContext = createContext()
// Se crea un hook personalizado para acceder al contexto de autenticación
// Este hook será utilizado en los componentes para acceder al estado de autenticación y las funciones relacionadas
export const useAuth = () => {
  const context = useContext(authContext)
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState()
  const [usersList, setUsersList] = useState([]);
  const [infringementList, setInfringementList] = useState([]);
  const navigate = useNavigate()
  const [storage, setStorage] = useState()

  // Esta función registra un nuevo usuario en Firebase Authentication
  const signUp = async (email, password, userName, userLastName, nameJob, rol) => {
    // Utiliza la función createUserWithEmailAndPassword para crear el nuevo usuario y devolver sus datos
    const newUser = await createUserWithEmailAndPassword(auth, email, password).then((userData) => { return userData })
    // Luego utiliza esos datos para crear un nuevo documento en la colección "Users" de Firestore, utilizando setDoc
    const docRef = doc(db, `Users/${newUser.user.uid}`);
    // Si el rol es "admin", se asigna una imagen de avatar diferente
    let avatarPic = avatarUser;
    if (rol === "admin") {
      avatarPic = avatarAdmin;
    }
    //Se actualiza el usuario creado en la base de datos de Firebase
    setDoc(docRef, { correo: email, nombreUsuario: userName, apellidoUsuario: userLastName, puesto: nameJob, rol: rol, avatar: avatarPic })
  };

  // Función que recibe el UID del usuario y devuelve un objeto con su rol y nombre de usuario
  const getRol = async (uid) => {
    const docRef = doc(db, "Users", `/${uid}`);
    const docSnap = await getDoc(docRef)
    const userRol = docSnap.data().rol;
    const userName = docSnap.data().nombreUsuario
    const userInfo = { rol: userRol, name: userName }
    return userInfo;
  }
  // Esta función obtiene los datos del usuario almacenados en localStorage y los convierte en objeto
  const parseUser = () => {
    const userStorage = localStorage.getItem('userLog');
    const userParse = JSON.parse(userStorage);
    setUserInfo(userParse)
    return userParse
  }

  // Esta función se encarga de realizar el inicio de sesión de un usuario.
  const login = async (userFirebase) => {
    const { email, password } = userFirebase;
    // Utiliza los datos para iniciar sesión con firebase y guardar el uid y correo del usuario en el objeto userData.
    const user = await signInWithEmailAndPassword(auth, email, password);
    let userData = {
      uid: user.user.uid,
      email: user.user.email
    };
    // Luego, se utiliza la función getRol para obtener el rol y nombre de usuario del usuario registrado en la base de datos.
    const userLog = await getRol(userData.uid);
    const { rol, name } = userLog;
    userData = { ...userData, rol: rol, name: name };
    // Finalmente, se actualiza el estado del usuario con los datos obtenidos y se guarda el objeto userData en localStorage.
    localStorage.setItem('userLog', JSON.stringify(userData));
    // También se llama a la función parseUser para actualizar el estado del usuario en el contexto y se redirige al usuario a la página de inicio.
    parseUser()
    navigate('/home');
    setUser(userData)
    // En caso de éxito, devuelve el objeto userData. Si falla, devuelve un error.
    return userData;
  };

  // La función logOut cierra la sesión del usuario actual y elimina la información del usuario del localStorage.
  // También recarga la página para asegurarse de que se actualicen todos los componentes que dependen del estado de autenticación.
  const logOut = () => {
    if (window.confirm('¿Estas seguro que deseas cerrar la sesión?')) {
      signOut(auth)
      setUserInfo(null)
      localStorage.removeItem('userLog');
      navigate('/')
      location.reload()
    }

  };

  useEffect(() => {
    onAuthStateChanged(auth, currentUser => {
      // setUser(currentUser);

      setLoading(false)
    })
  }, [])

  // Esta función hace una consulta a la colección "Infraccion" en la base de datos de Firebase
  // y devuelve una lista de infracciones.
  const getInfringement = async () => {
    // Utiliza la función getDocs para obtener un QuerySnapshot de la colección y luego itera
    // sobre los documentos para obtener los datos de cada infracción y añadirlos a un array.
    const querySnapshot = await getDocs(collection(db, "Infraccion"))
    const docs = [];
    querySnapshot.forEach((doc) => {
      docs.push({ ...doc.data(), id: doc.id });
      // Por último, establece el estado "infringementList" con el array creado, para poder utilizar
      // posteriormente esa información en la aplicación.
      setInfringementList(docs)

    });
  }

  // Esta función utiliza la API de Firebase para acceder a la colección "Users" en la base de datos y recuperar todos los documentos que contiene. 
  const getUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "Users"))
    const docs = [];
    querySnapshot.forEach((doc) => {
      docs.push({ ...doc.data(), id: doc.id });
      //Luego, procesa cada documento, extrayendo sus datos y agregándolos a un array "docs". 
      //Finalmente, se llama al método "setUsersList" para actualizar el estado de la lista de usuarios con los datos obtenidos.
      setUsersList(docs)
    })
  }




  return (
    <authContext.Provider value={{ signUp, login, user, parseUser, logOut, loading, userInfo, getInfringement, getUsers, storage, usersList, infringementList }}>
      {children}
    </authContext.Provider>
  )

}

