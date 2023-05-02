import { Row, Card, ListGroup, Col } from "@themesberg/react-bootstrap";
import React from "react";

const Permission = ({ details, permissionLabel }) => {
  return (
    <>
      <Row className="my-n2 pt-3">
        {details &&
          Object.keys(details?.userPermission?.permission).map((key, index) => {
            return (
              details?.userPermission?.permission[key]?.length > 0 && (
                <Col lg={3} md={4} sm={6} className="my-2" key={index}>
                  <Card className="permissions-card">
                    <Card.Header className="fw-bold py-2 px-3">
                      {key}
                    </Card.Header>
                    <ListGroup variant="flush">
                      {details?.userPermission?.permission[key].map(
                        (permissionKey, indx) => (
                          <ListGroup.Item
                            key={indx}
                            className="d-flex justify-content-between align-items-center py-1 px-3"
                          >
                            <small>{permissionLabel(permissionKey)}</small>
                            <svg width="16" height="16" viewBox="0 0 16 16">
                              <path
                                id="circle-check-solid"
                                d="M0,8a8,8,0,1,1,8,8A8,8,0,0,1,0,8ZM11.619,6.619a.875.875,0,0,0-1.237-1.237L7,8.762,5.619,7.381A.875.875,0,0,0,4.381,8.619l2,2a.877.877,0,0,0,1.237,0Z"
                                fill="#05a677"
                              />
                            </svg>
                          </ListGroup.Item>
                        )
                      )}
                    </ListGroup>
                  </Card>
                </Col>
              )
            );
          })}
      </Row>
    </>
  );
};

export default Permission;
