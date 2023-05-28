import '../App.css';
import axios from 'axios';
import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const ChestReportPage = ({setReport}) => {

    const [fileObj, setFileObj] = useState([]);
    const [fileArray, setFileArray] = useState([]);
    const [predictedReport, setPredictedReport] = useState("");

    function buildFileArray() {
        var tmp_array = [];
        for (let i = 0; i < fileObj[0].length; i++) {
            tmp_array.push(URL.createObjectURL(fileObj[0][i]))
        }
        setFileArray(tmp_array)
    }

    const uploadMultipleFiles = (e) => {
        setFileObj([e.target.files])
    }

    useEffect(() => {
        if (fileObj.length == 0) return;
        buildFileArray()
    }, [fileObj])
    
    const uploadFiles = (e) => {
        e.preventDefault()
        //console.log(fileArray)
        const formData = new FormData()
        formData.append('file1', fileObj[0][0], 'img1.jpg')
        formData.append('file2', fileObj[0][1], 'img2.jpg')
        var t0 = performance.now();
        axios.post('http://localhost:5000/upload', formData)
        .then(function(response, predicted_report) {
            predicted_report = response.data
            setPredictedReport(predicted_report)
            setReport(predicted_report)
            var t1 = performance.now();
            console.log("The time it took to predict the image " + (t1 - t0) + " milliseconds.")
        })
    }

    const goToChat = (e) => {
        
    }

    //useEffect(() => {
    //    if (fileArray.length == 0) return;
    //    console.log(fileArray)
    //    alert(fileArray.length)
    //}, [fileArray])

    return (
        <div className="App">
          <header className="App-header">
            <div className="App-upload">
              <p>
                Upload images for report generation
              </p>
            </div>
            <div className="form-group multi-preview">
                {(fileArray || []).map(url => (
                    <img src={url} alt="..." />
                ))}
            </div>
            <div className="form-group">
                <input type="file" className="form-control" onChange={uploadMultipleFiles} multiple />
            </div>
            <button type="button" className="btn btn-danger btn-block" onClick={uploadFiles}>Upload</button>
          </header>
        </div>
      );
}

export default ChestReportPage;
