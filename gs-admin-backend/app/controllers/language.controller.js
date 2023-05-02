import Responder from "../../server/expressResponder";
import {
  GetLanguageSupportService,
  GetLanguagesService,
  LoadLanguagesCsvService,
} from "../services/languages";

export default class LanguageController {
  static async getLanguages(req, res) {
    const getLanguagesResult = await GetLanguagesService.execute(req.query);

    if (getLanguagesResult.successful) {
      Responder.success(res, getLanguagesResult.result);
    } else {
      Responder.failed(res, getLanguagesResult.errors);
    }
  }

  static async getLanguageSupportKeys(req, res) {
    const getLanguageKeys = await GetLanguageSupportService.execute({
      ...req.query,
      ...req.body,
    });

    if (getLanguageKeys.successful) {
      if (getLanguageKeys.result.csv) {
        res.header("Content-Type", "text/csv");
        res.attachment(getLanguageKeys.result.fileName);
        return res.send(getLanguageKeys.result.csvData);
      }
      Responder.success(res, getLanguageKeys.result);
    } else {
      Responder.failed(res, getLanguageKeys.errors);
    }
  }

  static async loadLanguageCsv(req, res) {
    const loadLanguageCsv = await LoadLanguagesCsvService.execute({
      languageCsv: req.file,
      ...req.body,
    });

    if (loadLanguageCsv.successful) {
      Responder.success(res, loadLanguageCsv.result);
    } else {
      Responder.failed(res, loadLanguageCsv.errors);
    }
  }
}
