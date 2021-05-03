import React, { useState, useEffect } from "react";
import "./App.css";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/",
  headers: {
    "access-control-allow-origin": "*",
    "Content-Type": "application/json",
  },
});

export const App = () => {
  const [enabled, setEnabled] = useState(false);
  const [markedWords, setMarkedWords] = useState([]);
  const [markedWordsId, setMarkedWordsId] = useState([]);
  const [inputText, setInputText] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const [data, setData] = useState({
    id: "",
    sentence: "",
    timer: 0,
  });

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    getData();
  }, [setData]);

  function getData() {
    api.get("question").then((res) => {
      let response = res.data;
      console.log(response);
      setData({
        id: response.id,
        sentence: response.sentence,
        timer: response.timer,
      });
    });
  }

  let time = 0;
  function handleTimer(et) {
    time = parseInt(et);
  }

  function handleClick(index, value) {
    if (!markedWords.includes(value)) {
      setMarkedWords([...markedWords, value]);
      setMarkedWordsId([...markedWordsId, index]);
    }
  }

  const handleChange = (e) => {
    var val = e.target.value;
    setInputText(val);
  };

  function onSubmit() {
    setIsPlaying(false);
    let randomUser = Math.floor(Math.random() * 3) + 1;
    let postBody = {
      id: data.id,
      markedWords: markedWords,
      inputText: inputText,
      timeSpent: time,
      userId: randomUser,
    };

    api.post("answered", JSON.stringify(postBody)).then((res) => {
      if (res.status === 200) console.log(res.data);
    });
  }

  function onRestart() {
    window.location.reload(false);
  }

  if (data.timer > 0) {
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
                    setEnabled(true);
                    setIsPlaying(false);
                    return [false, 0];
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
  } else {
    return (
      <div className="App">
        <Card className="card">
          <CardContent>
            <div>
              <h3>There is no data</h3>
            </div>
          </CardContent>
          <CardActions className="buttonContainer">
            <Button disabled={true} onClick={() => onSubmit()}>
              submit
            </Button>
            <Button onClick={() => onRestart()}>Shuffle and Restart</Button>
          </CardActions>
        </Card>
      </div>
    );
  }
};

export default App;
