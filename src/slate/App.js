import React from "react";

import Editor from "./editor";
import terms from "./terms";
import defaultValue from "./defaultValue";

const App = () => (
  <Editor
    label="Consultation Notes"
    options={terms}
    defaultValue={defaultValue}
  />
);

export default App;
