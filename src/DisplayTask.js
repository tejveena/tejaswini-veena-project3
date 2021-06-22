
import React from 'react'

function DisplayTask(props) {
  console.log("in DisplayTask component");
  console.log(props);

  return (
    <div>
      <section className="display-task">
        <h3>{ props.taskName}</h3>
        <button>➕ New Note</button>
        <div className="note-list">
          {
            props.notes ?
            Object.keys(props.notes).map((note) => {
              console.log(props.notes[note].content);
              return (
                <div>
                  <p>{props.notes[note].timestamp}</p>
                  <p>{props.notes[note].content}</p>
                </div>
              )
            })
              : null
           
          }
        </div>
      </section>
    </div>
  )
}

export default DisplayTask
