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
  // let taskInFocusObject = {};
  let randomVariable = "somestring";


  const handleChange = (event) => {
    setUserInput(event.target.value);
    // console.log(event.target.value);
  }
  const handleClick = (event) => {
    event.preventDefault();
    // updating the database with new task name, below is the db reference url
    // but the task keys have to be changed when the delete feature is added
    // https://tasksfirebase-c494d-default-rtdb.firebaseio.com/tasks/task1/taskName
    const taskKey = `task${tasksList.length + 1}`;
    const dbRef = firebase.database().ref(`tasks/${taskKey}`);
    // here we grab whatever value this.state.userInput has and push it to the database
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
      // console.log("on mount "+ JSON.stringify(tasksWnotes));
      
    })
  }, [])

  // To get all the notes within the task in focus
  useEffect(() => {
    // console.log("on mount and dependencies: " + JSON.stringify(tasksWnotes));
      for (const task in tasksWnotes) {
        if (tasksWnotes[task].taskName === taskInFocus) {        
          setTaskInFocusObject({ ...tasksWnotes[task], task:task });
          break;
        }
      }


  },[taskInFocus])

  // console.log("taskInFocusObject outside "+ JSON.stringify(taskInFocusObject.taskName));

 

  return (
    <header class="wrapper">
      <h1>Mindful Multitasking</h1>
      <h2>Save your task context in a note</h2>
      
      <section className="task-list">
        <h3>Existing Task List</h3>
        <ul>
          {
            tasksList.map((task) => {
              return (
                <li >
                  <a style={{cursor: 'pointer'}} onClick={handleTaskLinkClick} >
                    {task}
                  </a>
                </li>
              )
            })
          }
        </ul>
      </section>
      <section className="new-task">
        <form>
          <label htmlFor="create-task">New Task : </label>
          <input type="text" name="create-task" id="create-task" onChange={handleChange} value={userInput} />

          <button onClick={handleClick}>+</button>
        </form>
        {/* <p> {JSON.stringify(taskInFocusObject.taskName)}{ randomVariable}asdf</p> */}
      </section>
      {/* Display the task page with option to add notes to it */}
      {
        taskInFocus ? <DisplayTask {...taskInFocusObject} /> : null
      }
      

    </header>
  );
}

export default App;
