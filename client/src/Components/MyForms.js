import { useState } from 'react';
import {Form,Button,Alert,Row,Container} from 'react-bootstrap';
import {D} from './oggetti.js';
function MyFormU(props){
  return(
    <Form className="text-center">
      {props.err ? <Alert variant='danger'>{props.err}</Alert> : ''}
      <Form.Label>Per compilare il questionario è necessario scegliere un nome utente:</Form.Label>      
      <Form.Control placeholder="Inserire un username" onChange={event => props.setU(event.target.value)} />
    </Form>
  )
}

function LoginForm(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('') ;
    
    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        const credentials = { username, password };
        let valid = true;
        if(username === '' || password === '' || password.length < 6)
            valid = false;
        if(valid){
          props.login(credentials);
          props.handleClose();
        }
        else
          setErrorMessage('Error(s) in the form, please fix it.');
    };
    return (
      <Form>
        {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
        <Form.Group controlId='username'>
            <Form.Label>Username</Form.Label>
            <Form.Control type='username' value={username} onChange={ev => setUsername(ev.target.value)} />
        </Form.Group>
        <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
        </Form.Group>
        <Form.Group className="padform">
          <Button variant="secondary" onClick={props.handleClose}>Chiudi</Button>
          <Button style={{float:'right'}} onClick={handleSubmit}>Login</Button>
        </Form.Group>
    </Form>
    );
  }

function NameForm(props){
  const [name,setName]=useState('');
  const [errorMessage, setErrorMessage] = useState('') ;
  const handleSubmit=(event)=>{
    event.preventDefault();
    let valid = true;
    if(name === '')
        valid = false;
    if(valid){
      props.setName(name);
    }else {
      setErrorMessage('Nome questionario necessario.')
    }
  }
  return(
    <Container fluid className="compQ">  
      <Form >
        {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
        <Form.Group>
            <h4>Scegliere il nome del questionario:</h4>
            <Form.Control as="textarea" style={{width:'100%'}} maxLength="50" 
                onChange={event=>setName(event.target.value)}/>   
            <Container fluid className="nameQ-b"><Button variant="success" onClick={handleSubmit}>Conferma</Button></Container>
        </Form.Group>
      </Form>
    </Container>
  );
}

function OpenQForm(props){
  const [errorMessage, setErrorMessage] = useState('') ;
  const [text,setText]=useState('');
  const [facoltativa,setFacoltativa]=useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');
    let valid = true;
    if(text === '')
        valid = false;
    if(valid){
      props.aggiuntaD(new D(null,text,props.qId,0,facoltativa?0:1,null,props.nds));
      props.handleClose();
    }
    else
      setErrorMessage('Testo Domanda necessario');
  };
  return (
    <Form>
      {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
      <Form.Group controlId='text'>
          <Form.Label>Testo</Form.Label>
          <Form.Control type='username' value={text} onChange={ev => setText(ev.target.value)} />
      </Form.Group>
      <Form.Group controlId='text'>
        <Form.Check type="checkbox"  label="Domanda Facoltativa" onChange={event => setFacoltativa(event.target.value)}/>
      </Form.Group>
      <Form.Group className="padform">
        <Button variant="secondary" onClick={props.handleClose}>Annulla</Button>
        <Button style={{float:'right'}} onClick={handleSubmit}>Conferma</Button>
      </Form.Group>
  </Form>
  );
}

function CloseQForm(props){
  const [errorMessage, setErrorMessage] = useState('') ;
  const [text,setText]=useState('');
  const [facoltativa,setFacoltativa]=useState(1);
  const [maxrisp,setMaxrisp]=useState(1);
  const [rs,setRs]=useState([]);
  const [nrs,setNrs]=useState(0);
  const [tmp,setTmp]=useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');
    let valid = true;
    if(text === '' || nrs==0 || maxrisp>nrs || facoltativa > maxrisp)
        valid = false;
    if(valid){
      let x=new D(null,text,props.qId,1,facoltativa,maxrisp,props.nds);
      x.possibilirisp=rs;
      props.aggiuntaD(x);
      props.handleClose();
    }
    else
      setErrorMessage("Errore nell'inserimento, controllare i dati");
  };
  const handleR=()=>{
    setRs((old)=>{return [...old,tmp];});
    setTmp('');
    setNrs((old)=>old+1)
   }                     //TODO UPDATE MAX RISP
  return (
    <Form>
      {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
      <Form.Group controlId='text'>
        <Form.Label>Testo</Form.Label>
        <Form.Control type='text' value={text} onChange={ev => setText(ev.target.value)} />
      </Form.Group>
      <Form.Group controlId='text'>
        <Form.Check type="checkbox"  label="Domanda Facoltativa" checked={facoltativa==0} onChange={event => setFacoltativa(event.target.checked==true?0:1)}/>
        <Form.Label>Numero massimo risposte:</Form.Label>
        <Form.Control type='text' value={maxrisp} onChange={ev => setMaxrisp(ev.target.value)} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Numero minimo risposte:</Form.Label>
        <Form.Control type='text' value={facoltativa} onChange={ev => setFacoltativa(ev.target.value)}/>
      </Form.Group>
      {nrs>0 && 
      <Container fluid className="formMR">
      <h6>Possibili risposte:</h6>
        {rs.map(x=>
         <Row key={x}>{x}</Row>
        )}
          </Container>
      }
      {nrs<10 && <Form.Group controlId='x'>
          <Form.Label>Aggiungi:</Form.Label>
          <Form.Control type='text' value={tmp} onChange={ev => setTmp(ev.target.value)} />
          <Button variant="light" onClick={handleR}>Aggiungi</Button>
      </Form.Group>}
      <Form.Group className="padform">
        <Button variant="secondary" onClick={props.handleClose}>Annulla</Button>
        <Button style={{float:'right'}} onClick={handleSubmit}>Conferma</Button>
      </Form.Group>
    </Form>
  );
}
  
export {NameForm,LoginForm,MyFormU,OpenQForm,CloseQForm};