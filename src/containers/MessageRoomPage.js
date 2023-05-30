import '../App.css';
import React from "react";
import { AudioRecorder } from 'react-audio-voice-recorder';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import axios from "axios";
import { useEffect, useState, useRef } from "react";

import Chat from '../components/Chat';
import Clinic from '../components/Clinic';
import Loading from '../components/Loading';
import ClinicSchedule from "../data/ClinicSchedule";
import { enableButton, disableButton } from '../functions/Utils';

const MessageRoomPage = ({apiKey, setApiKey, report, medicalRecord}) => {

    const [audios, setAudios] = useState([]);
    const [transcriptions, setTranscriptions] = useState([]);
    //const [translations, setTranslations] = useState([]);
    const [chats, setChats] = useState([]);
    const [audioClickAble, setAudioClickAble] = useState(false);
    const [summary, setSummary] = useState("");
    const [clinic, setClinic] = useState("");

    const summaryButtonRef = useRef();
    const reportLoadingRef = useRef();
    const bottomLineRef = useRef();
    const recordButtonRef = useRef();
    const clearButtonRef = useRef();
    
    const whisperModel = "whisper-1";
    const chatgptModel = "gpt-3.5-turbo";
    const urlForWhisper = "https://api.openai.com/v1/audio/transcriptions";
    const urlForChatgpt = "https://api.openai.com/v1/chat/completions";

    useEffect(() => {
        console.log(medicalRecord);
    }, []);

    const sendAudioRequest = async function (blob) {      
        try{
            const headers = {
                "content-type":  "multipart/form-data",
                "Authorization": `Bearer ${apiKey}`
            //   "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
            };    
            const formData = new FormData();
            formData.append("file", blob , "audio.mp3")
            formData.append("model", whisperModel)
            
            const response = await axios.post(urlForWhisper, formData, { "headers":headers })
            const transcription = response.data.text;    
            return transcription
        }
        catch (error){
            console.log(error);
        }
    }

    async function sendTranslationRequest (transcription) {
        try{
            const headers = {
                "content-type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            };
            const messages = [
                    {"role": "system", "content": "You will be given a ASR transcript. Translate the transcript into English. If the transcript is already in English, then return the original transcript."},
                    {"role": "user", "content": transcription}
                ]
            const jsonData = {messages: messages, model: chatgptModel}
            const response = await axios.post(urlForChatgpt, jsonData, { headers:headers })
            
            const translation = response.data.choices[0].message.content
            return translation;
        }
        catch (error) {
            console.log(error);
        }
    }

    //async function sendChatRequest(translation) {
    async function sendChatRequest(transcription) {
        try {
            const headers = {
                "content-type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            };
            const messages = [
                    {"role": "system", "content": "You are a medical diagnosis consultant. You will be given a chest x-ray report, some medical records and health information of a patient. You are responsible to provide a more comprehensive report, and also list out the possible diseases, medical guides and suggestions for the patient. Patients without medical expertise may probably not understand difficult medical terminologies, so try to explain everything in an easy way."},
                ]

            //console.log(translations)
            console.log(transcriptions)
            // Multi-turn chats
            // FIXME: setState() is async, so the translations here are not updated,
            //        so constraint should be translations.length 
            //        to including the last translation
            //for (let i = 0; i < translations.length; i ++){
            //alert(transcriptions.length)
            // warning: transcriptions.length will always be incorrect due to async of useState
            for (let i = 0; i < transcriptions.length; i++){
                messages.push({"role": "user", "content": transcriptions[i]});
                messages.push({"role": "assistant", "content": chats[i]});
            }
            messages.push({"role": "user", "content": transcription}); //due to useState, this transcription has not been appended to transcriptions yet at this moment
            if (transcriptions.length == 0) {// give report information to ChatGPT at first conversation
                messages.push({"role": "assistant", "content": "report: " + report});
                messages.push({"role": "assistant", "content": "medical record: " + medicalRecord})
            }

            const jsonData = {messages: messages, model: chatgptModel}
            const response = await axios.post(urlForChatgpt, jsonData, {headers: headers} )
            const chat = response.data.choices[0].message.content
            return chat;
        }
        catch (error){
            console.log(error)
        }
    }

    async function sendRequests (audioUrl, audioBlob){
        const transcription = await sendAudioRequest(audioBlob);
        setTranscriptions([...transcriptions, transcription]);

        //const translation = await sendTranslationRequest(transcription);
        //setTranslations([...translations, translation])

        //const chat = await sendChatRequest(translation);
        const chat = await sendChatRequest(transcription);
        setChats([...chats, chat])
    }

    const addAudioElement = async function (audioBlob) {
        summaryButtonRef.current.style.display = "none";
        disableButton(recordButtonRef)
        disableButton(clearButtonRef)
        
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudios([...audios, audioUrl]);

        // enforce the length of three lists are equal
        setTranscriptions([...transcriptions, null]);
        //setTranslations([...translations, null]);
        setChats([...chats, null]);

        await sendRequests(audioUrl, audioBlob);

        summaryButtonRef.current.style.display = "inline";
        enableButton(recordButtonRef)
        enableButton(clearButtonRef)
    };

    const sendSummaryRequest = async function(transcriptions, report, apiKey)  {
        const headers = {
            "content-type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        };
        const messages = [
                    {"role": "system", "content": "You are a medical summarization system, and a patient will share his or her current physical condition with you, and you will also receive a chest xray report. Typically, it includes the following four aspects: onset time, triggering factors of symptoms, nature of symptoms, and severity. Please utilize the information provided to summarize these aspects objectively without offering any advice."},
            ]
        
        messages.push({"role": "user", "content": "patient's medical record:"});
        messages.push({"role": "user", "content": medicalRecord});
        messages.push({"role": "user", "content": "patient's chest xray report:"});
        messages.push({"role": "user", "content": report});
        messages.push({"role": "user", "content": "patient's description:"})
    
        for (let i = 0; i < transcriptions.length; i ++){
            messages.push({"role": "user", "content": transcriptions[i]});
        }
        console.log(messages)
        const jsonData = {messages: messages, model: chatgptModel}
        try {
            const response = await axios.post(urlForChatgpt, jsonData, {headers: headers} )
            const chat = response.data.choices[0].message.content
            return chat;
        }
        catch (error){
            console.log(error)
            if (error.response.status === 429){
                const response = await axios.post(urlForChatgpt, jsonData, {headers: headers} )
                const chat = response.data.choices[0].message.content
                return chat;
            }
            else 
                return ""    
        }
    }
    
    const sendClinicRequest = async function(transcriptions, report, apiKey)  {
        const headers = {
            "content-type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        };
        const messages = [
                    {"role": "system", "content": "Based on the patient's description and clinic schedule, identify the doctor specializing in the patient's symptoms and provide the corresponding department and clinic hours."},
            ]
    
        messages.push({"role": "user", "content": "patient's description:"});
        for (let i = 0; i < transcriptions.length; i++){
            messages.push({"role": "user", "content": transcriptions[i]});
        }

        messages.push({"role": "user", "content": "patient's chest xray report:"});
        messages.push({"role": "user", "content": report});
    
        messages.push({"role": "user", "content": "Clinic schedule:"});
        for (let i = 0; i < ClinicSchedule.length; i++){
            messages.push({"role": "user", "content": ClinicSchedule[i]});
        }    
        console.log(messages)
        const jsonData = {messages: messages, model: chatgptModel}
        try {
            const response = await axios.post(urlForChatgpt, jsonData, {headers: headers} )
            const chat = response.data.choices[0].message.content
            return chat;
        }
        catch (error){
            console.log(error)
            if (error.response.status === 429){
                const response = await axios.post(urlForChatgpt, jsonData, {headers: headers} )
                const chat = response.data.choices[0].message.content
                return chat;
            }
            else 
                return ""    
        }
    }
    
    const generateReport = async function() {
        //bottomLineRef.current.style.display = "none";
        summaryButtonRef.current.style.display = "none";
        
        const summary = await sendSummaryRequest(transcriptions, report, apiKey);
        
        //reportLoadingRef.current.style.display = "none";
        setSummary(summary);
        console.log(summary)
        
        const clinic = await sendClinicRequest(transcriptions, report, apiKey);
        setClinic(clinic);
        console.log(clinic)
    }

    const continueConversation = () => { 
        setSummary("")
        setClinic("")
    }

    const endConversation = () => { 
        resetConversation()
        setApiKey("")
    }

    const resetConversation = () => {
        //summaryButtonRef.current.style.display = "none";
        setAudios([]);
        setTranscriptions([]);
        //setTranslations([]);
        setChats([]);
        setSummary([]);
    }

    return (
        
        <div className="App" style={{marginTop:"30px"}}>
        {            
            <>
            {/* Text for model prediction */}
            <h1>Online Consultation Room</h1>
            <div className='msg-container'>
            { report &&
            <p align="left"><b>Chest X-ray Report:</b><br></br> {report}</p>
            }
            {
                summary.length > 0 ? 
                <>
                { summary &&
                <p align="left"><b>Conversation Summary:</b><br></br> {summary}</p>
                }
                { clinic &&
                <p align="left"><b>Clinic Suggestions:</b><br></br> {clinic}</p>
                }
                </>
                :
                <></>
            }
            </div>
            <div className='msg-container'>
            {
            audios.map((audio, index)=> (
                <Chat key={index} audio={audios[index]} transcription={transcriptions[index]} chat={chats[index]}
                        //translation={"translation: "+translations[index]} chat={chats[index]}
                />
            ))
            }
                <button className="button-ellipse" ref={summaryButtonRef} onClick={generateReport} style={{"display": "none", "marginBottom":"40px", "marginTop":"40px" }}>Generate report</button>
                <div className='center'  ref={reportLoadingRef}  style={{"display": "none", "paddingBottom":"60px"}}>
                    <h2>Waiting for report generation</h2>
                    <Loading/>
                </div>
            </div>
            <div ref={bottomLineRef}>
                <div className='bottom-line'></div>
                <div className='bottom-line-button'>
                    <div ref={recordButtonRef}>
                        <AudioRecorder onRecordingComplete={addAudioElement}/>
                    </div>
                    <button className='circle-button' ref={clearButtonRef} onClick={resetConversation}  >
                        <ion-icon name="trash" style={{fontSize: "17px"}}></ion-icon>
                    </button>
                </div>
            </div>
            </>
        }
        </div>  
    );
}

export default MessageRoomPage;
