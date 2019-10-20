import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MapPage from './pages/map/map-page'

export default props => (
  <Router>
      <Switch>
        <Route exact path='/' component={ MapPage } />
      </Switch>
  </Router>
)