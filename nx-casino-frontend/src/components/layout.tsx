import React from "react";
import { Header } from "./header";

export const Layout = ({ children }: React.PropsWithChildren<unknown>) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};
