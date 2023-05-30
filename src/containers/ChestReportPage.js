import '../App.css';
import axios from 'axios';
import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const ChestReportPage = ({setReport, setMedicalRecord}) => {

    const [fileObj, setFileObj] = useState([]);
    const [fileArray, setFileArray] = useState([]);
    const [predictedReport, setPredictedReport] = useState("");

    const medicalRecord1 = "{\"PatientId\": \"Bradycardia_PPM\", \"Name\": \"Sarah Thompson\", \"Age\": 62, \"Gender\": \"Female\", \"Medical History\": {\"Allergies\": null, \"Childhood Illnesses\": [\"Measles\", \"Mumps\"], \"Surgeries\": [\"Hysterectomy\"], \"Chronic Conditions\": [\"Bradycardia\"], \"Previous Injuries\": [], \"Family History\": {\"Hypertension\": [\"Mother\", \"Sister\"], \"Diabetes\": [\"Father\"], \"Heart Disease\": [\"Paternal Grandfather\"]}, \"Immunizations\": [\"Influenza\", \"Pneumonia\"], \"Lifestyle\": {\"Exercise\": [], \"Diet\": [\"Heart-healthy diet\"], \"Habits\": [\"Non-smoker\", \"Moderate alcohol consumption\"]}, \"Medications\": {\"Long-term\": [\"Beta blockers\"], \"As-needed\": []}}}"
    const medicalRecord2 = "{\"PatientId\": \"ChatGPT_A\", \"Name\": \"Emily Anderson\", \"Age\": 34, \"Gender\": \"Female\", \"Medical History\": {\"Allergies\": \"Penicillin\", \"Childhood Illnesses\": [\"Chickenpox\", \"Measles\"], \"Surgeries\": [\"Appendectomy\"], \"Chronic Conditions\": [\"Asthma\"], \"Previous Injuries\": [\"Fractured Wrist\"], \"Family History\": {\"Hypertension\": [\"Father\"], \"Diabetes\": [\"Maternal Grandmother\"]}, \"Immunizations\": [\"Influenza\", \"Tetanus\", \"Diphtheria\", \"Pertussis\", \"MMR\"], \"Lifestyle\": {\"Exercise\": [\"Jogging\", \"Yoga\"], \"Diet\": [\"Balanced diet\"]}, \"Medications\": {\"Long-term\": [], \"As-needed\": [\"Antihistamines\"]}}}";
    const medicalRecord3 = "{\"PatientId\": \"CXR3878_IM_1968\", \"Name\": \"Daniel Johnson\", \"Age\": 47, \"Gender\": \"Male\", \"Medical History\": {\"Allergies\": null, \"Childhood Illnesses\": [], \"Surgeries\": [], \"Chronic Conditions\": [\"Degenerative Disc Disease\"], \"Previous Injuries\": [\"Fractured Ankle\"], \"Family History\": {\"Hypertension\": [\"Father\"], \"Rheumatoid Arthritis\": [\"Paternal Aunt\"]}, \"Immunizations\": [\"Influenza\", \"Tetanus\", \"Diphtheria\", \"Pertussis\", \"Pneumonia\"], \"Lifestyle\": {\"Exercise\": [\"Cardio workouts\", \"Weight training\"], \"Diet\": [\"Well-balanced diet\"], \"Habits\": [\"Non-smoker\", \"Moderate alcohol consumption\"]}, \"Medications\": {\"Long-term\": [], \"As-needed\": [\"Over-the-counter pain relievers (NSAIDs)\"]}}}";

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
        setMedicalRecord(medicalRecord1)
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

    const handleMedicalRecordChange = (e) => {
        if (e.target.value === "patient1") setMedicalRecord(medicalRecord1);
        else if (e.target.value === "patient2") setMedicalRecord(medicalRecord2);
        else setMedicalRecord(medicalRecord3)
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
            <div className="medical-records">
                <select name="medical-records-options" id="medical-record-options" onChange={handleMedicalRecordChange} >
                  <option value="patient1">Patient 1</option>
                  <option value="patient2">Patient 2</option>
                  <option value="patient3">Patient 3</option>  
                </select>
            </div>
          </header>
        </div>
      );
}

export default ChestReportPage;
