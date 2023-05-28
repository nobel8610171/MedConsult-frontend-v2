import '../App.css';
import React from "react";

import Loading from './Loading';

const Clinic = ({clinic}) => {

	return (
		<div style={{margin:"20px"}}>
			<div className='msg-page'>
				<div className="clinic-chats">
					{
					clinic.length > 0
						?
						<>
							{/*<div className='clinic-chats-image'>
								<img className='clinic-img' src="chatgpt.png"/>
							</div>*/}
							<div className='clinic-msg'>
								<div className='received-msg-inbox'>
									<p>{clinic}</p>
								</div>
							</div>
						</>
						: 
						<div className='center'>
						<h2>Wait for clinic scheduling</h2>
						<Loading/>
						</div>				
					}
				</div>
			</div>
		</div>
	)

}

export default Clinic;