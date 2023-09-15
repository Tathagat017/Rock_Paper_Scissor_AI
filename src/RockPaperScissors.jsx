import React, { useRef, useState, useEffect } from "react";
import * as tmImage from "@teachablemachine/image";
import styles from "./RockPaperScissors.module.css";
const RockPaperScissors = () => {
  const webcamRef = useRef(null);
  let model;
  const selections = ["rock", "paper", "scissors"];

  const [userSelection, setUserSelection] = useState("");
  const [computerSelection, setComputerSelection] = useState("");
  const [timer, setTimer] = useState(5);
  const [playAgain, setPlayAgain] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [webcamActive, setWebcamActive] = useState(false);
  let winner;
  let interval;
  let predicting = true;
  const init = async () => {
    const URL = "https://teachablemachine.withgoogle.com/models/sl4nmwSgl/";
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
  };

  const startWebcam = async () => {
    const flip = true;
    const webcam = new tmImage.Webcam(200, 200, flip);
    webcamRef.current = webcam;

    await webcam.setup();
    await webcam.play();

    const webcamContainer = document.getElementById("webcam-container");
    webcamContainer.innerHTML = "";
    webcamContainer.appendChild(webcam.canvas);

    window.requestAnimationFrame(loop);
    setWebcamActive(true);
  };

  const loop = async () => {
    if (webcamRef.current) {
      webcamRef.current.update();
      if (predicting) {
        await predict();
      }
    }
    window.requestAnimationFrame(loop);
  };

  const determineWinner = (user, computer) => {
    user = user.toLowerCase();
    computer = computer.toLowerCase();
    if (computer == "scissor") {
      computer = "scissors";
    }
    if (user == "scissor") {
      user = "scissors";
    }
    if (
      user === computer ||
      (computer === "scissors" && user == "scissor") ||
      (computer === "rock" && user == "rock") ||
      (computer === "rock" && user == "rock") ||
      (computer === "paper" && user == "paper")
    ) {
      console.log("1", user, computer);
      return "Nobody";
    } else if (
      (user === "rock" && computer === "scissors") ||
      (user === "paper" && computer === "rock") ||
      (user === "scissors" && computer === "paper")
    ) {
      console.log("2", user, computer);
      winner = "user";
      return `user (${userSelection.toLocaleUpperCase()} beats ${computerSelection.toLocaleUpperCase()})`;
    } else {
      console.log("3", user, computer);
      winner = "computer";
      return `computer (${computerSelection.toLocaleUpperCase()} beats ${userSelection.toLocaleUpperCase()})`;
    }
  };

  const handlePlayAgain = () => {
    setUserSelection("");
    setComputerSelection("");
    setPlayAgain(false);
    setTimer(5);
    predicting = true;
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (winner == "user") {
      setUserScore(userScore + 1);
    } else if (winner == "computer") {
      setComputerScore(computerScore + 1);
    }
    if (userSelection && computerSelection && timer === 0) {
      setTimeout(() => {
        setPlayAgain(true);
        clearInterval(interval);
      }, 500);
    }
  }, [userSelection, computerSelection, timer]);

  useEffect(() => {
    if (playAgain) {
      const confirmPlayAgain = window.confirm("Do you want to play again?");
      if (confirmPlayAgain) {
        handlePlayAgain();
        // Generate new computer selection here
        const randomIndex = Math.floor(Math.random() * selections.length);
        const newComputerSelection = selections[randomIndex];
        setComputerSelection(newComputerSelection);
        setTimer(5);
      }
    }
  }, [playAgain]);

  useEffect(() => {
    if (userSelection && computerSelection) {
      interval = setInterval(() => {
        setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [userSelection, computerSelection]);

  const handlePrediction = (prediction) => {
    if (prediction.probability >= 0.999) {
      const newUserSelection = prediction.className;
      setUserSelection(newUserSelection);
      prediction = false;
      if (!computerSelection) {
        const randomIndex = Math.floor(Math.random() * selections.length);
        const newComputerSelection = selections[randomIndex];
        setComputerSelection(newComputerSelection);
        setTimer(5); // Reset timer when new round starts
      }
    }
  };

  const predict = async () => {
    if (webcamRef.current && model) {
      const prediction = await model.predict(webcamRef.current.canvas);
      const labelContainer = document.getElementById("label-container");
      labelContainer.innerHTML = "";

      for (let i = 0; i < prediction.length; i++) {
        const classPrediction =
          prediction[i].className + ": " + prediction[i].probability.toFixed(3);
        const predictionDiv = document.createElement("div");
        predictionDiv.textContent = classPrediction;
        labelContainer.appendChild(predictionDiv);
        handlePrediction(prediction[i]);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h4 className="header2">Click Start to Play </h4>{" "}
      {/* Use the CSS module class name */}
      <button
        className={styles.button}
        onClick={startWebcam}
        disabled={webcamActive}
      >
        Start
      </button>
      <div className={styles.infoContainer}>
        {userSelection && computerSelection && timer > 0 && (
          <p className={styles.timer}>Time left: {timer} seconds</p>
        )}
        {userSelection && computerSelection && timer === 0 && (
          <p className={styles.result}>
            Time's up! {determineWinner(userSelection, computerSelection)} wins!
          </p>
        )}
        {playAgain && (
          <p className={styles.playAgain}>Would you like to play again?</p>
        )}
      </div>
      <div className={styles.selections}>
        <p>
          User Selection: {userSelection.toLocaleUpperCase()}
          {userSelection.toLocaleUpperCase() == "ROCK" && <span>🪨</span>}
          {userSelection.toLocaleUpperCase() == "SCISSOR" && <span>✂️</span>}
          {userSelection.toLocaleUpperCase() == "PAPER" && <span>📃</span>}
        </p>
        <p>
          Computer Selection: {computerSelection.toLocaleUpperCase()}{" "}
          {computerSelection.toLocaleUpperCase() == "ROCK" && <span>🪨</span>}
          {computerSelection.toLocaleUpperCase() == "SCISSORS" && (
            <span>✂️</span>
          )}
          {computerSelection.toLocaleUpperCase() == "PAPER" && <span>📃</span>}
        </p>
      </div>
      <h4>User Score : {userScore}</h4>
      <h4>Computer Score : {computerScore}</h4>
      <div id="webcam-container"></div>
      <div id="label-container"></div>
    </div>
  );
};

export default RockPaperScissors;
