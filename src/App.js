// import logo from './logo.svg';
import './App.css';
import firebase from './firebase';
import DisplayTask from './DisplayTask.js';

import { useState, useEffect } from 'react';
import { Link } from 'react-scroll';

function App() {
  const [tasksList, setTaskList] = useState([]);
  const [tasksWnotes, setTasksWnotes] = useState();
  const [userInput, setUserInput] = useState('');
  const [taskInFocus, setTaskInFocus] = useState('');
  const [taskInFocusObject, setTaskInFocusObject] = useState();
  const [newNoteAdded, setNewNoteAdded] = useState(false);
  const [deleteTask, setDeleteTask] = useState(false);



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
    // const taskKey = `task${tasksList.length + 1}`;
    // const dbRef = firebase.database().ref(`tasks/${taskKey}`);
    // dbRef.set({ 'taskName': userInput });
    const dbRef = firebase.database().ref('tasks/');
    dbRef.push({ 'taskName': userInput });
    // here we reset the state to an empty string
    setUserInput('');
    setTaskInFocus(userInput);
  }

  const handleTaskLinkClick = (event) => {
    event.preventDefault();
    // console.log(event.target.textContent);
    setTaskInFocus(event.target.textContent);
  }

  const noteAdded = (flag) => {
    setNewNoteAdded(flag);
  }
  const removeTask = (flag) => {
    setDeleteTask(flag);
    // To trigger re-rendering
    setTaskInFocus('');
  }

  useEffect(() => {
    const dbRef = firebase.database().ref();
    dbRef.on('value', (response) => {
      // console.log(response.val());
      const newState1 = [];
      const data = response.val();
      if (data) {
        for (let key in data.tasks) {
          newState1.push(data.tasks[key].taskName);
        }
        setTaskList(newState1);
        setTasksWnotes(JSON.parse(JSON.stringify(data.tasks)));
        // learning: doing a deep copy of the object because it is nested   
      } else {
        // When all tasks are deleted
        setTaskList([]);
      }
         
    })
  }, [deleteTask])

  // To get all the notes within the task-in-focus
  useEffect(() => {
      for (const task in tasksWnotes) {
        if (tasksWnotes[task].taskName === taskInFocus) {        
          setTaskInFocusObject({ ...tasksWnotes[task], task: task });
          // learning: Adding the task key as a property task: task
          break;
        }
      }
      // learning: using dependency variables to re-render

  },[taskInFocus, tasksWnotes, newNoteAdded])


 

  return (
    <main className="wrapper">
      <div>

        <h1>Mindful Multitasking</h1>
        <h2>This app can be used to take notes chronologically about an ongoing task. Current task context can be saved before taking a break and referred to before resuming it. Such notes can be maintained for multiple tasks at hand so that switching between tasks is efficient</h2>
        <p>( Click on an Existing task to continue or Add a New task and take notes )
        </p>
      </div>
      <section className="task-list">
        {
          tasksList.length > 0 ?
          <>
          <h3>Existing Task List</h3>
            <ul>
            {
              tasksList.map((task,i) => {
                return (
                  <li key={ i }>
                    <Link to="task-head" spy={true} smooth={true} onClick={handleTaskLinkClick} >
                      {task}
                    </Link>
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

          <Link to="task-head" spy={true} smooth={true} onClick={handleClick}>Click</Link>
          {/* learning: used react-scroll */}
        </form>
      </section>
      {/* Display the task page with option to add notes to it */}
      <div id="task-head"></div>
      {
        taskInFocus ? <DisplayTask {...taskInFocusObject} noteAdded={() => noteAdded(!newNoteAdded)} removeTask={() => removeTask(!deleteTask)}/> : null
      }
      {/* learning : !newNoteAdded and child component updating state */}
      {/* learning: correctly passing the props, using taskInFocusObject as a state rather than a global variable. The global variable was set in useEffect() which obviously was assigned only after the DisplayTask component was called, hence passing undefined as props, debugging ate a huge chunk of time*/}
      
      <footer>
        <p>Created at <a href="www.junocollege.com" className="footer-link">Juno College</a></p>
      </footer>

    </main>
  );
}

export default App;
