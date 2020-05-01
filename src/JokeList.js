import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */
function JokeList({ numJokesToGet = 5 }) {
  let jokesArr = [];
  let localJokes = JSON.parse(localStorage.getItem("jokes"));

  if (localJokes && localJokes.length) {
    jokesArr = localJokes;
    // console.log("localJokes is", localJokes);
    // console.log("isLoading should be", jokesArr.length !== 0);
  }

  const [jokes, setJokes] = useState(jokesArr);
  const [getNew, setGetNew] = useState(false);
  const [isLoading, setIsLoading] = useState(jokesArr.length === 0);
  console.log("getNew", getNew);
  useEffect(
    function getJokesApi() {
      async function getJokes() {
        // console.log("RERENDER");
        try {
          // load jokes one at a time, adding not-yet-seen jokes
          let newJokes = [];
          let seenJokes = new Set();

          // let localJokes = localStorage.getItem("jokes");
          // if (localJokes.length) {
          //   console.log("localJokes is", localJokes);
          //   jokes = JSON.parse(localJokes);
          // } else {
          while (newJokes.length < numJokesToGet) {
            let res = await axios.get("https://icanhazdadjoke.com", {
              headers: { Accept: "application/json" },
            });
            let { ...joke } = res.data;

            if (!seenJokes.has(joke.id)) {
              seenJokes.add(joke.id);
              newJokes.push({ ...joke, votes: 0, locked: false });
            } else {
              console.log("duplicate found!");
            }
          }
          // }

          setIsLoading(false);
          console.log("JOKES ARE NOW", [...jokes, ...newJokes]);
          setGetNew(false);
          setJokes((oldJokes) => [...oldJokes, ...newJokes]);
          localStorage.setItem("jokes", JSON.stringify(jokes));
        } catch (err) {
          console.error(err);
        }
      }
      if (!jokes.length || getNew) getJokes();
    },
    [jokes, numJokesToGet, getNew]
  );

  /* empty joke list, set to loading state, and then call getJokes */

  function generateNewJokes() {
    setIsLoading(true);
    let lockedJokes = jokes.filter((j) => j.locked);
    console.log("lockedJokes", lockedJokes);
    setJokes((oldJokes) => [...lockedJokes]);
    setGetNew(true);
  }

  /* change vote for this id by delta (+1 or -1) */

  function vote(id, delta) {
    let newJokes = jokes.map((j) =>
      j.id === id ? { ...j, votes: j.votes + delta } : j
    );
    setJokes((oldJokes) =>
      oldJokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
    localStorage.setItem("jokes", JSON.stringify(newJokes));
  }

  /* clear vote for this id (set to 0) */

  function clear(id) {
    let newJokes = jokes.map((j) => (j.id === id ? { ...j, votes: 0 } : j));
    setJokes((oldJokes) =>
      oldJokes.map((j) => (j.id === id ? { ...j, votes: 0 } : j))
    );
    localStorage.setItem("jokes", JSON.stringify(newJokes));
  }

  /* toggle lock on joke (whether or not to keep this joke on getting new jokes) */
  function toggleLock(id) {
    let newJokes = jokes.map((j) =>
      j.id === id ? { ...j, locked: !j.locked } : j
    );
    setJokes((oldJokes) =>
      oldJokes.map((j) => (j.id === id ? { ...j, locked: !j.locked } : j))
    );
    localStorage.setItem("jokes", JSON.stringify(newJokes));
  }

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);
  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }

  return (
    <div className="JokeList">
      <button className="JokeList-getmore" onClick={generateNewJokes}>
        Get New Jokes
      </button>

      {sortedJokes.map((j) => (
        <Joke
          text={j.joke}
          key={j.id}
          id={j.id}
          votes={j.votes}
          vote={vote}
          clear={clear}
          toggleLock={toggleLock}
          locked={j.locked}
        />
      ))}
    </div>
  );
}

export default JokeList;
