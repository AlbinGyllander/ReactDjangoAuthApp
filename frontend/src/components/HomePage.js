import React, { Component, useState,useEffect } from 'react';
import CreateRoomPage from './CreateRoomPage';
import RoomJoinPage from './RoomJoinPage';
import { BrowserRouter as Router, Route,Routes,Link, Navigate} from 'react-router-dom';
import Room from "./room";
import { Grid,Button,ButtonGroup,Typography } from '@material-ui/core';


export default function HomePage() {
    const [roomCode, setRoomCode] = useState(null)

    function renderHome(){
        return (    
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h3" compact="h3">Home party</Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color="primary" >
                        <Button color="primary" to="/join" component={ Link }>Join a Group</Button>
                        <Button color="secondary" to="/create" component={ Link }>Create a Group</Button>
                        
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    }

    useEffect(() => {
        let isMounted = true
        if(isMounted){
            fetch('/api/user-in-room')
            .then((response) => response.json())
            .then((data) => {
                console.log(data.code)
                setRoomCode(data.code)
            })    
        }
        
         // Specify how to clean up after this effect:
        return () =>isMounted = false
        
    },[]);
    

    function renderRoomCode(){
        return roomCode ? (
            <Navigate to={`/room/${roomCode}`} />
          ) : (
            renderHome()
        );
    }
    function clearRoomCode(){
        console.log('hello')
        setRoomCode(null)
    }
    
    return (
    <Router> 
        <Routes>
            <Route exact path="/" element={renderRoomCode()}/>
                
            
            <Route  path="/join" element={<RoomJoinPage />} />
            <Route  path="/create" element={<CreateRoomPage />} />
            
            <Route
                path="/room/:roomCode"

                element={<Room leaveRoomCallback={clearRoomCode} />}
            />
        </Routes>
    
    </Router>
    )
    
}