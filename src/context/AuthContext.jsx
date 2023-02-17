import { createContext, useContext, useState, useEffect} from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut} from 'firebase/auth'
import {auth, db} from '../../firebase'
import { collection, doc, getDocs, getDoc, setDoc} from 'firebase/firestore'
import {useNavigate} from 'react-router-dom'
import avatarAdmin from '../../public/avatar-admin.jpg'
import avatarUser from '../../public/avatar-user.jpg'


export const authContext = createContext()

export const useAuth = () =>{
    const context = useContext(authContext)
    return context;
}

export function AuthProvider ({children}) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [userInfo, setUserInfo] = useState(null)
    const [usersList, setUsersList] = useState([]);
    const [infringementList, setInfringementList] = useState([]);
    const navigate = useNavigate()
    const [storage, setStorage] = useState()
    const [userSession, setUserSession] = useState(null);

    
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
    
    
    const login = async (userFirebase) => {
      const {email, password} = userFirebase
      const userLog = await signInWithEmailAndPassword(auth, email, password);
          let userData = {
            uid: userLog.user.uid,
            email:userLog.user.email
            };
      getRol(userData.uid).then((userLog) => {
        const { rol, name } = userLog
        userData = { ...userData, rol: rol, name: name }
        sessionStorage.setItem('userLog', JSON.stringify(userData))
        setUserInfo(sessionStorage.getItem('userLog'))
        setUserSession(sessionStorage.getItem('userLog'))
        return userInfo
      });

          navigate('/home')
    };

  
  
    const logOut = () => {
      if (window.confirm('¿Estas seguro que deseas cerrar la sesión?')){
      signOut(auth)
      setUserInfo(null)
      sessionStorage.removeItem('userLog'); 
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
       <authContext.Provider value={{signUp, login, user, logOut, userSession, loading, userInfo, getInfringement, getUsers, storage, usersList, infringementList}}>
        {children}
       </authContext.Provider> 
    )

}  

