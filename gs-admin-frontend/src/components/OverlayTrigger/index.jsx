import React from "react";
import { OverlayTrigger, Tooltip } from "@themesberg/react-bootstrap";

const Trigger = ({ message, children }) => {
  return (
    <OverlayTrigger
      placement="bottom"
      delay={{ show: 100, hide: 200 }}
      overlay={<Tooltip>{message}</Tooltip>}
    >
      {children}
    </OverlayTrigger>
  );
};

export default Trigger;
