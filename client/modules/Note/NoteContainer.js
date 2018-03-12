import { connect } from 'react-redux';
import Notes from './Notes';

import { deleteNoteRequest, editNote, updateNoteRequest, moveWithinLane } from '../Note/NoteActions';

const mapDispatchToProps = {
  editNote: editNote,
  updateNote: updateNoteRequest,
  onDelete: deleteNoteRequest,
  moveWithinLane,
};


export default connect(
  null,
  mapDispatchToProps
)(Notes);