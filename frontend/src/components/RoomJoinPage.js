import React, { Component, useState } from 'react';
import { TextField,Button, Grid,Typography} from "@material-ui/core"
import {Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function RoomJoinPage(props){

    const [ roomCode, setRoomCode] = useState("")
    const [ errorMessage, setErrorMessage] = useState("")
    const [ error, setError] = useState(false)

    
    let navigate= useNavigate()
    function handleTextFieldsChange(e){
        
        setRoomCode(e.target.value)
    }
    function RoomButtonPress(){
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code: roomCode,
            }),
          };
        fetch("/api/join-room", requestOptions)
        .then((response) =>{
            if(response.ok){
                navigate('/room/' + roomCode)
            } else{
                setErrorMessage('Room not found')
            }
        }).catch((error) => {
            console.log(error)
        })
        
    }
    
    return (
        <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">Join a Room</Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <TextField error={error}  onChange={handleTextFieldsChange} label="code" placeholder="Enter a code" value={roomCode} helperText = {errorMessage.toString()} variant="outlined"></TextField>
            </Grid>
            
            <Grid item xs={12} align="center">
                <Button color="primary" onClick={RoomButtonPress}  variant = 'contained' to="" component={Link}>
                    Enter room
                </Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="secondary" variant = 'contained' to="/" component={Link}>
                    Back
                </Button>
            </Grid>
        </Grid>
        // onClick={}
    )
    
}