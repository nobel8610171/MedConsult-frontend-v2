import React from 'react';
//import ReactDOM from 'react-dom/client';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';

//const rootElement = document.getElementById("root");
/*ReactDOM.render(
    <Router>
        <Routes>*/
        {/* This route is for home component 
        with exact path "/", in component props 
        we passes the imported component*/}
        //<Route exact path="/" component={App} />    

        {/* This route is for about component 
        with exact path "/about", in component 
        props we passes the imported component*/}
        //Route path="/messageroom" component={MessageRoom} />
        /*</Routes>
    </Router>,
    rootElement
);*/

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
