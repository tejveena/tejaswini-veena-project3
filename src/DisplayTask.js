
import React from 'react';
import firebase from './firebase';
import { useState } from 'react';

function DisplayTask(props) {
  console.log("in DisplayTask component");
  console.log(props);

  const [addNewNoteFlag, setAddNewNoteFlag] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  const currentTimestamp = () => {
    // const unixTime = Date.now();
    const milliseconds = Date.now();
    const dateObject = new Date(milliseconds);
    const localDateFormat = dateObject.toLocaleString('en-US');
    return localDateFormat;
  }
  const handleNewNoteClick = () => {
    setAddNewNoteFlag(true);
  }
  const handleChangeTextarea = (event) => {
    // console.log(event.target.value);
    setNoteContent(event.target.value);
  }
 
  const handleNoteSave = (event) => {
    event.preventDefault();
    // updating the database with new note
    // https://tasksfirebase-c494d-default-rtdb.firebaseio.com/tasks/task1/notes/note1
    const dbRef = firebase.database().ref();
    const noteKey = props.notes ? `note${Object.keys(props.notes).length + 1}` : `note1`;
    const path = `tasks/${props.task}/notes/${noteKey}`;
    console.log(path);
    const dbRefInsertNotes = firebase.database().ref(`${path}`);
    dbRefInsertNotes.set({ 'content': noteContent, 'timestamp': currentTimestamp() });
    setNoteContent('');
    props.noteAdded();

    // win: getting the path to update
  }

  return (
    <div>
      <section className="display-task">
        <h3>{props.taskName} notes</h3>
        
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
            // win: iterating correctly through the objects using map
          }
          
        </div>
        <button onClick={handleNewNoteClick}>write new note</button>
        {
          addNewNoteFlag ?
            <section className="new-note">
              {/* <p>{currentTimestamp()}</p> */}
              <p>Where are you at in your task? Save it</p>
              <form id="note">
                <label className="sr-only" htmlFor="note">Add your note here</label>
                {/* <input type="textarea" name="note" onChange={handleChangeTextarea} /> */}
                <textarea name="note" onChange={handleChangeTextarea} value={ noteContent} />
                <button type="submit" onClick={ handleNoteSave}>Save</button>
              </form>
            </section>
            : null
        }
      </section>
    </div>
  )
}

export default DisplayTask
