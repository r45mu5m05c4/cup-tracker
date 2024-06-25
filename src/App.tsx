import "./App.css";
import "react-datepicker/dist/react-datepicker.css";
import Home from "./home/Home";
import { HashRouter as Router } from "react-router-dom";
import { UserProvider } from "./utils/context/UserContext";

function App() {
  return (
    <UserProvider>
      <Router>
        <Home />
      </Router>
    </UserProvider>
  );
}

export default App;
