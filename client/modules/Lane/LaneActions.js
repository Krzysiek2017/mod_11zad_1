import callApi from '../../util/apiCaller';

import { lanes } from '../../util/schema';
import { normalize } from 'normalizr';

import { createNotesRequest, createNotes, deleteNote } from "../Note/NoteActions";

// Export Constants
export const CREATE_LANE = 'CREATE_LANE';
export const UPDATE_LANE = 'UPDATE_LANE';
export const EDIT_LANE = 'EDIT_LANE';
export const DELETE_LANE = 'DELETE_LANE';
export const CREATE_LANES = 'CREATE_LANES';
export const CREATE_NOTE = 'CREATE_NOTE';
export const MOVE_BETWEEN_LANES = 'MOVE_BETWEEN_LANES';

// Export Actions
export function createLane(lane) {
  return {
    type: CREATE_LANE,
    lane: {
      ...lane,
    }
  };
}

export function createLaneRequest(lane) {
  return (dispatch) => {
    return callApi('lanes', 'post', lane).then(res => {
      dispatch(createLane(res));
    });
  };
};

export function updateLane(lane) {
  return {
    type: UPDATE_LANE,
    lane,
  }
}

export function updateLaneRequest(lane) {
  return (dispatch) => {
    return callApi('lanes', 'put', {id: lane.id, name: lane.name}).then(laneResp => {
      dispatch(updateLane(lane));
    })
  }
}

export function editLane(laneId) {
  return {
    type: EDIT_LANE,
    id: laneId,
  };
}

export function deleteLane(laneId) {
  return {
    type: DELETE_LANE,
    laneId
  };
}

export function deleteLaneRequest(lane) {
  return(dispatch) => {
    Promise.all(lane.notes.map(noteId => callApi(`notes/${noteId}`, 'delete')))
    .then(() => {
      callApi(`lanes/${lane.id}`, 'delete')
        .then( () => {
          dispatch(deleteLane(lane.id));
        })
    } )
  }
}

export function createLanes(lanesData) {
  return {
    type: CREATE_LANES,
    lanes: lanesData,
  };
}

export function  fetchLanes() {
  return (dispatch) => {
    return callApi('lanes').then(res => {
      const normalized = normalize(res.lanes, lanes);
      const {lanes: normalizedLanes, notes} = normalized.entities;
      dispatch(createLanes(normalizedLanes));
      dispatch(createNotes(notes))
    })
  }
}

export function moveBetweenLanes(targetLaneId, noteId, sourceLaneId) {
  return {
    type: MOVE_BETWEEN_LANES,
    targetLaneId,
    noteId,
    sourceLaneId,
  }
}

export function changeLanesRequest(sourceLaneId, targetLaneId, noteId) {
  return (dispatch) => {
    return callApi(`notes/${noteId}`, 'delete')
      .then((res) => {
        console.log(res)
        callApi('notes', 'post', { laneId: targetLaneId, note: res })
      })
      .then(() => {
        dispatch(removeFromLane(
          sourceLaneId,
          noteId,
        ));
        dispatch(pushToLane(
          targetLaneId,
          noteId,
        ));
      }
    )
  }
}