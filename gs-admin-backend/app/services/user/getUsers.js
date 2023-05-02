import db from "../../db/models";
import { getAll } from "../helper/crud";
import { ROLE } from "../../utils/constant";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { filterByNameEmail, pageValidation } from "../../utils/common";

const constraints = {
  limit: {
    presence: false,
  },
  pageNo: {
    presence: false,
  },
  adminId: {
    presence: false,
  },
  userType: {
    presence: { allowEmpty: false },
  },
  user: {
    presence: false,
  },
  search: {
    presence: false,
  },
  isActive: {
    inclusion: {
      within: ["true", "false", "", null],
      message: "can be true or false",
    },
    presence: false,
  },
  kycStatus: {
    presence: false,
    inclusion: {
      within: [
        "APPROVED",
        "PENDING",
        "REJECTED",
        "REQUESTED",
        "RE_REQUESTED",
        "",
        null,
      ],
      message: "%{value} is invalid",
    },
  },
};

export class GetUsersService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const {
      adminId,
      limit,
      pageNo,
      userType,
      user,
      search,
      isActive,
      kycStatus,
    } = this.filteredArgs;

    try {
      let query;
      const { page, size } = pageValidation(pageNo, limit);

      if (search) query = filterByNameEmail(query, search);
      if (kycStatus) query = { ...query, kycStatus };
      if (userType === ROLE.SUPERADMIN) {
        query = { ...query };
      }

      const users = await db.User.findAndCountAll({
        where: query,
        order: [["createdAt", "DESC"]],
        limit: size,
        offset: (page - 1) * size,
        attributes: [
          "userId",
          "email",
          "firstName",
          "isActive",
          "kycStatus",
          "lastName",
          "username",
        ],
      });

      if (!users) return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { users, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
