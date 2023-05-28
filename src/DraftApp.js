import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import ReactDOM from "react-dom";

import "./styles.css";
import { useEffect, useState } from "react";

import MessageRoomPage from "./containers/MessageRoomPage"
import AskKeyPage from './containers/AskKeyPage';

class App extends Component {
  
  fileObj = [];
  fileArray = [];
  // Constructor
  constructor() {
    super()
    this.state = {
      apiKey: "", 
      file: [null],
      previewImageUrl1: false,
      previewImageUrl2: false,
      imageHeight: 200,
      imagePrediction: "",
    }
    this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this)
    this.uploadFiles = this.uploadFiles.bind(this)
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.generatePreviewImageUrl = this.generatePreviewImageUrl.bind(this)
  }

  uploadMultipleFiles(e) {
      this.fileObj.push(e.target.files)
      for (let i = 0; i < this.fileObj[0].length; i++) {
          this.fileArray.push(URL.createObjectURL(this.fileObj[0][i]))
      }
      this.setState({ file: this.fileArray })
  }
  uploadFiles(e) {
      e.preventDefault()
      console.log(this.state.file)
      const formData = new FormData()
      formData.append('file1', this.fileObj[0][0], 'img1.jpg')
      formData.append('file2', this.fileObj[0][1], 'img2.jpg')
      var self = this;
      var t0 = performance.now();
      axios.post('http://localhost:5000/upload', formData)
      .then(function(response, data) {
              data = response.data;
              self.setState({imagePrediction:data})
              var t1 = performance.now();
              console.log("The time it took to predict the image " + (t1 - t0) + " milliseconds.")
          })
  }
  // Function for previewing the chosen image
  generatePreviewImageUrl(file, callback) {
    const reader = new FileReader()
    const url = reader.readAsDataURL(file)
    reader.onloadend = e => callback(reader.result)
  }

  handleChange(event) {
    this.setState({apiKey: event.target.value});
  }

  handleSubmit(event) {
    alert('An API Key was submitted');
    event.preventDefault();
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <form onSubmit={this.handleSubmit}>
            <label>
              OpenApi Key:
              <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
          <div className="App-upload">
            <p>
              Upload images for report generation
            </p>
          </div>
          <div className="form-group multi-preview">
              {(this.fileArray || []).map(url => (
                  <img src={url} alt="..." />
              ))}
          </div>
          <div className="form-group">
              <input type="file" className="form-control" onChange={this.uploadMultipleFiles} multiple />
          </div>
          <button type="button" className="btn btn-danger btn-block" onClick={this.uploadFiles}>Upload</button>

          {/* Text for model prediction */}
          <div>
          { this.state.imagePrediction &&
            <p>The model predicted: {this.state.imagePrediction}
            </p>
          }
          </div>
          <div className="App" style={{marginTop:"30px"}}>
            <MessageRoomPage apiKey= {this.state.apiKey}/>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
