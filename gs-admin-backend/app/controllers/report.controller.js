import Responder from "../../server/expressResponder";
import {
  GetDemoGraphService,
  GetKPISummaryService,
  GetLivePlayerService,
  GetTopTenService,
  GetPlayerLiabilityService,
  GetKPIReportService,
  GetGameReportService,
  ElasticHealthCheckService,
} from "../services/report";

export default class ReportController {
  static async elasticHealthCheck(req, res) {
    const elasticHealthCheck = await ElasticHealthCheckService.execute({
      ...req.query,
      ...req.body,
    });

    Responder.success(res, elasticHealthCheck.result);
  }
  static async getDemographicReport(req, res) {
    const getDemographicReport = await GetDemoGraphService.execute({
      ...req.query,
      ...req.body,
    });

    if (getDemographicReport.successful) {
      if (getDemographicReport.result.csv) {
        res.header("Content-Type", "text/csv");
        res.attachment(getDemographicReport.result.fileName);
        return res.send(getDemographicReport.result.csvData);
      }
      Responder.success(res, getDemographicReport.result);
    } else {
      Responder.failed(res, getDemographicReport.errors);
    }
  }

  static async getLivePlayerReport(req, res) {
    const getLivePlayerReport = await GetLivePlayerService.execute({
      ...req.query,
      ...req.body,
    });

    if (getLivePlayerReport.successful) {
      Responder.success(res, getLivePlayerReport.result);
    } else {
      Responder.failed(res, getLivePlayerReport.errors);
    }
  }

  static async getTopTen(req, res) {
    const getTopTen = await GetTopTenService.execute({
      ...req.query,
      ...req.body,
    });

    if (getTopTen.successful) {
      Responder.success(res, getTopTen.result);
    } else {
      Responder.failed(res, getTopTen.errors);
    }
  }

  static async getPlayerLiabilityReport(req, res) {
    const getPlayerLiabilityReport = await GetPlayerLiabilityService.execute({
      ...req.query,
      ...req.body,
    });

    if (getPlayerLiabilityReport.successful) {
      if (getPlayerLiabilityReport.result.csv) {
        res.header("Content-Type", "text/csv");
        res.attachment(getPlayerLiabilityReport.result.fileName);
        return res.send(getPlayerLiabilityReport.result.csvData);
      }
      Responder.success(res, getPlayerLiabilityReport.result);
    } else {
      Responder.failed(res, getPlayerLiabilityReport.errors);
    }
  }

  static async getKPIReport(req, res) {
    const getKPIReport = await GetKPISummaryService.execute({
      ...req.query,
      ...req.body,
    });

    if (getKPIReport.successful) {
      if (getKPIReport.result.csv) {
        res.header("Content-Type", "text/csv");
        res.attachment(getKPIReport.result.fileName);
        return res.send(getKPIReport.result.csvData);
      }
      Responder.success(res, getKPIReport.result);
    } else {
      Responder.failed(res, getKPIReport.errors);
    }
  }

  static async getKPIProviderReport(req, res) {
    const getKPIProviderReport = await GetKPIReportService.execute({
      ...req.query,
      ...req.body,
    });

    if (getKPIProviderReport.successful) {
      if (getKPIProviderReport.result.csv) {
        res.header("Content-Type", "text/csv");
        res.attachment(getKPIProviderReport.result.fileName);
        return res.send(getKPIProviderReport.result.csvData);
      }
      Responder.success(res, getKPIProviderReport.result);
    } else {
      Responder.failed(res, getKPIProviderReport.errors);
    }
  }

  static async getGameReport(req, res) {
    const getGamerReport = await GetGameReportService.execute({
      ...req.query,
      ...req.body,
    });

    if (getGamerReport.successful) {
      if (getGamerReport.result.csv) {
        res.header("Content-Type", "application/vnd.ms-excel");
        res.attachment(getGamerReport.result.fileName);
        return res.send(getGamerReport.result.csvData);
      }
      Responder.success(res, getGamerReport.result);
    } else {
      Responder.failed(res, getGamerReport.errors);
    }
  }
}
