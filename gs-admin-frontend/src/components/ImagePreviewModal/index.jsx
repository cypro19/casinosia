import { Col, Modal, Row } from "@themesberg/react-bootstrap";
import React from "react";

export const ImagePreviewModal = ({
  imagePreviewModalShow,
  setImagePreviewModalShow,
  imageUrl,
  setImageUrl,
}) => {
  function getUrlExtension(url) {
    return url.split(/[#?]/)[0].split(".").pop().trim();
  }

  return (
    <Modal
      show={imagePreviewModalShow}
      onHide={() => {
        setImagePreviewModalShow(false);
        setImageUrl({ name: "", preview: [] });
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Document Preview For {imageUrl?.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {imageUrl ? (
          <Row xs={12} className="d-flex justify-content-center">
            {imageUrl?.preview?.map((url, index) => (
              <Col key={index} className="mt-2 text-center" xs={6}>
                <Col>
                  {getUrlExtension(url) === "pdf" ? (
                    <img
                      src="/pdfimage.png"
                      onClick={() => window.open(url)}
                      style={{ border: "1px solid grey", borderRadius: "12px" }}
                      className="mb-2"
                    />
                  ) : (
                    <img
                      src={url}
                      width="200"
                      height="150"
                      alt={url}
                      onClick={() => window.open(url)}
                      style={{ border: "1px solid grey", borderRadius: "12px" }}
                      className="mb-2"
                    />
                  )}
                </Col>
                <Col>
                  <label>
                    {imageUrl?.preview?.length - 1 === index
                      ? "Latest Document Preview"
                      : "Document Preview" + (index + 1)}
                  </label>
                </Col>
              </Col>
            ))}
          </Row>
        ) : (
          "No Preview Found"
        )}
      </Modal.Body>
    </Modal>
  );
};
