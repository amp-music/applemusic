import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './Home';
import Artist from "./Artist";

function App() {
  return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/:id" component={Artist}/>
        </Switch>
      </Router>
  );
}

export default App;
