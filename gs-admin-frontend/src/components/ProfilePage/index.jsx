import React from "react";
import { Tabs, Tab, Row, Col } from "@themesberg/react-bootstrap";
import useProfilePage from "./useProfilePage";
import {
  permissionLabel,
  profileConstants,
  profileConstantsTA,
} from "./constants";
import Preloader from "../Preloader";
import Hierarchy from "../Hierarchy";
import Overview from "./Overview";
import Permission from "./Permission";
import Credentials from "./Credentials";
import SiteConfiguration from "./SiteConfiguration";

export default () => {
  const {
    details,
    selectedTab,
    setSelectedTab,
    editable,
    setEditable,
    updateData,
    loading,
    siteConfigLoading,
    type,
    setType,
    adminDetails,
    updateCredentials,
    editableCreds,
    setEditableCreds,
    siteConfigEditable,
    setSiteConfigEditable,
    updateSiteConfig,
    preview,
    handleImagePreview,
  } = useProfilePage();

  const constant = profileConstants;

  return (
    <>
      {loading ? (
        <Preloader />
      ) : (
        <>
          <Row>
            <Col className="d-flex">
              <h3>Profile</h3>
            </Col>
          </Row>

          <Tabs
            activeKey={selectedTab}
            onSelect={(tab) => setSelectedTab(tab)}
            className="nav-light"
          >
            <Tab eventKey="overview" title="Overview">
              <div className="mt-3">
                <Overview
                  details={details}
                  setEditable={setEditable}
                  editable={editable}
                  updateData={updateData}
                  constant={constant}
                  type={type}
                  setType={setType}
                  loading={loading}
                />
              </div>
            </Tab>

            {adminDetails?.superRoleId === 1 && (
              <Tab eventKey="credentials" title="Credentials">
                <div className="mt-3">
                  <Credentials
                    details={details}
                    updateCreds={updateCredentials}
                    loading={loading}
                    editableCreds={editableCreds}
                    setEditableCreds={setEditableCreds}
                  />
                </div>
              </Tab>
            )}

            {adminDetails?.superRoleId === 1 && (
              <Tab eventKey="siteConfiguration" title="Site Configuration">
                <div className="mt-3">
                  <SiteConfiguration
                    details={details}
                    setEditable={setSiteConfigEditable}
                    editable={siteConfigEditable}
                    updateData={updateSiteConfig}
                    loading={siteConfigLoading}
                    preview={preview}
                    handleImagePreview={handleImagePreview}
                  />
                </div>
              </Tab>
            )}

            <Tab eventKey="permissions" title="Permissions">
              <div className="mt-3">
                <Permission
                  details={details}
                  permissionLabel={permissionLabel}
                />
              </div>
            </Tab>
            {adminDetails?.superRoleId !== 3 && (
              <Tab eventKey="usersTree" title="Tree">
                <div className="mt-5">
                  <Row className="mt-3 d-flex flex-row-reverse text-right">
                    {details && details?.superAdminUserId && (
                      <Hierarchy
                        adminDetails={{
                          name: `${details?.firstName} ${details?.lastName}`,
                          id: details?.superAdminUserId,
                          children: [],
                          isInitial: true,
                          data: { superRoleId: details?.superRoleId },
                        }}
                      />
                    )}
                  </Row>
                </div>
              </Tab>
            )}
          </Tabs>
        </>
      )}
    </>
  );
};
