import multer from "multer";
import express from "express";

import { checkDomain } from "../../app/middlewares/checkDomain";
import DocumentController from "../../app/controllers/document.controllers";
import { isUserAuthenticated } from "../../app/middlewares/isUserAuthenticated";

const upload = multer();
const args = { mergeParams: true };
const documentRouter = express.Router(args);

documentRouter
  .route("/get-documents")
  .get(isUserAuthenticated, DocumentController.getUserDocument);

documentRouter
  .route("/get-document-label")
  .get(isUserAuthenticated, DocumentController.getDocumentLabels);

documentRouter
  .route("/update-user-document")
  .put(
    upload.any(),
    checkDomain,
    isUserAuthenticated,
    DocumentController.updateUserDocument
  );

export { documentRouter };
