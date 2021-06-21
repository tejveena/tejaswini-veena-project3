// import logo from './logo.svg';
import './App.css';
import firebase from './firebase';

import { useState, useEffect } from 'react';

function App() {
  const [tasksList, setTaskList] = useState([]);
  const [userInput, setUserInput] = useState('');
  const handleChange = (event) => {
    setUserInput(event.target.value);
    console.log(event.target.value);
  }
  const handleClick = (event) => {
    event.preventDefault();
  
    // https://tasksfirebase-c494d-default-rtdb.firebaseio.com/tasks/task1/taskName
    const dbRef = firebase.database().ref(`tasks/task${tasksList.length + 1}`);
  
    // here we grab whatever value this.state.userInput has and push it to the database
    dbRef.set({ 'taskName': userInput });

  
    // here we reset the state to an empty string
    setUserInput('');
  }

  useEffect(() => {
    // Here we create a variable that holds a reference to our database
    const dbRef = firebase.database().ref();

    // Here we add an event listener to that variable that will fire
    // every time there is a change in the database.

    // This event listener takes a callback function which we will use to get our data
    // from the database, and call that data 'response'.
    dbRef.on('value', (response) => {

    // Here we use Firebase's .val() method to parse our database info the way we want it
      console.log(response.val());
      const newState = [];
      const data = response.val();
      let i = 1;
      for (let key in data.tasks) {

        // inside the loop, we push each book name to an array we already created inside the .on() function called newState
        newState.push(data.tasks[key].taskName);
        i++;
      }
    setTaskList(newState);


    })
  }, [])

  return (
    <div>
      <h1>Mindful Multitasking</h1>
      <h2>Save your task context in a note</h2>
      <h3>Task List</h3>
      
      <section className="task-list">
        <ul>
          {
            tasksList.map((task) => {
              return (
                <li>
                  <a href="">
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
          <label htmlFor="create-task">Create a new task: </label>
          <input type="text" name="create-task" id="create-task" onChange={handleChange} value={userInput} />
          <button onClick={handleClick}>create</button>
       </form>
      </section>
    </div>
  );
}

export default App;
