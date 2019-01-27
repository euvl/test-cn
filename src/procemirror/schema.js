import { Schema } from "prosemirror-model";

const schema = new Schema({
  marks: {
    bold: {
      toDOM() {
        return ["bold", 0];
      },
      parseDOM: [{ tag: "bold" }]
    }
  },
  nodes: {
    text: {
      //  group: "inline"
    },
    /*
    clinical_code: {
      content: "text*",
      inline: true,
      toDOM() {
        return ["clinical_code", 0];
      },
      parseDOM: [{ tag: "clinical_code" }]
    },*/
    text_line: {
      content: "(text)*",
      group: "block",
      toDOM() {
        return ["text_line", 0];
      },
      parseDOM: [{ tag: "text_line" }]
    },
    /*
    heading: {
      content: "text*",
      group: "block",
      marks: "_",
      toDOM() {
        return ["heading", 0];
      },
      parseDOM: [{ tag: "heading" }]
    },
    */
    notegroup: {
      content: "(text_line)+",
      group: "block",
      toDOM() {
        return ["notegroup", 0];
      },
      parseDOM: [{ tag: "notegroup" }]
    },
    doc: {
      content: "(text_line | notegroup)+"
    }
  }
});

export default schema;
