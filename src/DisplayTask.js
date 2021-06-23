
import React from 'react';
import firebase from './firebase';
import { useState } from 'react';

function DisplayTask(props) {
  console.log("in DisplayTask component");
  console.log(props);

 
  const [noteContent, setNoteContent] = useState('');

  const currentTimestamp = () => {
    // const unixTime = Date.now();
    const milliseconds = Date.now();
    const dateObject = new Date(milliseconds);
    const localDateFormat = dateObject.toLocaleString('en-US');
    return localDateFormat;
  }
 
  const handleChangeTextarea = (event) => {
    // console.log(event.target.value);
    setNoteContent(event.target.value);
  }
 
  const handleNoteSave = (event) => {
    event.preventDefault();
    // Error handling
    if (!noteContent) {
      return;
    } 
    // updating the database with new note
    // https://tasksfirebase-c494d-default-rtdb.firebaseio.com/tasks/task1/notes/note1
    const noteKey = props.notes ? `note${Object.keys(props.notes).length + 1}` : `note1`;
    const path = `tasks/${props.task}/notes/${noteKey}`;
    console.log(path);
    const dbRefInsertNotes = firebase.database().ref(`${path}`);
    dbRefInsertNotes.set({ 'content': noteContent, 'timestamp': currentTimestamp() });
    setNoteContent('');
    props.noteAdded();

    // learning: getting the reference path to add data 
  }

  return (
    <div className="wrapper">
      <section className="display-task">
        <h3>{props.taskName} notes</h3>
        
        <div className="note-list">
          {
            props.notes ?
            Object.keys(props.notes).map((note) => {
              // console.log(props.notes[note].content);
              return (
                <div className="note">
                  <p className="timestamp">{props.notes[note].timestamp}</p>
                  <p>{props.notes[note].content}</p>
                </div>
              )
            })
              : null
            // learning: iterating correctly through the objects using map
          }
          
        </div>
       
        
        <section className="new-note">
          <form id="note">
            <label className="sr-only" htmlFor="note">Add your note here</label>
            <textarea name="note" placeholder="Where are you at in your task? Save it" onChange={handleChangeTextarea} value={ noteContent} />
            <button type="submit" onClick={ handleNoteSave}>Save</button>
          </form>
        </section>
            
        
      </section>
    </div>
  )
}

export default DisplayTask
