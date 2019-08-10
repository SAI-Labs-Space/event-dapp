import React from 'react';
import "./scss/main.scss";
import "react-datepicker/dist/react-datepicker.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import MainPage from './components/MainPage';
import CreateEvent from './components/CreateEvent';
import ViewEvent from './components/ViewEvent';
import AdminEvent from './components/EventAdmin';

function App() {
  return (
    <Router>
      <Route path="/" exact component={MainPage} />
      <Route path="/create-event" exact component={CreateEvent} />
      <Route path="/event/:id" exact component={ViewEvent} />
      <Route path="/admin/event/:id" exact component={AdminEvent} />
    </Router>
  )
}

export default App;
