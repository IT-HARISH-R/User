import React from "react";
import Menu from "./Menu";

const Layout = ({ children }) => {
  return (
    <>
      <Menu />
      <div className="pt-16">{children}</div> {/* Pushes all content below navbar */}
    </>
  );
};

export default Layout;
