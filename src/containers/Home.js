import React from "react";
import ChestReportPage from "./ChestReportPage"
import MessageRoomPage from "./MessageRoomPage"
import AskKeyPage from './AskKeyPage';

import { useEffect, useState } from "react";

const Home = () => {
    const [apiKey, setApiKey] = useState("");
    //const [report, setReport] = useState("");
    return (
        <>
        <div>
            <h1>Home Page</h1>
        </div>
        <div className="Home" style={{ marginTop: "30px" }}>
            {apiKey.length
                ?
                /*<ChestReportPage setReport = {setReport}/>*/
                <MessageRoomPage apiKey={apiKey} />
                :
                <AskKeyPage setApiKey={setApiKey} />}
        </div>
        </>
    );
};

export default Home;
