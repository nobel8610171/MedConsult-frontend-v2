import './App.css';
import React from "react";
// import dotenv_defaults from "dotenv-defaults";
import { useEffect, useState } from "react";
import Home from "./containers/Home";
import ChestReportPage from "./containers/ChestReportPage"
import MessageRoomPage from "./containers/MessageRoomPage"
import AskKeyPage from './containers/AskKeyPage';
import useScript from './functions/UseScript';
// dotenv_defaults.config();

function App() {

    // useScript("https://cdn.jsdelivr.net/npm/ionicons/dist/ionicons/ionicons.esm.js")
    useScript("https://cdn.jsdelivr.net/npm/ionicons/dist/ionicons/ionicons.js")
    const [apiKey, setApiKey] = useState("");
    const [report, setReport] = useState("");
    const [medicalRecord, setMedicalRecord] = useState("")

    return (
        <div className="App" style={{marginTop:"30px"}}>
            { apiKey.length == 0 ? <AskKeyPage setApiKey = {setApiKey}/>
              : report.length == 0 || medicalRecord.length == 0? <ChestReportPage setReport = {setReport} setMedicalRecord = {setMedicalRecord}/>
              : <MessageRoomPage apiKey = {apiKey} setApiKey = {setApiKey} report = {report} medicalRecord = {medicalRecord} />
            }
        </div>
    );
}

export default App;
