import {Button, Modal} from 'react-bootstrap';
import {LoginForm,MyFormU,OpenQForm,CloseQForm} from './MyForms.js';

function MyModal(props){
    return(
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{props.user?"Compilazione":"Login"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.user?<MyFormU err={props.err} setU={props.setU}/>:<LoginForm handleClose={props.handleClose} login={props.login}/>}
            </Modal.Body>
            {props.user && 
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Chiudi
                </Button>
                <Button variant="primary" onClick={props.handleSubmit}>
                    Conferma
                </Button>
            </Modal.Footer>}
        </Modal>
    );
}
function MyDomandeModal(props){
    return(
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{props.close?"Aggiunta domanda a risposta chiusa":"Aggiunta domanda a risposta aperta"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.close?
                    <CloseQForm nds={props.nds} handleClose={props.handleClose} aggiuntaD={props.aggiuntaD} />:
                    <OpenQForm nds={props.nds} handleClose={props.handleClose} aggiuntaD={props.aggiuntaD} />}
            </Modal.Body>
        </Modal>
    );
}

export{MyModal,MyDomandeModal};