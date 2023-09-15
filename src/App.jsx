import React from "react";
import RockPaperScissors from "./RockPaperScissors";
import Navbar from "./Components/Navbar";
import styles from "./App.css";
import Footer from "./Components/Footer";

function App() {
  return (
    <div>
      <Navbar />

      <div className="App">
        <RockPaperScissors />
      </div>
      <Footer />
    </div>
  );
}

export default App;
