import React from 'react'

function DisplayTask() {
  return (
    <div>
      <section className="display-task">
        <h3>replace with props</h3>
        <button>➕ New Note</button>
        <div className="note-list">
          {/* map through notes list and display, or don't display anything, useeffect to display default on mount */}
          <ul>
            <li>

            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}

export default DisplayTask
