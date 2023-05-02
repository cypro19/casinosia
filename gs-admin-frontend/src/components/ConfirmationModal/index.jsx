import React from "react";
import { Button, Col, Modal, Row, Table } from "@themesberg/react-bootstrap";
import { useSelector } from "react-redux";
import "./modalStyle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import Trigger from "../OverlayTrigger";
import { toast } from "../Toast";
import PaginationComponent from "../Pagination";
import { formatDateYMD } from "../../utils/dateFormatter";
import CopyToClipboard from "react-copy-to-clipboard";

export default ({ show, setShow, handleYes, active }) => (
  <Modal show={show} onHide={() => setShow(false)}>
    <Modal.Header closeButton>
      <Modal.Title>Are you sure?</Modal.Title>
    </Modal.Header>

    <Modal.Body>Toggle Status to {active ? "Active" : "In-Active"}?</Modal.Body>

    <Modal.Footer>
      <Button variant="secondary" onClick={handleYes}>
        Yes
      </Button>

      <Button variant="primary" onClick={() => setShow(false)}>
        No
      </Button>
    </Modal.Footer>
  </Modal>
);

export const DeleteConfirmationModal = ({
  deleteModalShow,
  setDeleteModalShow,
  handleDeleteYes,
}) => (
  <Modal show={deleteModalShow} onHide={() => setDeleteModalShow(false)}>
    <Modal.Header closeButton>
      <Modal.Title>Are you sure?</Modal.Title>
    </Modal.Header>

    <Modal.Body>You want to delete it?</Modal.Body>

    <Modal.Footer>
      <Button variant="secondary" onClick={handleDeleteYes}>
        Yes
      </Button>

      <Button variant="primary" onClick={() => setDeleteModalShow(false)}>
        No
      </Button>
    </Modal.Footer>
  </Modal>
);

export const ApproveRejectModal = ({ show, setShow, handleYes, status }) => (
  <Modal show={show} onHide={() => setShow(false)}>
    <Modal.Header closeButton>
      <Modal.Title>Are you sure?</Modal.Title>
    </Modal.Header>

    <Modal.Body>
      You want to{" "}
      {status === "approved" ? "Approve it?" : "Cancel-ReRequested Document?"}
    </Modal.Body>

    <Modal.Footer>
      <Button
        variant="secondary"
        onClick={() => {
          if (status === "approved") {
            handleYes("", "");
          } else {
            handleYes("", "cancel");
          }
        }}
      >
        Yes
      </Button>

      <Button variant="primary" onClick={() => setShow(false)}>
        No
      </Button>
    </Modal.Footer>
  </Modal>
);

export const GalleryModal = ({ galleryModal, setGalleryModal }) => {
  const { gallery } = useSelector((state) => state.emailTemplate);

  return (
    <Modal show={galleryModal} onHide={() => setGalleryModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Gallery</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row className="text-center align-items-center">
          {gallery?.length > 0 ? (
            gallery?.map((img, index) => {
              return (
                <Col key={index} md={3} className="imagecontainer">
                  <CopyToClipboard
                    text={img?.imageUrl}
                    onCopy={() => {
                      setGalleryModal(false);
                      toast("Copied To ClipBoard", "success");
                    }}
                  >
                    <img
                      src={img?.imageUrl}
                      width="200"
                      height="150"
                      style={{
                        border: "2px solid aliceblue",
                        borderRadius: "12px",
                        cursor: "pointer",
                      }}
                      className="mb-2"
                    />
                  </CopyToClipboard>
                  <div className="text">{img?.name}</div>
                  <Trigger message="Copy This Image URL to ClipBoard">
                    <CopyToClipboard
                      text={img?.imageUrl}
                      onCopy={() => {
                        setGalleryModal(false);
                        toast("Copied To ClipBoard", "success");
                      }}
                    >
                      <Button
                        className="copy d-flex align-items-center"
                        variant="light"
                      >
                        <FontAwesomeIcon icon={faCopy} />
                      </Button>
                    </CopyToClipboard>
                  </Trigger>
                </Col>
              );
            })
          ) : (
            <h4 className="text-danger">No Image Found</h4>
          )}
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export const ResetConfirmationModal = ({ show, setShow, handleYes, data }) => (
  <Modal show={show} onHide={() => setShow(false)}>
    <Modal.Header closeButton>
      <Modal.Title>Are you sure?</Modal.Title>
    </Modal.Header>

    <Modal.Body>You want to Reset {data}?</Modal.Body>

    <Modal.Footer>
      <Button variant="secondary" onClick={() => handleYes(data)}>
        Yes
      </Button>

      <Button variant="primary" onClick={() => setShow(false)}>
        No
      </Button>
    </Modal.Footer>
  </Modal>
);
