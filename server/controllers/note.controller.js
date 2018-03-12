import Note from "../models/note";
import Lane from "../models/lane";
import uuid from "uuid";

import omit from "lodash/omit";

export function getSomething(req, res) {
  return res.status(200).end();
}

export function addNote(req, res) {
  const { note, laneId } = req.body;

  if (!note || !note.task || !laneId) {
    return res.status(400).end();
  }

  const newNote = new Note({
    task: note.task
  });

  newNote.id = uuid();
  newNote.save((err, savedNote) => {
    if (err) {
      res.status(500).send(err);
    }
    Lane.findOne({ id: laneId }).then(lane => {
      console.log(savedNote);
      lane.notes.push(savedNote);
      return lane.save((err, savedLane) => {
        if (err) {
          res.status(500).send(err);
        }
      });
    });
    res.json(savedNote);
  });
}

export function deleteNote(req, res) {
  Note.findOne({ id: req.params.noteId }).exec((err, note) => {
    if (err) {
      res.status(500).send(err);
    }

    note.remove(() => {
      res.status(200).end();
    });
  });
}

export function editNote(req, res) {
	if (!req.body.task) {
		res.status(400).end();
	}

	Note.findOne({ id: req.params.noteId }).exec((err, note) => {
		if (err) {
			res.status(500).send(err);
		}
		note.update({ task: req.body.task }, (updateErr) => {
			if (updateErr) {
				res.status(500).send(err);
			}
			res.status(200).end();
		});
	});
}