import { Plugin, TextSelection } from "prosemirror-state";

let plugin = schema =>
  new Plugin({
    props: {
      handleKeyDown(view, event) {
        if (event.code === "Space") {
          //
        }

        const state = view.state;

        console.log(state.selection);

        // state.tr.setSelection(TextSelection.create(state.tr.doc, 0));
        // console.log("A key was pressed!", event, view);
        return false;
      }
    }
  });

export default plugin;
