import {
  Row,
  Form as BForm,
  Button,
  Spinner,
  Col,
} from "@themesberg/react-bootstrap";
import { ErrorMessage, Form, Formik } from "formik";
import React from "react";

const Credentials = ({
  details,
  updateCreds,
  loading,
  editableCreds,
  setEditableCreds,
}) => {
  const data = details?.sendgridCredentials;
  return (
    <Row>
      <Col sm={12} className="my-2">
        <div className="text-right m-n1">
          <button
            type="button"
            className="m-1 btn btn-warning"
            onClick={() => {
              setEditableCreds(true);
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
            sendgridKey:
              data?.[0].key === "SENDGRID_API_KEY"
                ? data?.[0].value
                : data?.[1].value,
            sendgridEmail:
              data?.[0].key === "SENDGRID_EMAIL"
                ? data?.[0].value
                : data?.[1].value,
          }}
          // validationSchema={adminProfileSchema}
          onSubmit={(formValues) => {
            updateCreds({ data: formValues });
          }}
        >
          {({ values, handleChange, handleSubmit, handleBlur }) => {
            return (
              <Form>
                <Row>
                  <Col>
                    <BForm.Label>
                      SENDGRID_EMAIL
                      <span className="text-danger"> *</span>
                    </BForm.Label>
                    <BForm.Control
                      type="text"
                      name="sendgridEmail"
                      disabled={!editableCreds}
                      value={values?.sendgridEmail}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <ErrorMessage
                      component="div"
                      name="sendgridEmail"
                      className="text-danger"
                    />
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col>
                    <BForm.Label>
                      SENDGRID API KEY
                      <span className="text-danger"> *</span>
                    </BForm.Label>
                    <BForm.Control
                      type={editableCreds ? "text" : "password"}
                      name="sendgridKey"
                      disabled={!editableCreds}
                      value={values?.sendgridKey}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <ErrorMessage
                      component="div"
                      name="sendgridKey"
                      className="text-danger"
                    />
                  </Col>
                </Row>

                {editableCreds && (
                  <div className="mt-4 mb-3">
                    <Button
                      variant="success"
                      onClick={handleSubmit}
                      className="ml-2"
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
                )}
              </Form>
            );
          }}
        </Formik>
      )}
    </Row>
  );
};

export default Credentials;
