import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Row,
  Col,
  Form as BForm,
  InputGroup,
  Button,
} from "@themesberg/react-bootstrap";
import { ErrorMessage } from "formik";
import React, { useEffect, useState } from "react";
import { myLabels } from "./constants";
import Trigger from "../OverlayTrigger";
import { useDispatch, useSelector } from "react-redux";
import { getloyaltyLevelStart } from "../../store/redux-slices/superAdminSettings";
import useCheckPermission from "../../utils/checkPermission";

const LoyaltyPoint = ({
  values,
  handleBlur,
  handleChange,
  bonus,
  details,
  deleteLevel,
  touched,
  errors,
}) => {
  const { loyaltyLevel } = useSelector((state) => state.superAdminSettings);
  const { bonusDetail } = useSelector((state) => state.bonus);
  const [myValues, setMyValues] = useState();
  const dispatch = useDispatch();
  const { isHidden } = useCheckPermission();

  useEffect(() => {
    details && !bonus && dispatch(getloyaltyLevelStart());
  }, []);

  useEffect(() => {
    if (!bonus && details) {
      const newLoyaltyLevel = [];
      for (const level in loyaltyLevel) {
        const obj = loyaltyLevel[level];
        newLoyaltyLevel.push({
          level: obj.level,
          startPoint: obj.startPoint,
          endPoint: obj.endPoint,
          bonusPercentage: values?.loyaltyLevel?.[level]?.bonusPercentage,
          cashback_multiplier:
            values?.loyaltyLevel?.[level]?.cashback_multiplier,
        });
      }
      setMyValues(newLoyaltyLevel);
    }
  }, [loyaltyLevel]);

  return (
    <>
      {!myValues ? (
        <>
          {values?.loyaltyLevel?.map((key, index) => (
            <Row key={index} className="g-2 mb-2">
              <Col className="d-flex justify-content-around" md={14}>
                {Object.keys(values?.loyaltyLevel[index])?.map(
                  (labels, labelsIndex) => {
                    return (
                      <Col
                        className="px-1 align-items-center"
                        key={labelsIndex}
                      >
                        {index < 1 && (
                          <>
                            <label htmlFor={labels}>
                              {!bonus &&
                              !details &&
                              labels === "cashback_multiplier"
                                ? "Percentage"
                                : myLabels.find((val) => val.value === labels)
                                    ?.label}
                              <span className="text-danger"> *</span>
                            </label>
                            <br />
                          </>
                        )}

                        <InputGroup>
                          {labels === "startPoint" && (
                            <InputGroup.Text
                              style={{ backgroundColor: "#f5f8fb" }}
                            >
                              >
                            </InputGroup.Text>
                          )}
                          <BForm.Control
                            name={`loyaltyLevel[${index}][${labels}]`}
                            type="number"
                            style={{
                              maxWidth:
                                labels === "level"
                                  ? "80px"
                                  : labels === "cashback_multiplier"
                                  ? "70px"
                                  : "170px",
                            }}
                            disabled={
                              labels === "level" ||
                              (bonus &&
                                labels !== "cashback_multiplier" &&
                                labels !== "bonusPercentage") ||
                              details
                            }
                            min={
                              index > 0 && labels === "startPoint"
                                ? values?.loyaltyLevel[index - 1].endPoint + 1
                                : 0
                            }
                            max={9999999}
                            value={
                              labels !== "cashback_multiplier"
                                ? values.loyaltyLevel[index][labels]
                                : +values.loyaltyLevel[index][labels]
                            }
                            onInput={handleChange}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          {labels === "cashback_multiplier" && (
                            <InputGroup.Text
                              style={{ backgroundColor: "#f5f8fb" }}
                            >
                              %
                            </InputGroup.Text>
                          )}
                        </InputGroup>
                        {!details && (
                          <ErrorMessage
                            component="div"
                            name={`loyaltyLevel[${index}][${labels}]`}
                            className="text-danger"
                          />
                        )}
                      </Col>
                    );
                  }
                )}
                <Col md={2} className="d-flex align-items-center">
                  {!bonus &&
                    !details &&
                    index === values?.loyaltyLevel?.length - 1 && (
                      <Trigger message="Delete this Level">
                        <Button
                          variant="danger"
                          size="sm"
                          hidden={isHidden({
                            module: { key: "LoyaltyProgram", value: "U" },
                          })}
                          onClick={() => {
                            deleteLevel(values?.loyaltyLevel);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </Trigger>
                    )}
                </Col>
              </Col>
            </Row>
          ))}
        </>
      ) : (
        <>
          {myValues?.map((key, index) => (
            <Row key={index} className="g-2 mb-2">
              <Col className="d-flex justify-content-around" md={14}>
                {Object.keys(myValues[index])?.map((labels, labelsIndex) => {
                  return (
                    <Col className="px-1 align-items-center" key={labelsIndex}>
                      {index < 1 && (
                        <>
                          <label htmlFor={labels}>
                            {!bonus &&
                            !details &&
                            labels === "cashback_multiplier"
                              ? "Percentage"
                              : myLabels.find((val) => val.value === labels)
                                  ?.label}
                            <span className="text-danger"> *</span>
                          </label>
                          <br />
                        </>
                      )}

                      <InputGroup className="justify-content-between">
                        <BForm.Control
                          name={`loyaltyLevel[${index}][${labels}]`}
                          type="number"
                          style={{
                            maxWidth: labels === "level" ? "80px" : "170px",
                          }}
                          disabled
                          min={
                            index > 0 && labels === "startPoint"
                              ? values?.loyaltyLevel[index - 1].endPoint + 1
                              : 0
                          }
                          max={9999999}
                          value={myValues[index][labels]}
                          onInput={handleChange}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </InputGroup>
                    </Col>
                  );
                })}
              </Col>
            </Row>
          ))}
        </>
      )}
    </>
  );
};

export default LoyaltyPoint;
