import React from 'react'
import { Route, Switch } from 'react-router-dom';
import { ReflexAgent } from './components/reflex-agent/reflex-agent.component'
import Navigation from './Navigation';

import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <>       
      <Navigation/>
      <Switch>                
          <Route path='/reflex-agent' component={ReflexAgent}/>       
          <Route path='/' component={ReflexAgent}/>     
      </Switch>
    </>
  )
}

export default App;
