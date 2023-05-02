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
import { adminProfileSchema, siteConfigSchema } from "./schema";

const SiteConfiguration = ({
  details,
  setEditable,
  editable,
  updateData,
  loading,
  preview,
  handleImagePreview,
}) => {
  console.log(details);
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
              siteName:
                details?.siteConfig?.find((obj) => obj.key === "SITE_NAME")
                  .value || "",
              siteUrl:
                details?.siteConfig?.find((obj) => obj.key === "ORIGIN")
                  .value || "",
              supportEmailAddress:
                details?.siteConfig?.find(
                  (obj) => obj.key === "SUPPORT_EMAIL_ADDRESS"
                ).value || "",
              siteLogo: null,
            }}
            validationSchema={siteConfigSchema}
            onSubmit={(formValues) => {
              updateData({ data: formValues });
            }}
          >
            {({
              errors,
              values,
              handleChange,
              handleSubmit,
              handleBlur,
              setFieldValue,
            }) => {
              return (
                <Form>
                  <Row lg={2} md={2} sm={2}>
                    <Col>
                      <div className="bg-light py-2 px-3 rounded">
                        <label className="fw-bold">Site Name</label>
                        <span className="mb-0">
                          <InputGroup>
                            <BForm.Control
                              type={"text"}
                              name={"siteName"}
                              disabled={!editable}
                              value={values?.siteName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </InputGroup>

                          <ErrorMessage
                            component="div"
                            name={"siteName"}
                            className="text-danger"
                          />
                        </span>
                      </div>
                    </Col>
                    <Col>
                      <div className="bg-light py-2 px-3 rounded">
                        <label className="fw-bold">Site Url</label>
                        <span className="mb-0">
                          <InputGroup>
                            <BForm.Control
                              type={"text"}
                              name={"siteUrl"}
                              disabled={!editable}
                              value={values?.siteUrl}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </InputGroup>

                          <ErrorMessage
                            component="div"
                            name={"siteUrl"}
                            className="text-danger"
                          />
                        </span>
                      </div>
                    </Col>
                    <Col>
                      <div className="bg-light py-2 px-3 rounded">
                        <label className="fw-bold">Support Email Address</label>
                        <span className="mb-0">
                          <InputGroup>
                            <BForm.Control
                              type={"text"}
                              name={"supportEmailAddress"}
                              disabled={!editable}
                              value={values?.supportEmailAddress}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </InputGroup>

                          <ErrorMessage
                            component="div"
                            name={"supportEmailAddress"}
                            className="text-danger"
                          />
                        </span>
                      </div>
                    </Col>
                    <Col>
                      <div className="bg-light py-2 px-3 rounded">
                        <label className="fw-bold">Site Logo</label>
                        <span className="mb-0">
                          <InputGroup>
                            <BForm.Control
                              type="file"
                              placeholder="Image"
                              name={"siteLogo"}
                              disabled={!editable}
                              onInput={handleChange}
                              // value={values?.siteLogo}
                              onChange={(event) => {
                                setFieldValue(
                                  "siteLogo",
                                  event.currentTarget.files[0]
                                );
                                handleImagePreview(event);
                              }}
                              onBlur={handleBlur}
                            />
                          </InputGroup>

                          <ErrorMessage
                            component="div"
                            name={"siteLogo"}
                            className="text-danger"
                          />
                        </span>
                        {!errors.siteLogo &&
                          (preview?.image_preview ? (
                            <img
                              src={preview?.image_preview}
                              width="150"
                              height="150"
                              className="mt-2 border-0"
                            />
                          ) : (
                            details?.siteConfig?.find(
                              (obj) => obj.key === "LOGO_URL"
                            ).value && (
                              <img
                                src={
                                  details?.siteConfig?.find(
                                    (obj) => obj.key === "LOGO_URL"
                                  ).value
                                }
                                width="150"
                                height="150"
                                className="mt-2 border-0"
                              />
                            )
                          ))}
                      </div>
                    </Col>
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
                          style={{ marginLeft: "3px" }}
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

export default SiteConfiguration;
