import { Row, Col, Form as BForm, Button } from "@themesberg/react-bootstrap";
import { Form, Formik, ErrorMessage } from "formik";
import React from "react";
import Select from "react-select";
import { formatDateYMD } from "../../utils/dateFormatter";
import { toast } from "../../components/Toast";
import { freeSpinFormSchema } from "./schema";

const FreeSpinForm = ({ bonusOptions, setShow, gameIds, submitData }) => {
  return (
    <>
      <Formik
        initialValues={{
          quantity: 1,
          betLevel: 1,
          validTo: formatDateYMD(
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate() + 1
            )
          ),
          validFrom: formatDateYMD(new Date()),
          bonusId: "",
        }}
        validationSchema={freeSpinFormSchema}
        onSubmit={(formValues) => {
          submitData(formValues);
          setShow(false);
        }}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          handleBlur,
          setFieldValue,
        }) => (
          <Form className="align-items-center mt-3">
            <Row className="d-flex mt-2">
              <Col>
                <BForm.Label>
                  Spins <span className="text-danger">* </span>
                </BForm.Label>
              </Col>
              <Col>
                <BForm.Control
                  type="number"
                  name="quantity"
                  min={1}
                  placeholder="Enter Spins"
                  value={values.quantity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <ErrorMessage
                  component="div"
                  name="quantity"
                  className="text-danger"
                />
              </Col>
              <Col>
                <BForm.Label>
                  Bet Level <span className="text-danger">* </span>
                </BForm.Label>
              </Col>
              <Col>
                <BForm.Control
                  type="number"
                  min={1}
                  name="betLevel"
                  placeholder="Enter Bet Level"
                  value={values.betLevel}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <ErrorMessage
                  component="div"
                  name="betLevel"
                  className="text-danger"
                />
              </Col>
            </Row>
            <Row className="d-flex mt-2">
              <Col>
                <BForm.Label>
                  Valid From <span className="text-danger">* </span>
                </BForm.Label>
              </Col>
              <Col>
                <BForm.Control
                  type="date"
                  name="validFrom"
                  min={formatDateYMD(new Date())}
                  value={values.validFrom}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <ErrorMessage
                  component="div"
                  name="validFrom"
                  className="text-danger"
                />
              </Col>
              <Col>
                <BForm.Label>
                  Valid To <span className="text-danger">* </span>
                </BForm.Label>
              </Col>
              <Col>
                <BForm.Control
                  type="date"
                  name="validTo"
                  min={formatDateYMD(
                    new Date(
                      new Date().getFullYear(),
                      new Date().getMonth(),
                      new Date().getDate() + 1
                    )
                  )}
                  value={values.validTo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <ErrorMessage
                  component="div"
                  name="validTo"
                  className="text-danger"
                />
              </Col>
            </Row>

            <Row className="d-flex mt-2">
              <Col>
                <BForm.Label>
                  Bonus
                  <span className="text-danger">* </span>
                </BForm.Label>
              </Col>
              <Col>
                <Select
                  isClearable={false}
                  name="bonusId"
                  options={bonusOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={(option, e) => {
                    setFieldValue("bonusId", option.value);
                  }}
                />

                <ErrorMessage
                  component="div"
                  name="bonusId"
                  className="text-danger"
                />
              </Col>
              <Col />
              <Col />
            </Row>

            <div className="mt-4 d-flex justify-content-between align-items-center">
              <Button variant="warning" onClick={() => setShow(false)}>
                Cancel
              </Button>

              <div>
                <Button
                  variant="success"
                  onClick={() => {
                    !gameIds?.length
                      ? toast("Select At Least One Game", "error")
                      : handleSubmit();
                  }}
                  className="ml-2"
                >
                  Issue
                  {/* {loading && (
                    <Spinner
                      as='span'
                      animation='border'
                      size='sm'
                      role='status'
                      aria-hidden='true'
                    />
                  )} */}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default FreeSpinForm;
