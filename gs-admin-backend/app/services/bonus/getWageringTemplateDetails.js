import db from "../../db/models";
import { getOne } from "../helper/crud";
import { ROLE } from "../../utils/constant";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { filterByName, pageValidation } from "../../utils/common";

const constraints = {
  limit: {
    presence: false,
  },
  pageNo: {
    presence: false,
  },
  id: {
    presence: { allowEmpty: false },
  },
  userType: {
    presence: { allowEmpty: false },
  },
  wageringTemplateId: {
    presence: { allowEmpty: false },
  },
  providerId: {
    presence: false,
  },
  search: {
    presence: false,
  },
  user: {
    presence: false,
  },
};

export class GetWageringTemplateDetails extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let query;
    const {
      limit,
      pageNo,
      wageringTemplateId,
      userType,
      providerId,
      search,
      user,
    } = this.filteredArgs;

    try {
      const { page, size } = pageValidation(pageNo, limit);

      const getTemplateDetail = await getOne({
        model: db.WageringTemplate,
        data: { wageringTemplateId },
      });

      if (!getTemplateDetail)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);
      if (
        userType === ROLE.ADMIN &&
        getTemplateDetail.parentType === ROLE.ADMIN
      ) {
        if (
          user.adminRoleId !== 1 &&
          getTemplateDetail.parentId !== user.parentId
        ) {
          return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);
        } else if (
          user.adminRoleId === 1 &&
          getTemplateDetail.parentId !== user.adminUserId
        ) {
          return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);
        }
      }
      if (search) query = filterByName(query, search);
      if (providerId) query = { ...query, masterCasinoProviderId: providerId };

      const gameDetail = await db.MasterCasinoGame.findAndCountAll({
        where: query,
        attributes: [
          "name",
          "masterCasinoProviderId",
          "returnToPlayer",
          "masterCasinoGameId",
          "wageringContribution",
        ],
        limit: size,
        offset: (page - 1) * size,
      });

      return {
        ...{
          gameDetail,
          gameContribution: getTemplateDetail.gameContribution,
          name: getTemplateDetail.name,
        },
        message: SUCCESS_MSG.GET_SUCCESS,
      };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
