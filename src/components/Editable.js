import React from "react";

const Editable = ({ updateValue, value, name }) => {
  return (
    <input
      name={name}
      type="text"
      size="mini"
      value={value}
      onChange={updateValue}
    />
  );
};

export default Editable;
