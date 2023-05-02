import { Col, Row, Form as BForm, Dropdown } from "@themesberg/react-bootstrap";
import React, { useEffect, useState } from "react";
import CodepenEditor from "../CodeEditor";

export const CreateCMSTemplate = ({
  cmsKeys,
  setFieldValue,
  handleChange,
  handleBlur,
  selectedTab,
  title,
  setTitle,
  content,
  setContent,
}) => {
  const [template, setTemplate] = useState("");
  const [err, setErr] = useState("");
  const [label, setLabel] = useState("");
  const [requiredKeyData, setRequiredKeyData] = useState({});
  useEffect(() => {
    if (cmsKeys?.dynamicKeys && Object.keys(cmsKeys?.dynamicKeys)?.length) {
      let tempDataAll = {};
      let tempData = {};
      const dynamicKeys = cmsKeys?.dynamicKeys;
      dynamicKeys.forEach((item) => {
        tempDataAll = { ...tempDataAll, [item.key]: item.description };
        if (item.required) {
          tempData = { ...tempData, [item.key]: item.description };
        }
      });
      setRequiredKeyData(tempData);
    }
  }, [cmsKeys?.dynamicKeys]);

  useEffect(() => {
    if (template) {
      setErr("");
    }
    const delayDebounceFn = setTimeout(() => {
      setContent({
        ...content,
        [selectedTab]: template,
      });
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [template]);

  useEffect(() => {
    setFieldValue && setFieldValue("language", selectedTab);
    setLabel(label);
  }, [selectedTab]);

  useEffect(() => {
    setFieldValue("title", label);
    setTitle({
      ...title,
      [selectedTab]: label,
    });
  }, [label]);

  return (
    <>
      <Row className="mt-3">
        <Col>
          <Col xs={2}>
            <BForm.Label>
              Title <span className="text-danger">* </span>
            </BForm.Label>
          </Col>

          <Col xs={5}>
            <BForm.Control
              type="text"
              name="title"
              placeholder="Enter Title"
              value={label}
              onChange={(e) => {
                setLabel(e.target.value);
                handleChange(e);
              }}
              onBlur={handleBlur}
            />
          </Col>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="d-flex mb-2 align-items-center">
            <BForm.Label>
              Content <span className="text-danger">*</span>
            </BForm.Label>
            <Col />
            <Col className="d-flex justify-content-end align-items-center">
              <Dropdown className=" d-inline mx-2">
                <Dropdown.Toggle id="dropdown-autoclose-outside">
                  Dynamic Keys
                </Dropdown.Toggle>

                <Dropdown.Menu className=" user-dropdown">
                  {cmsKeys?.dynamicKeys?.map?.((item, index) => {
                    return (
                      <Dropdown.Item
                        key={index}
                        onClick={() => {
                          requiredKeyData
                            ? setRequiredKeyData({
                                ...requiredKeyData,
                                [item]: cmsKeys?.keyDescription[item],
                              })
                            : setRequiredKeyData({
                                [item]: cmsKeys?.keyDescription[item],
                              });
                        }}
                      >
                        {`${item} `}
                        {item.required ? "(Required)" : "(Optional)"}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </div>

          <CodepenEditor
            dynamicData={JSON.stringify(requiredKeyData, null, 2)}
            HTML={content?.[selectedTab] || ""}
            initial="HTML"
            mobileQuery={800}
            height="80vh"
            setTemplate={setTemplate}
            themeTransitionSpeed={150}
            setRequiredKeyData={setRequiredKeyData}
            selectedTab={selectedTab}
            setTemp={setTemplate}
          />
        </Col>
      </Row>
      {err && (
        <Row>
          <span className="text-danger">{err}</span>
        </Row>
      )}
    </>
  );
};
