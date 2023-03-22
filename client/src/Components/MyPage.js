import { useState,useEffect } from 'react';
import {MyCardDeck} from './MyCard.js';
import validator from 'validator';
import { Switch, useHistory,Route,Redirect, useRouteMatch} from 'react-router-dom';
import {Button,Container,Spinner} from 'react-bootstrap';
import {MyModal} from './MyModals.js';
import { CompilaQ,CreaQ,VisualizzaQ } from './q.js';
import API from '../API.js';


function MyPage(props){
    const match = useRouteMatch('/VisualizzaQuestionario/:id');
    const activeQ = (match && match.params && match.params.id) ? match.params.id : undefined;
    const history = useHistory();
    const[showU,setShowU]=useState(false);
    const[u,setU]=useState('');
    const[utenti,setUtenti]=useState([]);
    const[qsel,setQsel]=useState();      
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(()=>{
        const getQ = async()=>{
          try{
              if(activeQ!==undefined){
                const q = await API.fetchQbyId(activeQ);
                handleQsel(q[0],true);
              }       
          }catch(err){
            console.error(err.error);
          }
        };
        getQ();
      },[]);

    const handleShowU = () => setShowU(true);
    const handleCloseU = ()=>{setShowU(false);setErrorMessage('');};
    const handleQsel = async (q,admin)=>{
        q.setQ();
        setQsel(q);
        if(admin){
            const x=await API.fetchUcompilazioni(q.id);
            setUtenti(x);
            history.push('/VisualizzaQuestionario/'+q.id);
        }
    }
    let valid=false;
    function validateU(username){
        if(validator.isEmpty(username)){
            setErrorMessage('Username Required');
            return false;
        }
        return true;
    }
    const handleSubmitClose=(event)=>{
        event.preventDefault();
        valid=validateU(u);
        if(valid){
            handleCloseU();
            history.push("/Questionario/"+qsel.id); 
        }else{
            setU('');
        }
    }
    return(<>
        <Switch>
            <Route path="/Questionario/" render={()=>
                (u=='' || props.loggedIn ? <Redirect to="/" />:
                <CompilaQ q={qsel} user={u}></CompilaQ>)
            }/>
            <Route path="/Creazionequestionario" render={()=><>
                {!props.loggedIn ? 
                    (props.isLoading?"Loading":<Redirect to="/" />):
                    <CreaQ currA={props.currA} currAId={props.currAId} setDirty={props.setDirty}/>
                }</>
            }/>
            <Route path="/VisualizzaQuestionario/:id" render={()=><>
                {!props.loggedIn ? 
                    (props.isLoading?"Loading":<Redirect to="/" />)
                :
                    (qsel===undefined?
                        <Spinner className="underDeck" animation="border" />:
                        <VisualizzaQ utenti={utenti} q={qsel}/>)
                }</>
            }/>
            <Route render={()=><>
                {(props.loadingQ || props.isLoading)?<Spinner className="underDeck" animation="border" />
                :
                props.loggedIn?<>
                <h2>Benvenuto {props.currA}, ecco i tuoi questionari:</h2>
                <MyCardDeck questionari={props.questionari} loggedIn={props.loggedIn} handleQsel={handleQsel}/>
                <Container fluid className="underDeck"><Button variant="success" href="/Creazionequestionario" >Crea nuovo questionario</Button></Container>
                </>:<>
                <MyCardDeck questionari={props.questionari} handleShowU={handleShowU} errorMessage={errorMessage} showU={showU} 
                    setU={setU} handleCloseU={handleCloseU} handleQsel={handleQsel}/>
                <MyModal err={errorMessage} user={true} show={showU} setU={setU} handleClose={handleCloseU} handleSubmit={handleSubmitClose}/></>
            }
            </>}/>
        </Switch></>
    );
}

export {MyPage}