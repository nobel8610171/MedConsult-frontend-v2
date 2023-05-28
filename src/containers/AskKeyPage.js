import '../App.css';
import React from "react";
import { useRef } from "react";

import { validateApiKey } from '../functions/Utils';

const AskKeyPage = ({setApiKey}) => {

    const inputRef = useRef();
    const errorRef = useRef();
    const handleKeyDown = async (event) => {
        if (event.key === "Enter"){
            try{
                const apiKey = event.target.value;
                const test = await validateApiKey(apiKey);
                if (test == true)
                    setApiKey(event.target.value)
                else 
                    errorRef.current.style.visibility = "visible";
            }
            catch (error){
                errorRef.current.style.visibility = "visible";
                console.log(error)
            }
        }
    }
    const handleClick = async (event) => {
        try{
            const apiKey = inputRef.current.value
            const test = await validateApiKey(apiKey) 
            if (test === true)
                setApiKey(inputRef.current.value)
            else 
                errorRef.current.style.visibility = "visible";
        }
        catch (error) {
            errorRef.current.style.visibility = "visible";
            console.log(error)
        }
    }

    return (
        <div className="App ask-key-container" >
            <h2>Medical Consultation System</h2>
            <span>
                Api Key : <input type="text" onKeyDown={handleKeyDown} ref={inputRef}/>
            </span>
            <button onClick={handleClick}>Submit</button>
            <div className="error" ref={errorRef} style={{"visibility": "hidden"}}>
                <h3 style={{"color":"red"}}>Error!</h3>
                <p style={{"color":"red"}}>Please ensure that a correct api key is provided</p>
            </div> 
        </div>
    );
}

export default AskKeyPage;
