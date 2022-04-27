import React, { Component, useState } from 'react';
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { FormLabel, TextField,FormControlLabel,RadioGroup,Radio ,FormControl,FormHelperText} from '@material-ui/core';
import {Link} from "react-router-dom";
import { Collapse } from '@material-ui/core';
import Alert from "@material-ui/lab/Alert" 
import { useNavigate } from "react-router-dom";

export default function CreateRoomPage(props) {
   
    const [ guestCanPause, setguestCanPause] = useState(props.guestCanPause || "false")
    const [ votesToSkip, setvotesToSkip] = useState(props.votesToSkip || 2)
    const [ roomCode, setRoomCode] = useState(props.roomCode || null)
    const [ errorMessage, setErrorMsg] = useState("")
    const [ successMessage, setSuccessMsg] = useState("")
    console.log(votesToSkip,guestCanPause.toString())
   let navigate= useNavigate()
    function handleRoomButtonPressed(
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              votes_to_skip: votesToSkip,
              guest_can_pause: guestCanPause,
            }),
          };
        fetch("/api/create-room", requestOptions)
        .then((response) => response.json())
        .then((data) => navigate('/room/' + data.code))
    }; 

    function handleVotesChange(e) {
        setvotesToSkip( e.target.value)
    }

    function handleGuestCanPauseChange(e) {
        setguestCanPause(e.target.value === 'true' ? true:false)
    }
    
    function handleUpdatePressed(){
        const requestOptions = {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              votes_to_skip: votesToSkip,
              guest_can_pause: guestCanPause,
              code: roomCode,
            }),
          };
        fetch("/api/update-room", requestOptions)
        .then((response) => {
            if(response.ok){
                setSuccessMsg('Updated sucessfully')
            } else{
                setErrorMsg('Error while updating')
            }
            props.updateCallback()
        })
        
    }

    function RenderCreateButtons(){
        return(
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant = 'contained' onClick={handleRoomButtonPressed}>
                        Create A Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant = 'contained' to="/" component={Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        )
    }

    function RenderUpdateButton(){
        return(
            <Grid item xs={12} align="center">
                <Button color="primary" variant = 'contained' onClick={handleUpdatePressed}>
                    Update Room
                </Button>
            </Grid>
        )
    }



    const title = props.update ? "Update Room" : "Create a Rom"
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Collapse in={errorMessage!="" || successMessage != ""}>
                    {successMessage !="" ? (<Alert onClose={()=>{setSuccessMsg("")}} severity="success">{successMessage}</Alert>):(<Alert onClose={()=>{setErrorMsg("")}} severity="error">{errorMessage}</Alert>)}
                </Collapse>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography component='h4' variant = 'h3'>{title}</Typography>
            </Grid>
            <Grid item xs={12} align="center">
               <FormControl component = 'fieldset'>
                    <FormHelperText>
                        Guest control of playback state
                    </FormHelperText> 
                    <RadioGroup row defaultValue={guestCanPause.toString()} onChange={(e)=>handleGuestCanPauseChange(e)}>
                        <FormControlLabel value="true" control={<Radio color = 'primary'/>} label = 'Play/Pause' labelPlacement='bottom'/>
                        <FormControlLabel value="false" control={<Radio color = 'secondary'/>} label = 'No control' labelPlacement='bottom'/>
                    </RadioGroup>
               </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField required={true} type = 'number' defaultValue={votesToSkip} onChange={(e)=>handleVotesChange(e)} inputProps={{
                        min:1,
                        style:{textAlign:'center'}
                        }}/>
                    <FormHelperText>
                        Votes to skip song
                    </FormHelperText>
              </FormControl>
            </Grid>
            {props.update ? <RenderUpdateButton/>:<RenderCreateButtons/>}

        </Grid>)
    
}