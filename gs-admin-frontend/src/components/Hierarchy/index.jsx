import React, { useEffect } from "react";
import Tree from "react-hierarchy-tree-graph";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAdminChildrenStart,
  getAdminChildrenSuccess,
} from "../../store/redux-slices/admins";
import "./Hierarchy.css";
import NodeLabel from "./NodeLabel";

export default ({ adminDetails }) => {
  const dispatch = useDispatch();
  // const navigate = useNavigate()
  const { adminChildren } = useSelector((state) => state.admins);

  const getChildren = async (id, superRoleId) => {
    dispatch(
      getAdminChildrenStart({
        superAdminId: id,
        parentAdmin: adminDetails.name,
        superRoleId,
      })
    );
  };

  const containerStyles = {
    width: "100%",
    height: "100vh",
  };
  useEffect(() => {
    dispatch(getAdminChildrenSuccess(adminDetails));
    // dispatch(getAdminChildrenStart({ superAdminId: 2 }))
    // setTimeout(() => {
    //   getChildren(2)
    // }, 1000)
  }, []);

  return (
    <div style={containerStyles}>
      {adminDetails && adminChildren && (
        <Tree
          data={adminChildren}
          translate={{ x: 550, y: 50 }}
          orientation="vertical"
          collapsible={false}
          onClick={(e) => {
            getChildren(e.id, e.data?.superRoleId);
          }}
          separation={{ siblings: 1.3, nonSiblings: 2 }}
          allowForeignObjects
          nodeLabelComponent={{
            render: <NodeLabel />,
            foreignObjectWrapper: {
              y: -13,
              x: 18,
              height: "25px",
              width: "200px",
            },
          }}
        />
      )}
    </div>
  );
};
