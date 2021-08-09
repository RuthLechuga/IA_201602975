import React, { useEffect, useState } from 'react';
import agent from './../../static/images/agent.svg';
import { Container, Col, Row, Image, InputGroup, FormControl, Badge, Button } from 'react-bootstrap';
import swal from 'sweetalert';

import './reflex-agent.css';

export const ReflexAgent = () => {
    
    const [states, setStates] = useState({
        location: false, //false: A, true: B
        stateA: true, //true: dirty, false: clean
        stateB: true
    });

    const [counts, setCounts] = useState([0,0,0,0,0,0,0,0]);

    const [isPlay, setIsPlay] = useState(false);

    const [logs, setLogs] = useState('');

    const { location, stateA, stateB } = states;

    useEffect(() => {
        
        let interval = setInterval(() => {
    
            if(isPlay) {
                modifyCounts(location,stateA,stateB)  
                let state = !location? stateA: stateB;
                let action_result = reflex_agent(location,state);
                
                let log = `Location: ${!location? 'A': 'B'} | Action: ${!action_result? 'CLEAN': action_result} \n`;
                setLogs(state => log+state)
    
                if(!action_result){
                    if(!location) setStates(states => {return {...states, stateA: false}; });
                    else setStates(states => {return {...states, stateB: false}});
                }
                else if(action_result === 'RIGHT')  setStates(states => {return {...states, location: true}});
                else if(action_result === 'LEFT')   setStates(states => {return {...states, location: false}});
            
                let mProbability = (counts[3] + counts[7]) > (counts[0]+counts[4])? 2: 1; 
                let doMess = Math.floor((Math.random() * 1) + 2);
                let stateMess = Math.floor((Math.random() * 10) + 1);
                        
                if(doMess > mProbability){
                    switch(stateMess){
                        case 1: case 2: case 3: case 4: //Ensucia A
                            setLogs(state => `ENSUCIA A\n`+state);
                            setStates(states =>{ return {...states, stateA: true}});
                            break;

                        case 5: case 6: case 7: case 8: //Ensucia B
                            setLogs(state => `ENSUCIA B\n`+state);
                            setStates(states =>{ return {...states, stateB: true}});
                            break;

                        case 9: case 10:
                            setLogs(state => `ENSUCIA A y B\n`+state);
                            setStates(states =>{ return {...states, stateA: true, stateB: true}});
                            break;

                    }
                }
            }
    
        }, 1000);

        return () => {
            clearInterval(interval);
        }

    },[states, isPlay])

    const pause = () => { setIsPlay(false); }

    const play = () => { setIsPlay(true); }

    const restart = () => {
        setCounts([0,0,0,0,0,0,0,0]);
        setStates({
            location: false,
            stateA: true,
            stateB: true
        });
        setLogs('');
    }

    const reflex_agent = (location,state) => {
        if(state) return false;
        else if (!location) return 'RIGHT';
        else if (location) return 'LEFT';
    }

    const modifyCounts = (location,stateA,stateB) => {
        if(counts.find(c => c<2) != null){
            let pos = (4*location)+(2*stateA)+stateB;
            const newCounts = counts.slice();
            newCounts[pos] = newCounts[pos]+1;
            setCounts(newCounts);
        }
        else {
            setIsPlay(false);
            swal("Completado","","success")
        }
    }

    return (
        <Container>
            <br></br>

            <Row>
                {
                    counts.map((count, index) => {
                        return <Col sm={3} className="state" key={index}>
                                    <h2>Estado {index+1} - <Badge bg="danger">{count}</Badge></h2>
                                </Col>
                    })
                }
            </Row>

            <br></br>

            <Row>
                <Col sm={4} className={states.stateA? 'dirty': 'clean'}>
                    <div className="room">
                        <h3>A</h3>
                        {!states.location && <Image className="agent" src={agent} />}
                    </div>
                </Col>

                <Col sm={4} className={states.stateB? 'dirty': 'clean'}>
                    <div className="room">
                        <h3>B</h3>
                        {states.location && <Image className="agent" src={agent} />}
                    </div>
                </Col>

                <Col sm={4}>
                    <Row>
                        <InputGroup className="textarea">
                            <InputGroup.Text>Logs</InputGroup.Text>
                            <FormControl value={logs} readOnly as="textarea"/>
                        </InputGroup>
                    </Row>
                    <br></br>
                    <Row>
                        <Col sm={4}>
                            <div className="d-grid gap-2">
                                <Button variant="success" onClick={play}>Play</Button>
                            </div>
                        </Col>
                        <Col sm={4}>
                            <div className="d-grid gap-2">
                                <Button variant="danger" onClick={pause}>Pause</Button>
                            </div>
                        </Col>
                        <Col sm={4}>
                            <div className="d-grid gap-2">
                                <Button variant="primary" onClick={restart}>Restart</Button>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row>
                Total de Pasos: { counts.reduce((a, b) => a + b, 0) }
            </Row>

        </Container>
    )
}
