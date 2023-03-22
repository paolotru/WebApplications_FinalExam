import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {MyNavBar} from './Components/MyNavbar.js';
import {MyPage} from './Components/MyPage.js';
import {Container, Row,Alert,Spinner} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import API from './API.js';

function App() {
  const [loggedIn,setLoggedIn]=useState(false);
  const [currA,setCurrA]=useState('');
  const [currAId,setCurrAId]=useState('');
  const [loading,setLoading]=useState(true);
  const [loadingQ,setLoadingQ]=useState(true);
  const [dirty, setDirty] = useState(false);
  const [questionari,setQuestionari]=useState([]);
  const [message, setMessage] = useState('');

  useEffect(()=>{
    const checkAuth = async () => {
      try {
        setLoading(true);
        const uInfo = await API.getUserInfo();
        setCurrAId(uInfo.id);
        setCurrA(uInfo.username);
        setLoggedIn(true);
        setLoading(false);
      } catch(err) {
        console.error(err.error);
        setLoading(false);
      }
    };
    checkAuth();
  },[]);
  useEffect(()=>{
    const getQs = async()=>{
      try{  
        if(!loading){
          if(loggedIn && currAId!==''){
            setLoadingQ(true);
            const qs = await API.fetchQsbyAdmin(currAId);
            setQuestionari(qs);
            setLoadingQ(false);
          }else{
            setLoadingQ(true);
            const qs = await API.fetchQs();
            setQuestionari(qs);
            setLoadingQ(false);
          }
        }
      }catch(err){
        console.error(err.error);
      }
    };
    getQs().then(()=>{setDirty(false);});
  },[loggedIn,dirty,loading,currAId]);

  const doLogin = async (credentials) => {
    try{
      setLoading(true);
      const user = await API.login(credentials);
      console.log(user);
      setLoggedIn(true);
      setCurrA(user.username);
      setCurrAId(user.id);
      setMessage({msg:`Welcome, ${user.username}!`, type: 'success'});
      setLoading(false);
    }catch(err) {
      setMessage({msg: " Incorrect username and/or password", type: 'danger'});
      setLoading(false);
    }
  }
  const doLogout = async () => {
    setLoading(true);
    await API.logOut().then(setMessage({msg: 'Successfully logged out', type: 'success'}));
    setQuestionari([]);
    setCurrAId('');
    setCurrA('');
    setLoggedIn(false);
    setLoading(false);
  }
  return (
    <Router>
      <Container fluid>
        {loading?<Spinner animation="border" />
        :<>
        <Row><MyNavBar loggedIn={loggedIn} doLogin={doLogin} doLogout={doLogout} /></Row>
        {message && <Row className="padAlert">
          <Alert closeLabel="" variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
        </Row> }     
        <Row className={message?"":"padt"}>
          <MyPage isLoading={loading} loadingQ={loadingQ} setDirty={setDirty} currAId={currAId} currA={currA} 
              loggedIn={loggedIn} questionari={questionari}/>
        </Row></>
        }
      </Container>
    </Router>
  );
}

export default App;
