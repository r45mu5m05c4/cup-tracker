import "./App.css";
import Home from "./home/Home";
import { HashRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <Home />
    </Router>
  );
}

export default App;
