import {Route, Switch} from 'react-router-dom'
import Home from './components/Home'
import CourseItem from './components/CourseItem'
import NotFound from './components/NotFound'
import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/courses/:id" component={CourseItem} />
    <Route component={NotFound} />
  </Switch>
)

export default App
