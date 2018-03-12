import React, { PropTypes } from 'react';
import NotesContainer from '../Note/NotesContainer.js';
// Import Style
import styles from './Lane.css';

import Edit from '../../components/Edit';


class Lane extends React.Component {
  render() {  
    const { connectDropTarget, lane, laneNotes, updateLane, addNote, deleteLane, editLane } = this.props;
    const laneId = lane.id;

    return connectDropTarget(
      <div className={styles.Lane}>
        <div className={styles.LaneHeader}>
          <Edit 
            className={styles.LaneName}
            editing={lane.editing}
            value={lane.name}
            onValueClick={() => editLane(laneId)}
            onUpdate={name => updateLane({...lane, name, editing: false})}
          />
          <div className={styles.LaneAddNote}>
            <button onClick={() => addNote({task: 'New Note'}, laneId)}>Add Note</button>
          </div>
          <div className={styles.LaneDelete}>
            <button onClick={() => deleteLane(lane)}>Remove Lane</button>
          </div>
        </div>
        <NotesContainer
          notes={laneNotes}
          laneId={laneId}
        />
      </div>
    );
  };
}

Lane.propTypes = {
  lane: PropTypes.object,
  laneNotes: PropTypes.array,
  addNote: PropTypes.func,
  updateLane: PropTypes.func,
  deleteLane: PropTypes.func,
  editLane: PropTypes.func,
};

export default Lane;
