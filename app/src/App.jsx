import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import Chat from './components/Chat';

function App() {
  return (
    <Router>
      <Route path="/chat/:id" component={Chat} />
    </Router>
  );
}

export default App;
