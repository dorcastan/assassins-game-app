import { Router } from "@reach/router";
import React from "react";
import PlayerList from "./PlayerList";

function App() {
  return (
    <Router>
      <PlayerList path="/" />
    </Router>
  );
}

export default App;
