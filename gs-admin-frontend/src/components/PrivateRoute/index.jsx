import { Card } from "@themesberg/react-bootstrap";
import React from "react";
import Header from "../Header";
import RouteWithSidebar from "../RouteWithSidebar";
import usePrivateRoute from "./usePrivateRoute";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { CommonRoutes } from "../../routes";

const PrivateRoute = ({
  isWithoutCard = false,
  children,
  isWithoutHeader = false,
  module,
}) => {
  const { accessToken, loading } = usePrivateRoute();
  const { adminPermissions } = useSelector((state) => state.admins);

  return (
    accessToken &&
    !loading &&
    adminPermissions &&
    (!module ||
    adminPermissions[Object.keys(module)?.[0]]?.includes(
      module[Object.keys(module)?.[0]]
    ) ? (
      <RouteWithSidebar key={children}>
        {isWithoutCard ? children : <Card className="p-2">{children}</Card>}
      </RouteWithSidebar>
    ) : (
      <Navigate replace to={CommonRoutes.NotFound} />
    ))
  );
};

export default PrivateRoute;
