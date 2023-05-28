import '../App.css';
import React from "react";
import { useEffect, useState } from 'react';

import {formatDate} from '../functions/Utils';
import Loading from './Loading';

import old from '../img/old.png';
import chatgptlogo from '../img/chatgpt.png'

//const Chat = ({audio, transcription, translation, chat}) => {
const Chat = ({audio, transcription, chat}) => {
	const [transcriptionTime, setTranscriptionTime] = useState("");
	const [translationTime, setTranslationTime] = useState("");
	const [chatTime, setChatTime] = useState("");

	useEffect(() => {
		const date = new Date();
		setTranscriptionTime(formatDate(date));
	}, [transcription]);
	
	/*useEffect(() => {
		const date = new Date();
		setTranslationTime(formatDate(date));
	}, [translation])*/

	useEffect(() => {
		const date = new Date();
		setChatTime(formatDate(date));
	}, [chat])

	return (
		<div style={{margin:"20px"}}>
			{/* <div className='msg-inbox'>
			<div className='chats'> */}
			<div className='msg-page'>
				<div className="sent-chats">
					<div className='sent-chats-msg'>
						{
						// Set this to be null to avoid situation that return is empty
						audio !== null
							?
								<audio controls="True" src={audio}></audio>
							:
								<Loading/>
						}
						{
						transcription !== null
							?
							<>
								<p>{transcription}</p>
								{/* <span className="chat-time">{transcriptionTime}</span> */}
								{/*translation !== null
									?
										<>
											<p style={{marginTop:"1px"}}>{translation}</p>
											<span className="chat-time">{translationTime}</span>									
										</>	
									:
										<Loading/>
								*/}
							</>
							:
							audio !== null
								?
									<Loading/>
								:
									<></>
						}
					</div>
					<div className='sent-chats-img'>
						<img className='chats-img' src={old} alt="old.png"/>
					</div>
				</div>
				{/* <div className="sent-chats">
					{
					translation !== null
						?
							<>
							<div className='sent-chats-msg'>
								<div className='sent-msg-inbox'>
									<p>{translation}</p>
									<span className="chat-time">{translationTime}</span>
								</div>
							</div>
							<div className='sent-chats-img'>
								<img className='chats-img' src="chatgpt.png"/>
							</div>
							</>
						: 
							transcription !== null
							?
								<Loading/>					
							:
								<></>
					}
				</div> */}
				<div className="received-chats">
					{
					chat !== null
						?
						<>
							<div className='received-chats-img'>
								<img className='chats-img' src={chatgptlogo} alt="chatgpt.png"/>
							</div>
							<div className='received-msg'>
								<div className='received-msg-inbox'>
									<p>{chat}</p>
									<span className="chat-time">{chatTime}</span>
								</div>
							</div>
						</>
						: 
						<Loading/>
						/*translation !== null
							?
								<Loading/>					
							:
								<></>*/
					}
				</div>
			{/* </div>
			</div> */}
			</div>
		</div>
	)

}

export default Chat;