import "./App.css";
import "react-datepicker/dist/react-datepicker.css";
import { HashRouter as Router } from "react-router-dom";
import { UserProvider } from "./utils/context/UserContext";
import { CompetitionProvider } from "./utils/context/CompetitionContext";
import { MainContainer } from "./main/MainContainer";

function App() {
  return (
    <UserProvider>
      <CompetitionProvider>
        <Router>
          <MainContainer />
        </Router>
      </CompetitionProvider>
    </UserProvider>
  );
}

export default App;
