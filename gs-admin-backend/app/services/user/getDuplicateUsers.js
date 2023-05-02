import { Op } from "sequelize";
import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { getOne } from "../helper/crud";
import { pageValidation } from "../../utils/common";

const constraints = {
  limit: {
    presence: false,
  },
  pageNo: {
    presence: false,
  },
  user: {
    presence: { allowEmpty: false },
  },
  userId: {
    presence: { allowEmpty: false },
  },
};

export class GetDuplicateUsersService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { limit, pageNo, user, userId } = this.filteredArgs;

    try {
      const { page, size } = pageValidation(pageNo, limit);
      const userDetail = await getOne({
        model: db.User,
        data: { userId },
        attributes: [
          "firstName",
          "lastName",
          "email",
          "phone",
          "signInIp",
          "dateOfBirth",
          "username",
          "userId",
        ],
      });

      if (!userDetail)
        return this.addError(ERRORS.NOT_FOUND, "User " + ERROR_MSG.NOT_FOUND);

      let emailName = userDetail.email.split("@")[0];
      emailName = emailName.split("+")[0];
      const query = {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${userDetail.firstName}%` } },
          { lastName: { [Op.iLike]: `%${userDetail.lastName}%` } },
          { email: { [Op.iLike]: `%${emailName}%` } },
          { phone: { [Op.like]: userDetail.phone ? userDetail.phone : " " } },
          {
            signInIp: {
              [Op.eq]: userDetail.signInIp ? userDetail.signInIp : "1.1.1.1",
            },
          },
          { dateOfBirth: { [Op.eq]: userDetail.dateOfBirth } },
          { username: { [Op.iLike]: `%${userDetail.username}%` } },
        ],
      };

      const users = await db.User.findAndCountAll({
        where: query,
        limit: size,
        offset: (page - 1) * size,
        attributes: [
          "firstName",
          "lastName",
          "email",
          "phone",
          "signInIp",
          "dateOfBirth",
          "username",
          "userId",
          "address",
        ],
      });

      return { users, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
