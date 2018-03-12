// Import Actions
import { CREATE_LANE, UPDATE_LANE, DELETE_LANE, EDIT_LANE, CREATE_LANES, MOVE_BETWEEN_LANES, REMOVE_FROM_LANE, PUSH_TO_LANE } from './LaneActions';
import { CREATE_NOTE, DELETE_NOTE, MOVE_WITHIN_LANE } from "../Note/NoteActions";

import omit from 'lodash/omit';
// Initial State
const initialState = {};

const lanes = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_LANE:
    case UPDATE_LANE:
      return {...state, [action.lane.id]: action.lane }; 

    case EDIT_LANE: {
      const lane = { ...state[action.id], editing: true };
      return { ...state, [action.id]: lane };
    }  

    case CREATE_LANES: 
      return { ...state, ...action.lanes };


    case DELETE_LANE:
      return omit(state, action.laneId); 

    case CREATE_NOTE: {
      const newLane = { ...state[action.laneId] };
      newLane.notes = newLane.notes.concat(action.note.id);

      return { ...state, [action.laneId]: newLane };
    }
      
    case DELETE_NOTE: {
      const newLane = { ...state[action.laneId] };
      newLane.notes = newLane.notes.filter(noteId => noteId !== action.noteId);

      return { ...state, [action.laneId]: newLane };
    }

    case MOVE_WITHIN_LANE: {
      const newLane = {...state[action.laneId] };
      newLane.notes = moveNotes(newLane.notes, action.sourceId, action.targetId);

      return { ...state, [action.laneId]: newLane};
    }

    case MOVE_BETWEEN_LANES: {
      const targetLane = { ...state[action.targetLaneId] };
      targetLane.notes = [...targetLane.notes, action.noteId];

      const sourceLane = { ...state[action.sourceLaneId] };
      sourceLane.notes = sourceLane.notes.filter(noteId => noteId !== action.noteId);

      return { ...state, [action.targetLaneId]: targetLane, [action.sourceLaneId]: sourceLane};
    }

    case REMOVE_FROM_LANE: {
      const sourceLane = { ...state[action.sourceLaneId] };
      sourceLane.notes = sourceLane.notes.filter(noteId => noteId !== action.noteId);

      return { ...state, [action.sourceLaneId]: sourceLane};
    }

    case PUSH_TO_LANE: {
      const targetLane = { ...state[action.targetLaneId] };
      targetLane.notes = [...targetLane.notes, action.noteId];

      return { ...state, [action.targetLaneId]: targetLane };
    }

    default:
      return state;
  }
};

function moveNotes(array, sourceNoteId, targetNoteId) {
  const sourceIndex = array.indexOf(sourceNoteId);
  const targetIndex = array.indexOf(targetNoteId);
  const arrayCopy = [...array];

  arrayCopy.splice(targetIndex, 0, arrayCopy.splice(sourceIndex, 1)[0])
  return arrayCopy;
}
  
export default lanes;