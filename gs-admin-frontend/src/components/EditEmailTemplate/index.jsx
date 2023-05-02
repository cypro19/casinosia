import {
  Button,
  Col,
  InputGroup,
  Modal,
  Row,
  Form as BForm,
  Dropdown,
} from "@themesberg/react-bootstrap";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CodepenEditor from "../CodeEditor";
import { InlineLoader } from "../Preloader";
import { toast } from "../Toast";
import { AdminRoutes } from "../../routes";
import { useDispatch } from "react-redux";
import { testEmailTemplateStart } from "../../store/redux-slices/emailTemplate";
// import { encode as btoa } from 'base-64'

export default ({
  dynamicKeys,
  isHidden,
  // setGalleryModal,
  emailTemplate,
  // setIsTestTemplateModalVisible,
  // isTestTemplateModalVisible,
  updateTemplate,
  testTemplateLoading,
  testEmailTemplateHandler,
  testEmail,
  setTestEmail,
  selectedTab,
  deleteEmailTemplate,
  handleSubmit = false,
  setTemp,
  create = false,
  values = false,
}) => {
  const [template, setTemplate] = useState("");
  const [isTestTemplateModalVisible, setIsTestTemplateModalVisible] =
    useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [requiredKeyData, setRequiredKeyData] = useState({});
  useEffect(() => {
    if (Object.keys(dynamicKeys)?.length) {
      let tempDataAll = {};
      let tempData = {};
      dynamicKeys.forEach((item) => {
        tempDataAll = { ...tempDataAll, [item.key]: item.description };
        if (item.required) {
          tempData = { ...tempData, [item.key]: item.description };
        }
      });
      setRequiredKeyData(tempData);
    }
  }, [dynamicKeys]);

  useEffect(() => {
    setTemp && setTemp(template);
  }, [template]);

  return (
    <>
      <Row className="mb-2">
        <Col className="d-flex justify-content-end align-items-center">
          <div>
            <Dropdown className=" d-inline mx-2">
              <Dropdown.Toggle id="dropdown-autoclose-outside">
                Dynamic Keys
              </Dropdown.Toggle>

              <Dropdown.Menu className=" user-dropdown">
                {dynamicKeys?.map?.((item, index) => {
                  return (
                    <Dropdown.Item
                      key={index}
                      onClick={() => {
                        setRequiredKeyData({
                          ...requiredKeyData,
                          [item.key]: item.description,
                        });
                      }}
                    >
                      {`${item.key} `}
                      {item.required ? "(Required)" : "(Optional)"}
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Col>
      </Row>
      <Row>
        <CodepenEditor
          dynamicData={JSON.stringify(requiredKeyData, null, 2)}
          HTML={
            emailTemplate?.templateCode?.[selectedTab]
              ? emailTemplate?.templateCode?.[selectedTab]
              : emailTemplate?.templateCode?.EN || ""
          }
          initial="HTML"
          mobileQuery={800}
          height="80vh"
          setTemplate={setTemplate}
          themeTransitionSpeed={150}
          setRequiredKeyData={setRequiredKeyData}
        />
      </Row>
      {err && (
        <Row>
          <span className="text-danger">{err}</span>
        </Row>
      )}
      <Row>
        <Col>
          <Button
            className="m-1 float-start"
            size="sm"
            variant="warning"
            onClick={() => {
              navigate(AdminRoutes.EmailTemplate);
            }}
          >
            Cancel
          </Button>
          <Button
            className="m-1 float-start"
            size="sm"
            variant="danger"
            hidden={
              selectedTab === "EN" ||
              emailTemplate?.templateCode?.[selectedTab] === undefined
            }
            onClick={() => {
              deleteEmailTemplate({
                data: {
                  language: selectedTab,
                  emailTemplateId: emailTemplate?.emailTemplateId,
                },
              });
            }}
          >
            Delete
          </Button>
          <div className="float-end">
            <Button
              className="m-2"
              size="sm"
              variant="success"
              hidden={isHidden({
                module: { key: "EmailTemplate", value: "TE" },
              })}
              onClick={() =>
                setIsTestTemplateModalVisible(!isTestTemplateModalVisible)
              }
            >
              Send test email
            </Button>
            <Button
              size="sm"
              variant="success"
              hidden={
                isHidden({ module: { key: "EmailTemplate", value: "U" } }) ||
                (create &&
                  emailTemplate?.templateCode?.[selectedTab] !== undefined)
              }
              onClick={() => {
                if (template === "") {
                  setErr("Content is Required!");
                  toast("Content Required!", "error");
                } else {
                  handleSubmit
                    ? handleSubmit()
                    : updateTemplate({
                        data: {
                          templateCode:
                            typeof template === "object"
                              ? template?.EN
                              : template,
                          language: selectedTab,
                        },
                      });
                  setErr("");
                  values && !values?.label && window.scroll(0, 0);
                }
              }}
            >
              Submit
            </Button>
          </div>
        </Col>
      </Row>
      <Modal
        show={isTestTemplateModalVisible}
        onHide={() => setIsTestTemplateModalVisible(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Enter Test Email</Modal.Title>
        </Modal.Header>
        <BForm
          onSubmit={(e) => {
            e.preventDefault();
            const templateCode = Buffer.from(template).toString("base64");
            templateCode &&
              dispatch(
                testEmailTemplateStart({
                  data: {
                    templateCode,
                    testEmail,
                    dynamicData: requiredKeyData,
                  },
                  setIsTestTemplateModalVisible,
                  setTestEmail,
                })
              );
          }}
        >
          <Modal.Body>
            <label htmlFor="emailTemplateEmail">
              Email<span className="text-danger"> *</span>
            </label>
            <InputGroup>
              <BForm.Control
                name="emailTemplateEmail"
                placeholder="Enter Email"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                required
              />
            </InputGroup>
          </Modal.Body>

          <Modal.Footer>
            <Button
              className="d-flex"
              type="submit"
              disabled={!testEmail || testTemplateLoading}
              variant="secondary"
            >
              Send {testTemplateLoading && <InlineLoader />}
            </Button>

            <Button
              variant="primary"
              onClick={() => setIsTestTemplateModalVisible(false)}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </BForm>
      </Modal>
    </>
  );
};
