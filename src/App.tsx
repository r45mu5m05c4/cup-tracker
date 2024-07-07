import "./App.css";
import "react-datepicker/dist/react-datepicker.css";
import { HashRouter as Router } from "react-router-dom";
import { UserProvider } from "./utils/context/UserContext";
import { CompetitionProvider } from "./utils/context/CompetitionContext";
import { Home } from "./home/Home";

function App() {
  return (
    <UserProvider>
      <CompetitionProvider>
        <Router>
          <Home />
        </Router>
      </CompetitionProvider>
    </UserProvider>
  );
}

export default App;
