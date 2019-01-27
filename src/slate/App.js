import React from "react";

import Editor from "./editor";
import terms from "./terms";
import defaultValue from "./defaultValue";

const App = () =>
  window.location.search === "?v2" ? (
    <div>
      <Editor
        label="History"
        options={[
          {
            code: "pmh",
            text: "Past Medical History"
          },
          {
            code: "med",
            text: "Medication History"
          },
          {
            code: "all",
            text: "Allergies"
          },
          {
            code: "fam",
            text: "Family History"
          },
          {
            code: "soc",
            text: "Social History"
          }
        ]}
        defaultValue={defaultValue}
      />
      <br />
      <Editor label="Examination" type="simple" />
      <br />
      <Editor label="Diagnosis" type="simple" />
      <br />
      <Editor
        label="Plan"
        options={[
          {
            code: "adv",
            text: "Advice"
          },
          {
            code: "saf",
            text: "Safety Netting"
          }
        ]}
        defaultValue={defaultValue}
      />
    </div>
  ) : (
    <Editor
      label="Consultation Notes"
      options={terms}
      defaultValue={defaultValue}
    />
  );

export default App;
