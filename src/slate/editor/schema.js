const schema = {
  document: {
    nodes: [{ type: "heading" }, { type: "paragraph" }],
    normalize: (editor, error) => {
      console.log(error);
      ////    if (error.code == "child_type_invalid") {
      //      editor.setNodeByKey(error.child.key, { type: "paragraph" });
      //    }
    }
  },
  blocks: {
    paragraph: {
      nodes: [
        {
          match: {
            object: "text"
          }
        }
      ]
    },
    heading: {
      nodes: [
        {
          match: {
            object: "text"
          }
        }
      ]
    }
  }
};

export default schema;
