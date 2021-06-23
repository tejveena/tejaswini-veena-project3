// import logo from './logo.svg';
import './App.css';
import firebase from './firebase';
import DisplayTask from './DisplayTask.js';

import { useState, useEffect } from 'react';

function App() {
  const [tasksList, setTaskList] = useState([]);
  const [tasksWnotes, setTasksWnotes] = useState();
  const [userInput, setUserInput] = useState('');
  const [taskInFocus, setTaskInFocus] = useState('');
  const [taskInFocusObject, setTaskInFocusObject] = useState();
  const [newNoteAdded, setNewNoteAdded] = useState(false);


  const handleChange = (event) => {
    setUserInput(event.target.value);
    // console.log(event.target.value);
  }
  const handleClick = (event) => {
    event.preventDefault();
    if (!userInput) {
      return;
    }
    // updating the database with new task name, below is the db reference url
    // Important: the task keys have to be changed when the delete feature is added
    // https://tasksfirebase-c494d-default-rtdb.firebaseio.com/tasks/task1/taskName
    const taskKey = `task${tasksList.length + 1}`;
    const dbRef = firebase.database().ref(`tasks/${taskKey}`);
    dbRef.set({ 'taskName': userInput });
    // here we reset the state to an empty string
    setUserInput('');
    setTaskInFocus(userInput);
  }

  const handleTaskLinkClick = (event) => {
    event.preventDefault();
    // console.log(event.target.text);
    setTaskInFocus(event.target.text);
  }

  const noteAdded = (flag) => {
    setNewNoteAdded(flag);
  }

  useEffect(() => {
    const dbRef = firebase.database().ref();
    dbRef.on('value', (response) => {
      console.log(response.val());
      const newState1 = [];
      const data = response.val();
      for (let key in data.tasks) {
        newState1.push(data.tasks[key].taskName);
      }
      setTaskList(newState1);
      setTasksWnotes(JSON.parse(JSON.stringify(data.tasks)));
      // win: doing a deep copy of the object because it is nested      
    })
  }, [])

  // To get all the notes within the task-in-focus
  useEffect(() => {
      for (const task in tasksWnotes) {
        if (tasksWnotes[task].taskName === taskInFocus) {        
          setTaskInFocusObject({ ...tasksWnotes[task], task: task });
          // win: Adding the task key as a property task: task
          break;
        }
      }
      // win: using dependency variables to re-render

  },[taskInFocus, tasksWnotes, newNoteAdded])


 

  return (
    <main class="wrapper">
      <div>

        <h1>Mindful Multitasking</h1>
        <h2>Keep track of completed items in your tasks</h2>
        <p>( Click on an Existing task to continue or Add a New task and take notes )
        </p>
      </div>
      <section className="task-list">
        {
          tasksList ?
          <>
          <h3>Existing Task List</h3>
            <ul>
            {
              tasksList.map((task) => {
                return (
                  <li >
                    <a href={ null} style={{cursor: 'pointer'}} onClick={handleTaskLinkClick} >
                      {task}
                    </a>
                  </li>
                )
              })
            }
            </ul>
            </>
            :
            <h3>Add a New Task to start</h3>
            // Edge case handling
        }
        
        
      </section>
      <section className="new-task">
        <form>
          <label htmlFor="create-task">New Task : </label>
          <input type="text" name="create-task" id="create-task" onChange={handleChange} value={userInput} />

          <button onClick={handleClick}>+</button>
        </form>
      </section>
      {/* Display the task page with option to add notes to it */}
      {
        taskInFocus ? <DisplayTask {...taskInFocusObject} noteAdded={ ()=>noteAdded(!newNoteAdded)}/> : null
      }
      {/* win : !newNoteAdded and child component updating state */}
      {/* win: correctly passing the props, using taskInFocusObject as a state rather than a global variable. The global variable was set in useEffect() which obviously was assigned only after the DisplayTask component was called, hence passing undefined as props, debugging ate a huge chunk of time*/}
      
      <footer>
        <p>Created at <a href="www.junocollege.com" class="footer-link">Juno College</a></p>
      </footer>

    </main>
  );
}

export default App;
