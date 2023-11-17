import React, { useState, useEffect, useRef } from "react";

const App = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerLabel, setTimerLabel] = useState("Session");
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isActive, setIsActive] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);
  const audioBeep = useRef(null);

  const reset = () => {
    audioBeep.current.pause();
    audioBeep.current.currentTime = 0;
    clearInterval(timerInterval);
    setIsActive(false);
    setTimerLabel("Session");
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
  };

  function startStop() {
    if (!isActive) {
      setIsActive(true);
      setTimerInterval(
        setInterval(() => {
          setTimeLeft((prevTimeLeft) => {
            if (prevTimeLeft === 0) {
              audioBeep.current.play();
              clearInterval(timerInterval);
              if (timerLabel === "Session") {
                setTimerLabel("Break");
                return breakLength * 60;
              } else {
                setTimerLabel("Session");
                return sessionLength * 60;
              }
            } else {
              return prevTimeLeft - 1;
            }
          });
        }, 250)
      );
    } else {
      clearInterval(timerInterval);
      setIsActive(false);
    }
  }

  useEffect(() => {
    if (timeLeft === 0) {
      audioBeep.current.play();
    }
  }, [timeLeft]);

  const decrementBreak = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
      if (!isActive && !timerLabel.includes("Session")) {
        setTimeLeft((breakLength - 1) * 60);
      }
    }
  };

  function incrementBreak() {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
      if (!isActive && !timerLabel.includes("Session")) {
        setTimeLeft((breakLength + 1) * 60);
      }
    }
  }

  function decrementSession() {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      if (!isActive && timerLabel.includes("Session")) {
        setTimeLeft((sessionLength - 1) * 60);
      }
    }
  }

  function incrementSession() {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      if (!isActive && timerLabel.includes("Session")) {
        setTimeLeft((sessionLength + 1) * 60);
      }
    }
  }

  function formatTime(timeLeft) {
    const minutes = Math.floor(timeLeft / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeLeft % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  return (
    <div className="App">
      {" "}
      <span
        style={{
          display: "inline-block",
          marginBottom: "1rem",
          fontSize: "1.5rem",
        }}
        id="break-label"
      >
        Break Length
      </span>
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <button id="break-decrement" onClick={decrementBreak}>
          Decrement Break
        </button>
        <span id="break-length">{breakLength}</span>
        <button id="break-increment" onClick={incrementBreak}>
          Increment Break
        </button>
      </div>
      <span
        style={{
          display: "inline-block",
          marginBottom: ".5rem",
          fontSize: "1.5rem",
        }}
        id="session-label"
      >
        Session Length
      </span>
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <button id="session-decrement" onClick={decrementSession}>
          Decrement Session
        </button>
        <div id="session-length">{sessionLength}</div>
        <button id="session-increment" onClick={incrementSession}>
          Increment Session
        </button>
      </div>
      <span
        style={{
          display: "inline-block",

          fontSize: "1.5rem",
        }}
        id="timer-label"
      >
        {timerLabel}:
      </span>
      <spam
        style={{
          display: "block",
          marginBottom: "1rem",
          fontSize: "1.5rem",
        }}
        id="time-left"
      >
        {formatTime(timeLeft)}
      </spam>
      <button id="start_stop" onClick={startStop}>
        Start/Stop
      </button>
      <button style={{ marginLeft: ".5rem" }} id="reset" onClick={reset}>
        Reset
      </button>
      <audio
        id="beep"
        src={"https://www.soundjay.com/button/beep-07.wav"}
        ref={audioBeep}
        preload="auto"
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default App;
