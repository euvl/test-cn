import React from "react";

const Heading = ({ children, ...props }) => {
  /**
   * TODO: Add "remove" button
   */
  return <h2 {...props}>{children}</h2>;
};

export default Heading;
