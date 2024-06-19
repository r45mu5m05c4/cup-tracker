import "./App.css";
import Home from "./home/Home";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Home />
    </Router>
  );
}

export default App;
