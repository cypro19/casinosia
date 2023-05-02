import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Col,
  InputGroup,
  Row,
  Form as BForm,
  Button,
  Spinner,
} from "@themesberg/react-bootstrap";
import { ErrorMessage, Form, Formik } from "formik";
import React from "react";
import { adminProfileSchema } from "./schema";

const Overview = ({
  details,
  setEditable,
  editable,
  updateData,
  constant,
  type,
  setType,
  loading,
}) => {
  return (
    <>
      <Row className="my-n2 pt-3">
        <Col sm={12} className="my-2">
          <div className="text-right m-n1">
            <button
              type="button"
              className="m-1 btn btn-warning"
              onClick={() => {
                setEditable(true);
              }}
            >
              Edit
            </button>
          </div>
        </Col>

        {details && (
          <Formik
            enableReinitialize
            initialValues={{
              firstName: details?.firstName,
              lastName: details?.lastName,
              email: details?.email,
              superAdminUsername: details?.superAdminUsername || "",
              password: "",
              role: details?.SuperadminRole?.name,
              agentName: details?.agentName || "",
              group: details?.group || "",
            }}
            validationSchema={adminProfileSchema}
            onSubmit={(formValues) => {
              updateData({
                ...formValues,
                password: formValues?.password
                  ? Buffer.from(formValues?.password).toString("base64")
                  : "",
                superAdminId: details?.superAdminUserId,
              });
            }}
          >
            {({ values, handleChange, handleSubmit, handleBlur }) => {
              return (
                <Form>
                  <Row lg={2} md={2} sm={2}>
                    {details &&
                      constant.map(({ key, value, subValue, edit }, index) => {
                        return (
                          <Col
                            key={index}
                            hidden={
                              details?.adminRoleId === 1 ||
                              details?.superRoleId === 1
                                ? key === "Group"
                                : false
                            }
                          >
                            <div className="bg-light py-2 px-3 rounded">
                              <label className="fw-bold">{key || "N/A"}</label>
                              <span className="mb-0">
                                {key === "Status" ? (
                                  details[value] ? (
                                    "Active"
                                  ) : (
                                    "In-Active"
                                  )
                                ) : subValue ? (
                                  <p>{details?.[value]?.[subValue]}</p>
                                ) : (
                                  <>
                                    <InputGroup>
                                      <BForm.Control
                                        type={
                                          value === "password" ? type : "text"
                                        }
                                        name={value}
                                        disabled={!edit || !editable}
                                        value={values?.[value]}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                      {value === "password" &&
                                        edit &&
                                        editable && (
                                          <InputGroup.Text className="b-1">
                                            <FontAwesomeIcon
                                              icon={
                                                type === "password"
                                                  ? faEyeSlash
                                                  : faEye
                                              }
                                              onClick={() => {
                                                type === "password"
                                                  ? setType("text")
                                                  : setType("password");
                                              }}
                                            />
                                          </InputGroup.Text>
                                        )}
                                    </InputGroup>

                                    <ErrorMessage
                                      component="div"
                                      name={value}
                                      className="text-danger"
                                    />
                                  </>
                                )}
                              </span>
                            </div>
                          </Col>
                        );
                      })}
                  </Row>
                  <div className="mt-4 mb-3">
                    <Button
                      variant="success"
                      onClick={handleSubmit}
                      className="ml-2"
                      hidden={!editable}
                    >
                      Submit
                      {loading && (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      )}
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        )}
      </Row>
    </>
  );
};

export default Overview;
