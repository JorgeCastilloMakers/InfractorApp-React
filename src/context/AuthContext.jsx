import { createContext, useContext, useState, useEffect} from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut} from 'firebase/auth'
import {auth, db} from '../../firebase'
import { collection, doc, getDocs, getDoc, setDoc} from 'firebase/firestore'
import {useNavigate} from 'react-router-dom'
import avatarAdmin from '../assets/avatar-admin.jpg'
import avatarUser from '../assets/avatar-user.jpg'


export const authContext = createContext()

export const useAuth = () =>{
    const context = useContext(authContext)
    return context;
}

export function AuthProvider ({children}) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [userInfo, setUserInfo] = useState()
    const [usersList, setUsersList] = useState([]);
    const [infringementList, setInfringementList] = useState([]);
    const navigate = useNavigate()
    const [storage, setStorage] = useState()

    
    const signUp = async (email, password, userName, userLastName, nameJob, rol) => {
      const newUser = await createUserWithEmailAndPassword(auth, email, password).then((userData) => {return userData})
      const docRef = doc(db, `Users/${newUser.user.uid}`);
      let avatarPic = avatarUser;
      if(rol === "admin"){
        avatarPic = avatarAdmin;
      }
      setDoc(docRef, {correo: email, nombreUsuario: userName, apellidoUsuario: userLastName, puesto: nameJob, rol: rol, avatar: avatarPic })
    };

    const getRol = async (uid) =>{
      const docRef = doc(db, "Users", `/${uid}`);
      const docSnap = await getDoc(docRef)
      const userRol = docSnap.data().rol;
      const userName = docSnap.data().nombreUsuario
      const userInfo = {rol: userRol, name: userName}
      return userInfo;
    }
  const parseUser = () => {
    const userStorage = localStorage.getItem('userLog');
    const userParse = JSON.parse(userStorage);
    setUserInfo(userParse)
    return userParse
  }
  

  const login = async (userFirebase) => {
  const {email, password} = userFirebase;
  const user = await signInWithEmailAndPassword(auth, email, password);
  let userData = {
    uid: user.user.uid,
    email:user.user.email
  };
  const userLog = await getRol(userData.uid);
  const { rol, name } = userLog;
  userData = { ...userData, rol: rol, name: name };
  localStorage.setItem('userLog', JSON.stringify(userData));
    parseUser()
    navigate('/home');
  };

    const logOut = () => {
      if (window.confirm('¿Estas seguro que deseas cerrar la sesión?')){
      signOut(auth)
      setUserInfo(null)
        localStorage.removeItem('userLog'); 
        navigate('/')
      location.reload()   
      }

    };
    
    useEffect(() => {
      onAuthStateChanged(auth, currentUser => {
        setUser(currentUser);
        setLoading(false)
      })
    }, [])

    const getInfringement =  async () =>{
     const querySnapshot = await getDocs(collection(db, "Infraccion"))
     const docs = [];
     querySnapshot.forEach((doc) => {
      docs.push({...doc.data(), id: doc.id});
      setInfringementList(docs)

      });
    }
    const getUsers =  async () =>{
     const querySnapshot = await getDocs(collection(db, "Users"))
     const docs = [];
     querySnapshot.forEach((doc) => {
      docs.push({...doc.data(), id: doc.id});
      setUsersList(docs)

    })}
        

    
    return(
       <authContext.Provider value={{signUp, login, user, parseUser, logOut, loading, userInfo, getInfringement, getUsers, storage, usersList, infringementList}}>
        {children}
       </authContext.Provider> 
    )

}  

