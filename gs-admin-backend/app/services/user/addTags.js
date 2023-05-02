import db from "../../db/models";
import { Op, Sequelize } from "sequelize";
import { ERRORS } from "../../utils/errors";
import { getAll, getOne } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { getUserDetails } from "../../utils/common";
import { insertUpdate } from "../helper/customerIo";
import { customerObject, createConnection } from "../helper/rabbitMq";

const constraints = {
  parentId: {
    presence: false,
  },
  userId: {
    presence: false,
  },
  tags: {
    presence: { allowNull: false },
  },
  customTag: {
    presence: false,
  },
  users: {
    presence: false,
  },
};

export class AddTagsService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let { userId, parentId, tags, customTag, users } = this.filteredArgs;

    try {
      if (typeof tags === "string") tags = JSON.parse(tags);
      tags = [...new Set(tags)];

      if (users && users.length) {
        if (typeof users === "string") users = JSON.parse(users);
        users = [...new Set(users)];

        const allUsersDetails = await getAll({
          model: db.User,
          data: { userId: { [Op.in]: users } },
          include: [{ model: db.Wallet, as: "userWallet" }],
        });

        await allUsersDetails.forEach(async (user) => {
          let newTags = tags;
          if (user.tags && user.tags.length)
            newTags = [...new Set([...user.tags, ...tags])];

          await user.set({ tags: newTags }).save();
          insertUpdate(user.userId, { tags: newTags });

          user.domainName = user?.domain;
          const customerDetails = await customerObject(user);
          await createConnection("PostCustomers", customerDetails);
        });

        const admins = await db.User.findAll({
          attributes: [
            Sequelize.fn("DISTINCT", Sequelize.col("parent_id")),
            "parentId",
          ],
          distinct: true,
          where: { userId: users },
        }).map((obj) => {
          return obj.parentId;
        });

        const adminList = await getAll({
          model: db.AdminUserSetting,
          data: { adminUserId: { [Op.in]: admins }, key: "TAGS" },
          attributes: ["adminUserSettingId", "value"],
        });

        let newValues = tags;
        await adminList.forEach(async (admin) => {
          if (admin.value) newValues = [...new Set([...admin.value, ...tags])];
          await admin.set({ value: newValues }).save();
        });
      } else {
        const userDetails = await getUserDetails(userId);
        await userDetails.set({ tags }).save();
        insertUpdate(userId, { tags });

        userDetails.domainName = userDetails?.domain;
        const customerDetails = await customerObject(userDetails);
        await createConnection("PostCustomers", customerDetails);

        if (customTag) {
          const tagsList = await getOne({
            model: db.AdminUserSetting,
            data: { adminUserId: parentId, key: "TAGS" },
            attributes: ["adminUserSettingId", "value"],
          });

          let newValues = tags;
          if (tagsList.value)
            newValues = [...new Set([...tagsList.value, ...tags])];

          await tagsList.set({ value: newValues }).save();
        }
      }

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
