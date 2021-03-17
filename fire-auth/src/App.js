import './App.css';
import  firebase from 'firebase';
import "firebase/auth";
import firebaseConfig from "./firebase.config";
import {useState} from "react";

if (!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}else{
  firebase.app();
}

const updateUserName = name => {
  const user = firebase.auth().currentUser;

user.updateProfile({
  displayName: name

}).then(function() {
  console.log("Username updated successfully");
}).catch(function(error) {
  // An error happened.
  console.log(error)
});
}


function App() {
  const [newUser,setNewUser] = useState(false);
const [user,setUser] = useState({
  isSignIn : false,
  name:'',
  email:'',
  password:'',
  photo:'',
  success:false,
})

  const provider = new firebase.auth.GoogleAuthProvider();
  const facebookProvider = new firebase.auth.FacebookAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then((res) =>{
      const{displayName, photoURL, email} = res.user;
      console.log(displayName,photoURL, email);

      const isSignedInUser ={
        isSignIn: true,
        name:displayName,
        email:email,
        photo:photoURL

      }
      setUser(isSignedInUser);
        
    })
    .catch((err) => {
      console.log(err);
      console.log(err.message);
    })
  }

  const handleFbSignIn = ()=> {
  firebase
  .auth()
  .signInWithPopup(facebookProvider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // The signed-in user info.
    var user = result.user;
    console.log("Facebook user=",user);
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var accessToken = credential.accessToken;

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    // ...
  });
  }


  const handleSignOut = () => {
    console.log("SignOut clicked");
    firebase.auth().signOut()
    .then(response => {
      const signedOutUser = {
        isSignIn:false,
        name:'',
        email:''
      }
      setUser(signedOutUser);
    }).catch((err) => {
      console.log(err);
    })
  }

  //handle submit
  const handleSubmit =(e)=>{
    console.log(user.email,user.password);

    //sign up
    if(newUser && user.email && user.password){
      //firebase documentation password authentication
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then((userCredential) => {
    // Signed in 
    const newUserInfo = {...user};
    newUserInfo.error = '';
    newUserInfo.success = true;
    setUser(newUserInfo);
    updateUserName(user.name);
    })
    .catch((error) => {
    // var errorCode = error.code;
    // var errorMessage = error.message;
    //
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success =false;
    setUser(newUserInfo);
    console.log(error.code,error.message);
    });
    }

    // Signed in
    if(!newUser && user.email && user.password){
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then((userCredential) => {
    
    const newUserInfo = {...user};
    newUserInfo.error = '';
    newUserInfo.success = true;
    setUser(newUserInfo);
   console.log("UserInfo=",newUserInfo);
  })
  .catch((error) => {
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success =false;
    setUser(newUserInfo);
  });
    }//signin if ends here
    e.preventDefault();
  }

  const handleChange = (event) => {
    //console.log(event.target.name,event.target.value);
  }

  const handleBlur =(e)=>{
    //console.log(e.target.name,e.target.value);
    let isFormValid;
    if(e.target.name === 'email'){
      isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
      //const isEmailValid = /\S+@\S+\.\S+/.test(e.target.value); //Javascript email validation/js regex
      //console.log(isEmailValid); 
    }
    if(e.target.name === 'password'){
      const isPasswordValid = e.target.value.length >6;
      const passwordHasNumber = /\d{1}/.test(e.target.value); //regular expression check one or more number
      isFormValid = (isPasswordValid && passwordHasNumber);
    }

    if(e.target.name ==='name'){
      isFormValid = (e.target.value);
    }

    if(isFormValid){
      const newUserInfo = {...user}; //copying user object in newUserInfo
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }

  return (
   
      

    <div className="App">
       {
        user.isSignIn ? <button onClick={handleSignOut}>Sign Out</button>:
        <button onClick={handleSignIn}>Sign in with Google</button> 
        
      }
      <br/>
      <button onClick={handleFbSignIn}>Sign in with Facebook</button>
      
      {
        user.isSignIn && <p>Welcome {user.name}</p>
      }

      <h1>This is a Form/My own Authentication</h1>

      <input type="checkbox" onChange={()=>setNewUser(!newUser)} name="newUser"></input>
      <label htmlFor="newUser">New User Signup</label>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Password: {user.password}</p>

      <form onSubmit={handleSubmit}>
        <h2>Signup form</h2>
        {newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Your name" required />}
        <br/>
        <input type="text" name="email" onChange={handleChange} onBlur={handleBlur} placeholder="Your Email Address" required/>
        <br/>
        <input type="password" name="password" onChange={handleChange} onBlur={handleBlur} placeholder="Enter your password" required/>
        <br/>
        <input type="submit" value="submit"/>
        </form>

        <p style={{color:'red'}}>{user.error}</p>
        {
          user.success && <p style={{color:'green'}}>User {newUser?'Registered':'Logged in'}  successfully</p>
        }
        
    </div>
  );
}

export default App;
