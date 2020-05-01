import React from "react";
import "./Joke.css";

/** A single joke, along with vote up/down buttons. */

// class Joke extends Component {
// render() {
function Joke({ id, vote, votes, text, clear, toggleLock, locked }) {
  // const { id, vote, votes, text } = this.props;

  return (
    <div className="Joke">
      <div className="Joke-votearea">
        <button onClick={(evt) => vote(id, +1)}>
          <i className="fas fa-thumbs-up" />
        </button>

        <button onClick={(evt) => vote(id, -1)}>
          <i className="fas fa-thumbs-down" />
        </button>

        <button onClick={(evt) => clear(id)}>
          <i className="fas fa-undo" />
        </button>

        <button onClick={(evt) => toggleLock(id)}>
          {locked ? (
            <i className="fas fa-lock" />
          ) : (
            <i className="fas fa-lock-open" />
          )}
        </button>

        {votes}
      </div>

      <div className="Joke-text">{text}</div>
    </div>
  );
}
// }
// }

export default Joke;
