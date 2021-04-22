import React, { useState } from "react";
import "./App.css";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const dataset = [
  {
    id: 1,
    sentence:
      "This is the test data for checking the highlighter for each word in this sentence",
    timer: 40,
  },
  {
    id: 2,
    sentence:
      "This is the test data 2 for checking the highlighter for each word from the second sentence",
    timer: 70,
  },
  {
    id: 3,
    sentence:
      "This is the test data 3 for checking the highlighter sentence from the third sentence",
    timer: 10,
  },
];

const num = Math.floor(Math.random() * 3);

export const App = () => {
  const [red, setRed] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [markedWord, setMarkedWord] = useState(null);
  const [markedWords, setMarkedWords] = useState([]);
  const [markedWordsId, setMarkedWordsId] = useState([]);
  const [inputText, setInputText] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [indexId, setIndexId] = useState(-1);

  const data = dataset[num];

  var time = 0;

  function handleClick(index, value) {
    markedWords.push(value);
    markedWordsId.push(index);

    if (markedWords.length >= 3) {
      setRed(true);
      setEnabled(true);
      setIndexId(index);
    }

    setMarkedWord(value);
  }

  function handleTimer(et) {
    time = et;
  }

  const handleChange = (e) => {
    var val = e.target.value;
    setInputText(val);
  };

  function onSubmit() {
    setIsPlaying(false);
    let dataOut = {
      id: data.id,
      markedWords: markedWords,
      inputText: inputText,
      timeSpent: time,
    };

    console.log("Data Out : ", dataOut);
  }

  function onRestart() {
    window.location.reload(false);
  }

  return (
    <div className="App">
      <Card className="card">
        <CardContent>
          {data.sentence.split(" ").map(function (char, index) {
            return (
              <Button
                className="buttonText"
                value={(char, index)}
                key={index}
                onClick={() => handleClick(index, char)}
                disabled={enabled}
              >
                {markedWordsId.includes(index) ? (
                  <span style={{ color: "red" }}>{char}</span>
                ) : (
                  <span style={{ color: "black" }}>{char}</span>
                )}
              </Button>
            );
          })}
          <div className="cardContent">
            <div className="CardContentLeft">
              <textarea
                className="form-control"
                id="Textarea"
                placeholder="Insert your thoughts"
                style={{ minWidth: 250 }}
                onChange={handleChange}
                disabled={!isPlaying}
                rows="8"
              />
            </div>
            <div className="CardContentRight">
              <CountdownCircleTimer
                onComplete={() => {
                  // do your stuff here
                  setEnabled(true);
                  return [false, 0]; // repeat if true animation in 1.5
                }}
                isPlaying={isPlaying}
                duration={data.timer}
                size={130}
                colors={[
                  ["#004777", 0.33],
                  ["#F7B801", 0.33],
                  ["#A30000", 0.33],
                ]}
                renderAriaTime={({ remainingTime, elapsedTime }) =>
                  handleTimer(elapsedTime)
                }
              >
                {({ remainingTime }) => remainingTime}
              </CountdownCircleTimer>
            </div>
          </div>
        </CardContent>
        <CardActions className="buttonContainer">
          <Button onClick={() => onSubmit()}>submit</Button>
          <Button onClick={() => onRestart()}>Shuffle and Restart</Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default App;
