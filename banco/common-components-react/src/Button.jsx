import React from "react";
import "common-resources/scss/main.scss";

const Button = ({ children, className = "", ...props }) => (
  <button className={`btn ${className}`} {...props}>
    {children}
  </button>
);

export default Button;
