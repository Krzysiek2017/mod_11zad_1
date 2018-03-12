import { connect } from "react-redux";
import * as laneActions from './LaneActions';
import { createNoteRequest } from "../Note/NoteActions";
import Lane from './Lane';
import { updateLaneRequest, deleteLaneRequest, moveBetweenLanes, removeFromLane, pushToLane, changeLanesRequest } from "./LaneActions";
import { compose } from "redux";
import { DropTarget } from "react-dnd";
import ItemTypes from '../Kanban/itemTypes';
import callApi from '../../util/apiCaller';

const mapStateToProps = (state, ownProps) => {
  return {
    laneNotes: ownProps.lane.notes.map(noteId => {
      return { ...state.notes[noteId] }
    })
  };
};

const noteTarget = {

  drop(targetProps, monitor) {
    const sourceProps = monitor.getItem();
    const { id: noteId, laneId: sourceLaneId, _id: note_id} = sourceProps;

    
    if (targetProps.lane.id !== sourceLaneId) {

      const newTargetNotes = targetProps.laneNotes.map(note => note._id)
      newTargetNotes.push(note_id);
      
      targetProps.changeLanesRequest(sourceLaneId, targetProps.lane.id, noteId, newTargetNotes);

    
    } else {

      const notes = targetProps.laneNotes.map(note => note._id)

      callApi('lanes','put', {id: sourceLaneId, notes: notes})
    }

  },
}

const mapDispatchToProps = {
  ...laneActions,
  addNote: createNoteRequest,
  updateLane: updateLaneRequest,
  deleteLane: deleteLaneRequest,
  moveBetweenLanes,
  removeFromLane,
  pushToLane,
  changeLanesRequest,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  DropTarget(ItemTypes.NOTE, noteTarget, (dragConnect) => ({
    connectDropTarget: dragConnect.dropTarget()
  }))
)(Lane);
