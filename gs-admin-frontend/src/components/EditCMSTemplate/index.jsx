import {
  Col,
  Row,
  Form as BForm,
  Dropdown,
  Button,
} from "@themesberg/react-bootstrap";
import { ErrorMessage } from "formik";
import React, { useEffect, useState } from "react";
import { AdminRoutes } from "../../routes";
import CodepenEditor from "../CodeEditor";
import { toast } from "../Toast";

export default ({
  setTemp,
  values,
  cmsKeys,
  setFieldValue,
  handleChange,
  handleBlur,
  selectedTab,
  navigate,
  isHidden,
  create = false,
  handleSubmit,
  deleteCms,
  details = false,
  initValues = false,
  errors,
  title,
  setTitle,
  content,
  setContent,
}) => {
  const [template, setTemplate] = useState("");
  const [titleErr, setTitleErr] = useState("");
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
    setLabel(label || values?.title?.[selectedTab] || values?.title?.EN);
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
              disabled={details}
              placeholder="Enter Title"
              value={label}
              onChange={(e) => {
                setLabel(e.target.value);
                handleChange(e);
                setTitleErr("");
              }}
              onBlur={handleBlur}
            />

            {titleErr ? (
              <Row>
                <span className="text-danger">{titleErr}</span>
              </Row>
            ) : (
              <ErrorMessage
                component="div"
                name="title"
                className="text-danger"
              />
            )}
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
              {!details && (
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
              )}
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
            details={details}
          />

          <ErrorMessage
            component="div"
            name="content"
            className="text-danger"
          />
        </Col>
      </Row>
      {err && (
        <Row>
          <span className="text-danger">{err}</span>
        </Row>
      )}
      <Row>
        <Col className="d-flex justify-content-between">
          <Button
            variant="warning"
            className="m-2"
            onClick={() => navigate(AdminRoutes.CMS)}
          >
            Cancel
          </Button>

          <div>
            <Button
              variant="success"
              hidden={
                details ||
                isHidden({ module: { key: "CMS", value: "U" } }) ||
                (create && values?.content?.[selectedTab] !== undefined)
              }
              onClick={() => {
                if (template === "") {
                  setErr("Content is Required!");
                  toast("Content Required!", "error");
                } else {
                  setFieldValue("content", template);
                  setFieldValue("title", label);
                  handleSubmit();
                  if (initValues) {
                    (!initValues?.slug || !initValues?.title) &&
                      window.scroll(0, 0);
                    if (!initValues?.title) {
                      setTitleErr("Title is required");
                    } else {
                      setTitleErr("");
                    }
                  }
                  setErr("");
                }
              }}
              className="m-2"
            >
              Submit
            </Button>

            <Button
              variant="danger"
              className="m-2"
              hidden={
                details ||
                selectedTab === "EN" ||
                values?.content?.[selectedTab] === undefined
              }
              onClick={() => {
                deleteCms({
                  language: selectedTab,
                  cmsPageId: values?.cmsPageId,
                });
              }}
            >
              Delete
            </Button>
          </div>
        </Col>
      </Row>
    </>
  );
};
