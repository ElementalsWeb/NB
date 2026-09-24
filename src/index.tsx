import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import { TrebleApp } from "@threekit-tools/treble"
import './index.css';
import { registerServiceWorker } from './registerServiceWorker';

registerServiceWorker();
ReactDOM.render(<App />, document.getElementById('tk-treble-root'));
