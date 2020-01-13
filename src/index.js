import React from "react";
import ReactDom from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from 'react-redux'
import { createStore } from 'redux';

import reducer from './reducers/root'
import App from "./App";

import "semantic-ui-css/semantic.min.css";
import "./index.css";

ReactDom.render(
  <Provider store={ createStore(reducer) }>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);
