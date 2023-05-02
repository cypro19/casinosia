import Responder from "../../server/expressResponder";
import {
  CreateEmailTemplateService,
  GetAllEmailTemplateService,
  GetEmailTemplateService,
  UpdateEmailTemplateService,
  EmailPrimaryService,
  DeleteEmailTemplateService,
  TestEmailTemplateService,
  GetGalleryService,
  UploadImageGalleryService,
  DeleteImageFromGalleryService,
  GetEmailDynamicDetails,
  DeleteEmailTemplateLanguageService,
} from "../services/emailTemplates";
import { validateFile } from "../utils/common";
import { OK } from "../utils/constant";
import { ERRORS } from "../utils/errors";

export default class EmailTemplateController {
  static async createEmailTemplate(req, res) {
    const createEmailTemplate = await CreateEmailTemplateService.execute(
      req.body
    );

    if (createEmailTemplate.successful) {
      Responder.success(res, createEmailTemplate.result);
    } else {
      Responder.failed(res, createEmailTemplate.errors);
    }
  }

  static async getAllEmailTemplate(req, res) {
    const getAllEmailTemplate = await GetAllEmailTemplateService.execute({
      ...req.body,
      ...req.query,
    });

    if (getAllEmailTemplate.successful) {
      Responder.success(res, getAllEmailTemplate.result);
    } else {
      Responder.failed(res, getAllEmailTemplate.errors);
    }
  }

  static async getEmailTemplateById(req, res) {
    const getEmailTemplateById = await GetEmailTemplateService.execute({
      ...req.body,
      ...req.query,
    });

    if (getEmailTemplateById.successful) {
      Responder.success(res, getEmailTemplateById.result);
    } else {
      Responder.failed(res, getEmailTemplateById.errors);
    }
  }

  static async updateEmailTemplate(req, res) {
    const updateEmailTemplate = await UpdateEmailTemplateService.execute(
      req.body
    );

    if (updateEmailTemplate.successful) {
      Responder.success(res, updateEmailTemplate.result);
    } else {
      Responder.failed(res, updateEmailTemplate.errors);
    }
  }

  static async markEmailPrimary(req, res) {
    const markEmailPrimary = await MarkEmailPrimaryService.execute(req.body);

    if (markEmailPrimary.successful) {
      Responder.success(res, markEmailPrimary.result);
    } else {
      Responder.failed(res, markEmailPrimary.errors);
    }
  }

  static async deleteEmailTemplate(req, res) {
    const deleteEmailTemplate = await DeleteEmailTemplateService.execute(
      req.body
    );

    if (deleteEmailTemplate.successful) {
      Responder.success(res, deleteEmailTemplate.result);
    } else {
      Responder.failed(res, deleteEmailTemplate.errors);
    }
  }

  static async deleteEmailTemplateLanguage(req, res) {
    const deleteEmailTemplate =
      await DeleteEmailTemplateLanguageService.execute(req.body);

    if (deleteEmailTemplate.successful) {
      Responder.success(res, deleteEmailTemplate.result);
    } else {
      Responder.failed(res, deleteEmailTemplate.errors);
    }
  }

  static async testEmailTemplate(req, res) {
    const testEmailTemplate = await TestEmailTemplateService.execute(req.body);

    if (testEmailTemplate.successful) {
      Responder.success(res, testEmailTemplate.result);
    } else {
      Responder.failed(res, testEmailTemplate.errors);
    }
  }

  static async getGallery(req, res) {
    const getGallery = await GetGalleryService.execute({
      ...req.body,
      ...req.query,
    });

    if (getGallery.successful) {
      Responder.success(res, getGallery.result);
    } else {
      Responder.failed(res, getGallery.errors);
    }
  }

  static async uploadImageGallery(req, res) {
    const fileCheckResponse = validateFile(res, req.file);

    if (fileCheckResponse !== OK) {
      return res
        .status(400)
        .json({ errCode: ERRORS.BAD_REQUEST, message: fileCheckResponse });
    }

    const uploadImageGallery = await UploadImageGalleryService.execute({
      ...req.body,
      image: req.file,
    });

    if (uploadImageGallery.successful) {
      Responder.success(res, uploadImageGallery.result);
    } else {
      Responder.failed(res, uploadImageGallery.errors);
    }
  }

  static async deleteImage(req, res) {
    const deleteImage = await DeleteImageFromGalleryService.execute(req.body);

    if (deleteImage.successful) {
      Responder.success(res, deleteImage.result);
    } else {
      Responder.failed(res, deleteImage.errors);
    }
  }

  static async getEmailDynamicData(req, res) {
    const dynamicDetails = await GetEmailDynamicDetails.execute(req.body);

    if (dynamicDetails.successful) {
      Responder.success(res, dynamicDetails.result);
    } else {
      Responder.failed(res, dynamicDetails.errors);
    }
  }
}
