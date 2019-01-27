import React from "react";

const TermList = ({ terms }) => {
  return (
    <div className="term-list">
      <table>
        <tbody>
          {terms.map(term => (
            <tr key={term.code}>
              <td>
                <b>@{term.code}</b>
              </td>
              <td>{term.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TermList;
