import {Card,CardDeck,Button} from 'react-bootstrap';

function MyCardDeck(props){
    return(
        <CardDeck className="cgs" >
            {props.questionari.map((x) => <MyCard key={x.id} loggedIn={props.loggedIn} q={x} handleQsel={props.handleQsel} handleShowU={props.handleShowU}/>)}        
        </CardDeck>
    );    
}

function MyCard(props){
    function click(){
        props.handleShowU();
        props.handleQsel(props.q,false);
    }
    const clickA=()=>{
        props.handleQsel(props.q,true);
    }
    return(
        <Card className="cW text-center">
            {
                props.loggedIn ?<>
                <Card.Body>
                    <Card.Title>
                        {props.q.name}
                    </Card.Title>
                    <Card.Text>
                        {props.q.descr}
                    </Card.Text>
                    {props.loggedIn &&
                        <Card.Text>Numero di compilazioni: {props.q.ncompil}</Card.Text>        //TODO N Compilazioni
                    }
                </Card.Body>    
                <Button disabled={props.q.ncompil===0} variant="warning" onClick={clickA}>Visualizza Risposte</Button>
                </> : <>
                <Card.Body>
                    <Card.Title>
                        {props.q.name}
                    </Card.Title>
                    <Card.Text>
                        {props.q.descr}
                    </Card.Text>
                    <Button onClick={click}>Compila</Button> 
                </Card.Body>
                <Card.Footer><small className="text-muted">Autore: {props.q.authName}</small></Card.Footer></>
            }
        </Card>
    );
}

export {MyCardDeck};