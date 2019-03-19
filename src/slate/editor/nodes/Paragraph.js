import React from "react";

const Paragraph = ({ children, ...props }) => {
  return <p {...props}>{children}</p>;
};

export default Paragraph;
