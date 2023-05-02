import { OK } from "../utils/constant";
import { ERRORS } from "../utils/errors";
import { validateDocument } from "../utils/common";
import Responder from "../../server/expressResponder";
import {
  GetDocumentLabelService,
  GetUserDocumentService,
  UpdateDocumentService,
} from "../services/userDocument";

export default class DocumentController {
  static async getDocumentLabels(req, res) {
    const getDocumentLabel = await GetDocumentLabelService.execute(req.body);

    if (getDocumentLabel.successful) {
      Responder.success(res, getDocumentLabel.result);
    } else {
      Responder.failed(res, getDocumentLabel.errors);
    }
  }

  static async getUserDocument(req, res) {
    const getUserDocument = await GetUserDocumentService.execute(req.body);

    if (getUserDocument.successful) {
      Responder.success(res, getUserDocument.result);
    } else {
      Responder.failed(res, getUserDocument.errors);
    }
  }

  static async updateUserDocument(req, res) {
    const fileCheckResponse = validateDocument(res, req.files);

    if (fileCheckResponse !== OK) {
      return res
        .status(400)
        .json({ errCode: ERRORS.BAD_REQUEST, message: fileCheckResponse });
    }

    const updateUserDocument = await UpdateDocumentService.execute({
      ...req.body,
      document: req.files,
    });

    if (updateUserDocument.successful) {
      Responder.success(res, updateUserDocument.result);
    } else {
      Responder.failed(res, updateUserDocument.errors);
    }
  }
}
