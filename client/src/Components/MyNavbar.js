import {logo,login_i,logout_i} from './icons';
import { Navbar,Col,Button} from "react-bootstrap";
import {MyModal} from './MyModals.js';
import { useState } from 'react';


function MyNavBar(props){
    const[show,setShow]=useState(false);
    const handleShow = () => setShow(true);
    const handleClose = ()=>setShow(false);
    return(<>
        <Navbar bg={props.loggedIn?"success":"dark"} variant="dark" className="expand-sm fixed-top">
            <Col>
                <Navbar.Brand href='/' >
                    {logo}
                    Questionario
                </Navbar.Brand>
            </Col>
            <Col>
                {
                    props.loggedIn?
                    <Button variant="dark" style={{float:'right'}} onClick={props.doLogout}>
                        Logout
                        {logout_i}      
                    </Button>:
                    <Button variant="success" style={{float:'right'}} onClick={handleShow}>
                        Login
                        {login_i}
                    </Button>
                }
            </Col>
        </Navbar>
        <MyModal show={show} user={false} handleClose={handleClose} login={props.doLogin} />
    </>);
}

export {MyNavBar};