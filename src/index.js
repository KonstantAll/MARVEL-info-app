'use strict'

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/App';
import './style/style.scss';
import HocApp from "./components/lessonsApp/hocApp";


ReactDOM
    .createRoot(document.getElementById('root'))
    .render(
        // <React.StrictMode>
            <App />
        // <HocApp/>
        // </React.StrictMode>
    );


// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

