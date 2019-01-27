import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { DOMParser } from "prosemirror-model";
import { baseKeymap, toggleMark } from "prosemirror-commands";
import { undo, redo, history } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { findWrapping } from "prosemirror-transform";

import schema from "./schema";
import shortcutPlugin from "./shortcuts";

import "./index.css";

const editorElement = document.querySelector("#editor");
const contentElement = document.querySelector("#content");

function makeNoteGroup(state, dispatch) {
  let range = state.selection.$from.blockRange(state.selection.$to);
  let wrapping = findWrapping(range, schema.nodes.notegroup);

  if (!wrapping) {
    return false;
  }

  if (dispatch) {
    dispatch(state.tr.wrap(range, wrapping).scrollIntoView());
  }

  return true;
}

function makeNoteGroup2(state, dispatch) {
  let range = state.selection.$from.blockRange(state.selection.$to);

  console.log(range);

  // let tr = new Transform(myDoc);
  // tr.delete(5, 7); // Delete between position 5 and 7
  // tr.split(5); // Split the parent node at position 5
  // console.log(tr.doc.toString()); // The modified document
  // console.log(tr.steps.length); // → 2
  /*
  // Get a range around the selected blocks
  let range = state.selection.$from.blockRange(state.selection.$to);
  // See if it is possible to wrap that range in a note group
  console.log(range); //, schema.nodes.notegroup);

  // Otherwise, dispatch a transaction, using the `wrap` method to
  // create the step that does the actual wrapping.
  if (dispatch) {
    const note = schema.nodes.note.create(null);
    //, schema.nodes.text(null, "foo"));
    dispatch(
      state.tr
        //.wrap(range, wrapping)
        .replaceSelectionWith(note)
        .scrollIntoView()
    );
    // dispatch(state.tr.replaceSelectionWith(note));
  }
  */
  return true;
}

let doc = DOMParser.fromSchema(schema).parse(contentElement);

let state = EditorState.create({
  doc,
  plugins: [
    shortcutPlugin(schema),
    keymap({
      "Mod-z": undo,
      "Mod-y": redo,
      "Ctrl-d": makeNoteGroup,
      "Ctrl-t": makeNoteGroup2,
      "Ctrl-1": toggleMark(schema.marks.bold)
    }),
    keymap(baseKeymap),
    history()
  ]
});

let view = new EditorView(editorElement, {
  state,
  dispatchTransaction(transaction) {
    //  console.log("!!!", transaction);
    let state = view.state.apply(transaction);
    view.updateState(state);
  }
});
