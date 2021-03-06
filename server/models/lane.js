import mongoose from "mongoose";
import Note from '../models/note'
const Schema = mongoose.Schema;
mongoose.plugin(schema => {
  schema.options.usePushEach = true;
});

const laneSchema = new Schema({
  name: { type: "String", required: true },
  notes: [{ type: Schema.ObjectId, ref: "Note", required: true }],
  id: { type: "String", required: true, unique: true }
});

function populateNotes(next) {
  this.populate("notes");
  next();
}

function removeNotes(next) {
  const notes = this.notes;
  notes.forEach(element => {
    Note.findAndRemove(element._id).exec();
  });
  next();
}

laneSchema.pre("find", populateNotes);
laneSchema.pre("findOne", populateNotes);
laneSchema.pre("remove", removeNotes);

export default mongoose.model("Lane", laneSchema);
