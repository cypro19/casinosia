import { Col, Row, Form as BForm, Button } from "@themesberg/react-bootstrap";
import { Form, Formik } from "formik";
import React from "react";
import { toast } from "../Toast";
import Preloader from "../Preloader";
import LoyaltyPoint from "./LoyaltyPoint";
import { loyaltyLevelSchema } from "./schema";
import useLoyalty from "./useLoyalty";
import useCheckPermission from "../../utils/checkPermission";

export default () => {
  const { loading, myLevels, updateloyaltyLevel, addLevels, deleteLevel } =
    useLoyalty();
  const { isHidden } = useCheckPermission();

  return (
    <>
      {loading ? (
        <Preloader />
      ) : (
        <>
          <Formik
            enableReinitialize
            initialValues={{
              loyaltyLevel: myLevels,
            }}
            validationSchema={loyaltyLevelSchema}
            onSubmit={(formValues) => updateloyaltyLevel(formValues)}
          >
            {({
              values,
              handleChange,
              handleSubmit,
              handleBlur,
              touched,
              errors,
            }) => (
              <Form>
                <Row>
                  <Col>
                    <h3>Loyalty Program</h3>
                  </Col>
                  <Col className="d-flex justify-content-end align-items-center">
                    <Button
                      variant="success"
                      size="sm"
                      hidden={isHidden({
                        module: { key: "LoyaltyProgram", value: "U" },
                      })}
                      onClick={() => {
                        addLevels(values?.loyaltyLevel);
                      }}
                    >
                      Add Levels
                    </Button>
                  </Col>
                </Row>
                <LoyaltyPoint
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  deleteLevel={deleteLevel}
                  touched={touched}
                  errors={errors}
                />
                <div className="mt-4 d-flex justify-content-end">
                  <Button
                    variant="success"
                    hidden={isHidden({
                      module: { key: "LoyaltyProgram", value: "U" },
                    })}
                    onClick={() => {
                      const error = () => {
                        for (const arr in errors?.loyaltyLevel) {
                          if (errors?.loyaltyLevel?.[arr]) {
                            if (errors?.loyaltyLevel?.[arr]?.startPoint) {
                              return "startPoint";
                            }
                          }
                          return true;
                        }
                        return false;
                      };
                      const myError = error();
                      if (myError === "startPoint") {
                        toast(
                          "Start Point Must Be Greater Than Previous Level End Point and Must be in Continuation",
                          "error"
                        );
                      } else {
                        handleSubmit();
                      }
                    }}
                    className="ml-2"
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </>
      )}
    </>
  );
};
