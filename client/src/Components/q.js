import {Form,Container,FormGroup,Row,Button,Table,Alert,Dropdown,DropdownButton,Spinner} from 'react-bootstrap';
import { useHistory} from 'react-router-dom';
import {del,arrowup,arrowdown,arrowLeft,arrowRight} from './icons';
import { useState } from 'react';
import {D,R,Q} from './oggetti.js';
import API from '../API.js';
import {MyDomandeModal} from './MyModals.js';
import {NameForm} from './MyForms.js';


function CompilaQ(props){
    const [nsel,setNsel]=useState([]);
    const [risp,setRisp]=useState([]);
    const history = useHistory();
    const [errorMessage, setErrorMessage] = useState('');
    const handleSubmit = () =>{
        let valid = true;                   // TO DO END VALIDATION
        props.q.domande.filter(x=>x.min>0).forEach(d=>{
            if(d.close){
                if(risp.filter(r=>r.dId == d.id).length < d.min)
                    valid=false;
            }else{
                if(risp.find(r=>r.dId == d.id)==undefined)
                    valid=false;
            }
        })
        if(valid){
            risp.forEach(r => API.fetchAddR(r));
            API.fetchAddCompilazione(props.user,props.q.id);
            API.fetchAddCompilazioneQ(props.q.id);
            history.push('/');
        }else{
            setErrorMessage('Inserire tutte le domande non facoltative.');
        }
    }
    const handleCheckboxChange=(event,t,d) =>{
        if(nsel[d.id]===undefined)
            setNsel((old)=>{
                let list =[...old];
                list[d.id]=0;
                return list;
            })
        setNsel((old) => {
            let v = [...old];
            v[d.id] += event.target.checked?1:-1;
            return v;
        });
        if(event.target.checked){
            const tmp=new R(null,t,d.qId,d.id,props.user);
            setRisp((old)=>{
                return [...old,tmp];
            });
        }else{
            setRisp((old)=>{
                const tmp = old.filter(a=>a.text!=t);
                return tmp;
            });
        }
    }
    const handleTextIns=(event,d) => {
        if(risp.find(t=>t.dId==d.id)){
            if(event.target.value=="")
                setRisp((old)=>{
                    const tmp = old.filter(r=>r.dId!=d.id);
                    return tmp;
                })
            else
                setRisp((old)=>{
                    return old.map(a=>{
                        if(a.dId==d.id)
                            return new R(null,event.target.value,a.qId,a.dId,a.user);
                        else
                            return a;
                    });
                });
        }
        else{
            const tmp=new R(null,event.target.value,d.qId,d.id,props.user);
            setRisp((old)=>{return [...old,tmp]});
        }       
    }
    return(
    <Container fluid >
        {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
        <h1 className="compQ">Compilazione questionario: {props.q.name}</h1>
        <Form className="compQ">
        {props.q.domande.map((d) => 
            <Row style={{width:'60%'}} key={d.id} id={d.id}>
                <FormGroup className="padform">
                    <Form.Label><h4>-D: {d.text}</h4></Form.Label>
                    {d.close ?
                        <>{d.possibilirisp.map((t)=>
                            <Form.Check type="checkbox" id={t} key={t} label={t} onChange={event=>handleCheckboxChange(event,t,d)}
                                disabled={nsel[d.id]===undefined?false:(nsel[d.id]==d.max && (risp.find(ris=>ris.text==t)==undefined))}/>
                        )}
                        <Form.Text className="text-muted">Massimo {d.max} risposte selezionabili - {d.min==0?"Domanda facoltativa":`Selezionare almeno ${d.min} risposte`}</Form.Text></>
                        :<>
                        <Form.Control style={{width:'100%'}} as="textarea" maxLength="200" rows={3} onChange={event=>handleTextIns(event,d)}></Form.Control>
                        <Form.Text className="text-muted">{d.min==0?"Domanda facoltativa":"Domanda obbligatoria"}</Form.Text></>
                    }
                </FormGroup>
            </Row>
            )
        }        
        </Form>
        <Row className="compQ-b"><Button variant="primary" style={{width:'auto'}}  onClick={()=>handleSubmit()}>Conferma e invia risposte</Button></Row>
    </Container>);
}

function CreaQ(props){
    const [errorMessage, setErrorMessage] = useState('');
    const [showO,setShowO]=useState(false);
    const [showC,setShowC]=useState(false);
    const handleShowO = () => setShowO(true);
    const handleCloseO = ()=>setShowO(false);
    const handleShowC = () => setShowC(true);
    const handleCloseC = ()=>setShowC(false);
    const [name,setName]=useState('');
    const [ds,setDs]=useState([]);
    const [nds,setNDs]=useState(0);
    const history = useHistory();
    const handleSubmit=(event) => {
        event.preventDefault();
        setErrorMessage('');
        let valid = true;
        if(nds==0)
            valid = false;
        if(valid){
            const q = new Q(null,name,props.currAId,props.currA,0);
            q.domande=[...ds];
            API.creazioneQ(q);
            props.setDirty(true);
            history.push("/");
        }else
            setErrorMessage('Necessaria almeno una domanda');
    }
    const aggiuntaD =(d)=>{
        setDs((old)=>{return [...old,d]});
        setNDs((old)=>old+1);
    }
    const rimozioneD = (d)=>{
        setDs(oDs => {
            return oDs.filter(x=>x.ordine!=d.ordine)
                    .map(x => {
                        if(x.ordine<d.ordine)
                            return x;
                        else
                            return new D(x.id,x.text,x.qId,x.close,x.min,x.max,x.ordine-1);
                    });
        });
        setNDs((old)=>old-1);
    }
    const scambiaD=(d,mod)=>{
        let tmp = ds.filter(x=>x.ordine==d.ordine)[0];
        const d1 = new D(null,tmp.text,tmp.qId,tmp.close,tmp.min,tmp.max,tmp.ordine+mod);
        d1.possibilirisp=tmp.possibilirisp;
        tmp = ds.filter(x=>x.ordine==d.ordine+mod)[0];
        const d2 = new D(null,tmp.text,tmp.qId,tmp.close,tmp.min,tmp.max,tmp.ordine-mod);
        d2.possibilirisp=tmp.possibilirisp;
        setDs((old)=> old.filter(x=>(x.ordine!=d.ordine && x.ordine!=d.ordine+mod)));
        setDs((old)=>{return [...old,d1,d2]});
    }
    return(
        <Container fluid>
            {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
            {name==""?
                <NameForm setName={setName}/>
                :<>
                <Container fluid className="creaQ-h"><h2>Creazione: {name}</h2></Container>
                <Container className="creaQ-t"><Table striped bordered>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Testo domanda</th>
                        <th>Aperta/Chiusa</th>
                        <th>Facoltativa</th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {nds==0? 
                            <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            </tr>
                        :
                        ds.sort((a,b)=>(a.ordine>b.ordine)?1:-1).map(x=>
                                <TableRow key={x.ordine} x={x} scambiaD={scambiaD} rimozioneD={rimozioneD} nds={nds}/>
                            )
                        }
                    </tbody>
                </Table></Container>
                <Container fluid className="creaQ-aB">
                    <Button variant="info" onClick={handleShowC}>Aggiungi una domanda a risposta chiusa</Button>
                    <Button variant="info" onClick={handleShowO}>Aggiungi una domanda a risposta aperta</Button>
                    <MyDomandeModal close={true} show={showC} handleClose={handleCloseC} nds={nds} aggiuntaD={aggiuntaD}></MyDomandeModal>
                    <MyDomandeModal close={false} show={showO} handleClose={handleCloseO} nds={nds} aggiuntaD={aggiuntaD}></MyDomandeModal>
                </Container>
                <Container fluid className="creaQ-cB">
                    <Button variant="success" onClick={handleSubmit}>Conferma e pubblica</Button>
                </Container>
                </>
                }
        </Container>
    );
}

function TableRow(props){
    return(
        <tr>
            <td>{props.x.ordine}</td>
            <td>{props.x.text}</td>
            <td>{props.x.close==1?"Chiusa":"Aperta"}</td>
            <td>{props.x.min==0?"Si":"No"}</td>
            <td style={{width:'250px'}}><Container className="edB">
                <Button size="sm" variant="secondary" onClick={()=>props.scambiaD(props.x,-1)} disabled={props.x.ordine==0?true:false}>{arrowup}</Button>
                <Button size="sm" variant="secondary" onClick={()=>props.scambiaD(props.x,1)} disabled={props.x.ordine==props.nds-1?true:false}>{arrowdown}</Button>
                <Button size="sm" variant="outline-danger" onClick={()=>props.rimozioneD(props.x)}>{del}</Button>
            </Container></td>
        </tr>
    )
}

function VisualizzaQ(props){
    const [usersel,setUsersel]=useState('');
    const [loadingC,setLoadingC]=useState(false);
    const [risp,setRisp]=useState([]);
    const handleDrop = async(u)=>{
        setUsersel(u);
        setLoadingC(true);
        const risposte = await API.fetchRbyQ_user(props.q.id,u);
        setRisp(risposte);
        setLoadingC(false);
    }
    const handleUser=async(param)=>{
        const tmp = props.utenti.indexOf(usersel);
        const u=props.utenti[tmp+param];
        setUsersel(u);
        setLoadingC(true);
        const risposte = await API.fetchRbyQ_user(props.q.id,u);
        setRisp(risposte);
        setLoadingC(false);
    }
    return(<>
        {usersel===''
            ?<Container fluid className="visualQ">
                <h2>Questionario: {props.q.name}</h2>
                <h5>Seleziona l'utente di cui visualizzare le risposte:</h5>
                <DropdownButton id="dropdown-basic-button" variant="info" title="Utenti">
                    {props.utenti.map((u)=>
                        <Dropdown.Item key={u.id} onClick={()=>handleDrop(u)}>{u}</Dropdown.Item>)
                    }
                </DropdownButton>
            </Container>
            :<>{loadingC?<Spinner animation="border" />:
            <Container fluid className="visualQ">
                <h2>Questionario: {props.q.name}</h2>
                <Container className="visualQ-cmd">
                    <Button variant="outline-dark" disabled={props.utenti.indexOf(usersel)==0} onClick={()=>handleUser(-1)}>{arrowLeft}</Button>
                    <h4>Utente: {usersel}</h4>
                    <Button variant="outline-dark" disabled={props.utenti.indexOf(usersel)==props.utenti.length-1} onClick={()=>handleUser(+1)}>{arrowRight}</Button>
                </Container>
                <Container className="visualQ-table">
                    {props.q.domande.map((d) => 
                        <Table key={d.id} striped bordered hover>
                            <thead>
                                <tr>
                                    <th>D:  {d.text}</th>
                                </tr>
                            </thead>
                            <tbody>
                            {d.close ?
                                risp.filter(x=>x.dId==d.id).map((rmul)=>
                                    <tr key={rmul.id}>
                                        <td>R:  {rmul.text}</td>
                                    </tr>
                                )
                                :
                                <tr>
                                    <td>R:  {risp.filter(x=>x.dId==d.id).map((ro)=>
                                        ro.text
                                    )}</td>
                                </tr>
                            }
                            </tbody>
                        </Table>
                        )
                    }
                </Container>        
            </Container>
            }</>
        }
    </>);
}

export {CompilaQ,CreaQ,VisualizzaQ};