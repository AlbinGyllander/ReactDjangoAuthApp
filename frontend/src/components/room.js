
   
import React, { Component,useEffect,useState } from "react";
import { useParams, Link,Navigate,useNavigate } from 'react-router-dom'
import {Grid, Button, Typography, ButtonGroup} from '@material-ui/core';
import CreateRoomPage from "./CreateRoomPage";

export default function Room(props){

    const [ isHost, setIsHost] = useState(false )
    const [ guestCanPause, setguestCanPause] = useState(false)
    const [ votesToSkip, setvotesToSkip] = useState(2)
    const [ showSettings, setShowSettings] = useState(false)

    var TheroomCode = useParams().roomCode
    let navigate= useNavigate()
    function getRoomDetails(){
        fetch('/api/get-room' + '?code=' + TheroomCode).then((response) => {
            if(!response.ok){
                props.leaveRoomCallback();
                navigate('/')
            }
            return response.json()
        }).then((data) => {
            setvotesToSkip(data.votes_to_skip)
            setguestCanPause(data.guest_can_pause)
            setIsHost(data.is_host)

        })
    }
    useEffect(() => {
        let isMounted = true
        if(isMounted){
            getRoomDetails()   
        }
         // Specify how to clean up after this effect:
        return () =>isMounted = false
    },[]);

    function renderSettings(){
        return (<Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <CreateRoomPage 
                    update={true} 
                    votesToSkip={votesToSkip} 
                    guestCanPause={guestCanPause}
                    roomCode = {TheroomCode}
                    updateCallback = {getRoomDetails}>
                </CreateRoomPage>
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" onClick={() => setShowSettings(false)}>Close</Button>
            </Grid>
        </Grid>)
    }

    function renderSettingsButton(){
        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={() => setShowSettings(true)}>Settings</Button>
            </Grid>
        )
    }

    function LeaveButtonPressed(){
        console.log(props)
        const requestOptions = {
            method:"POST",
            headers: {"Content-Type":"application/json"}
        }
        fetch('/api/leave-room',requestOptions).then((response) => {
            
            props.leaveRoomCallback();
            navigate('/')
        })
    }
    if (showSettings) {
        return renderSettings()
    }
    return ( 
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">Code:{TheroomCode}</Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">Votes to skip:{votesToSkip}</Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">Guests Can pause:{guestCanPause.toString()}</Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">Is host:{isHost.toString()}</Typography>
            </Grid>
            
            {isHost ? renderSettingsButton():null}
            
            <Grid item xs={12} align="center">
                <Button variant="contained" to="/" component={Link} color="secondary" onClick={LeaveButtonPressed}>Leave room</Button>
            </Grid>
        </Grid>)
    
}