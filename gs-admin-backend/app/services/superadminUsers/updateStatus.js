import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { insertUpdate } from "../helper/customerIo";
import { updateEntity, getOne } from "../helper/crud";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import {
  EMAIL_SUBJECTS,
  EMAIL_TEMPLATE_TYPES,
  ROLE,
  TOGGLE_CASE,
} from "../../utils/constant";
import {
  createEmailWithDynamicValues,
  getSendGridCredentials,
  sendDynamicMail,
} from "../helper/email";

const constraints = {
  id: {
    presence: { allowEmpty: false },
  },
  user: {
    presence: { allowEmpty: false },
  },
  adminId: {
    presence: false,
  },
  userId: {
    presence: false,
  },
  code: {
    presence: { allowEmpty: false },
  },
  status: {
    type: "boolean",
    presence: { allowEmpty: false },
  },
  userType: {
    presence: { allowEmpty: false },
  },
  affiliateId: {
    presence: false,
  },
  cmsPageId: {
    presence: false,
  },
  masterGameSubCategoryId: {
    presence: false,
  },
  masterCasinoGameId: {
    presence: false,
  },
  masterCasinoProviderId: {
    presence: false,
  },
  masterGameAggregatorId: {
    presence: false,
  },
  masterGameCategoryId: {
    presence: false,
  },
  bonusId: {
    presence: false,
  },
  languageId: {
    presence: false,
  },
  reason: {
    presence: false,
  },
};

export class UpdateStatusService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async checkExist({ model, data, include = undefined }) {
    const checkExist = await getOne({ model, data, include });
    if (!checkExist) return false;
    return true;
  }

  async run() {
    const {
      code,
      status,
      adminId,
      user,
      id,
      userType,
      bonusId,
      affiliateId,
      userId,
      cmsPageId,
      masterGameSubCategoryId,
      masterGameCategoryId,
      masterCasinoGameId,
      masterCasinoProviderId,
      masterGameAggregatorId,
      reason,
      languageId,
    } = this.filteredArgs;

    let model, values, response;

    const t = await db.sequelize.transaction();

    let data = { isActive: status };

    try {
      switch (code) {
        case TOGGLE_CASE.SUPERADMIN: {
          if (userType !== ROLE.SUPERADMIN)
            return this.addError(ERRORS.UNAUTHORIZED, ERROR_MSG.NOT_ALLOWED);
          if (!adminId)
            return this.addError(
              ERRORS.BAD_DATA,
              "Superadmin " + ERROR_MSG.ID_REQUIRED
            );
          if (
            !(await this.checkExist({
              model: db.SuperAdminUser,
              data: { superAdminUserId: adminId },
            }))
          ) {
            return this.addError(
              ERRORS.BAD_DATA,
              "Superadmin " + ERROR_MSG.NOT_EXISTS
            );
          }
          const superAdminDetails = await getOne({
            model: db.SuperAdminUser,
            data: { superAdminUserId: adminId },
          });
          //if (superAdminDetails.superRoleId === 1) return this.addError(ERRORS.UNAUTHORIZED, ERROR_MSG.NOT_ALLOWED)

          model = db.SuperAdminUser;
          values = { superAdminUserId: adminId };
          break;
        }

        case TOGGLE_CASE.ADMIN: {
          if (!adminId)
            return this.addError(
              ERRORS.BAD_DATA,
              "Admin " + ERROR_MSG.ID_REQUIRED
            );
          if (userType === ROLE.ADMIN && user.adminUserId !== id)
            return this.addError(ERRORS.UNAUTHORIZED, ERROR_MSG.NOT_ALLOWED);
          if (adminId === id && userType !== ROLE.SUPERADMIN)
            return this.addError(
              ERRORS.BAD_DATA,
              "Status update " + ERROR_MSG.FAILED
            );
          if (
            !(await this.checkExist({
              model: db.AdminUser,
              data: { adminUserId: adminId },
            }))
          ) {
            return this.addError(
              ERRORS.BAD_DATA,
              "Admin " + ERROR_MSG.NOT_EXISTS
            );
          }

          model = db.AdminUser;
          values = { adminUserId: adminId };
          break;
        }

        case TOGGLE_CASE.AFFILIATE: {
          if (userType !== ROLE.ADMIN)
            return this.addError(ERRORS.UNAUTHORIZED, ERROR_MSG.NOT_ALLOWED);
          if (!affiliateId)
            return this.addError(
              ERRORS.BAD_DATA,
              "Affiliate " + ERROR_MSG.ID_REQUIRED
            );
          if (adminId === id)
            return this.addError(
              ERRORS.BAD_DATA,
              "Status update " + ERROR_MSG.FAILED
            );
          if (
            !(await this.checkExist({
              model: db.Affiliate,
              data: { affiliateId },
            }))
          ) {
            return this.addError(
              ERRORS.BAD_DATA,
              "Affiliate " + ERROR_MSG.NOT_EXISTS
            );
          }

          model = db.Affiliate;
          values = { affiliateId };
          break;
        }

        case TOGGLE_CASE.USER: {
          if (!userId)
            return this.addError(
              ERRORS.BAD_DATA,
              "User " + ERROR_MSG.ID_REQUIRED
            );
          const query = { userId };
          if (userType === ROLE.SUPERADMIN)
            return this.addError(ERRORS.BAD_REQUEST, ERROR_MSG.NOT_ALLOWED);
          // if (userType === ROLE.ADMIN && user.adminRoleId !== 1) query = { ...query, parentId: user.parentId, parentType: userType }
          if (!reason && !status)
            return this.addError(ERRORS.BAD_DATA, ERROR_MSG.REASON_REQUIRED);

          const disableUser = await getOne({ model: db.User, data: query });

          if (!disableUser) {
            return this.addError(
              ERRORS.BAD_DATA,
              "User " + ERROR_MSG.NOT_EXISTS
            );
          }

          const credentials = await getSendGridCredentials();

          if (Object.keys(credentials).length === 2) {
            let emailSent;
            if (status) {
              const dynamicEmail = await createEmailWithDynamicValues({
                emailType:
                  EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[
                    EMAIL_TEMPLATE_TYPES.ACTIVE_USER
                  ],
                userId,
                serviceData: {
                  subject: EMAIL_SUBJECTS.userActivate,
                },
              });

              emailSent = await sendDynamicMail({
                user: disableUser,
                credentials,
                subject: EMAIL_SUBJECTS.userActivate,
                successMsg: SUCCESS_MSG.EMAIL_SUCCESS,
                dynamicEmail,
                senderName: "-----------------------",
              });
            } else {
              const dynamicEmail = await createEmailWithDynamicValues({
                emailType:
                  EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[
                    EMAIL_TEMPLATE_TYPES.IN_ACTIVE_USER
                  ],
                userId,
                serviceData: {
                  subject: EMAIL_SUBJECTS.userDeactivate,
                  reason,
                },
              });

              emailSent = await sendDynamicMail({
                user: disableUser,
                credentials,
                subject: EMAIL_SUBJECTS.userDeactivate,
                successMsg: SUCCESS_MSG.EMAIL_SUCCESS,
                dynamicEmail,
                senderName: "-----------------",
              });
            }

            response = { ...response, emailSent };
          }

          model = db.User;
          values = query;

          if (status) {
            data = {
              ...data,
              disabledAt: null,
              disabledByType: null,
              disabledById: null,
              disableReason: null,
            };
          } else {
            data = {
              ...data,
              disabledAt: new Date(),
              disabledByType: userType,
              disabledById: id,
              disableReason: reason,
            };
          }

          insertUpdate(userId, { is_active: data.isActive });
          break;
        }

        case TOGGLE_CASE.CMS: {
          if (!cmsPageId)
            return this.addError(
              ERRORS.BAD_DATA,
              "CMS " + ERROR_MSG.ID_REQUIRED
            );
          if (
            !(await this.checkExist({ model: db.CmsPage, data: { cmsPageId } }))
          ) {
            return this.addError(
              ERRORS.BAD_DATA,
              "CMS " + ERROR_MSG.NOT_EXISTS
            );
          }

          model = db.CmsPage;
          values = { cmsPageId };
          break;
        }

        case TOGGLE_CASE.CASINO_CATEGORY: {
          // if (userType !== ROLE.ADMIN) return this.addError(ERRORS.UNAUTHORIZED, ERROR_MSG.NOT_ALLOWED)
          if (!masterGameCategoryId)
            return this.addError(
              ERRORS.BAD_DATA,
              "Casino category " + ERROR_MSG.ID_REQUIRED
            );
          if (
            !(await this.checkExist({
              model: db.MasterGameCategory,
              data: { masterGameCategoryId },
            }))
          ) {
            return this.addError(
              ERRORS.BAD_DATA,
              "Casino category " + ERROR_MSG.NOT_EXISTS
            );
          }

          model = db.MasterGameCategory;
          values = { masterGameCategoryId };
          break;
        }

        case TOGGLE_CASE.CASINO_SUB_CATEGORY: {
          // if (userType !== ROLE.ADMIN) return this.addError(ERRORS.UNAUTHORIZED, ERROR_MSG.NOT_ALLOWED)
          if (!masterGameSubCategoryId)
            return this.addError(
              ERRORS.BAD_DATA,
              "Casino sub category " + ERROR_MSG.ID_REQUIRED
            );
          if (
            !(await this.checkExist({
              model: db.MasterGameSubCategory,
              data: { masterGameSubCategoryId },
              include: [{ model: db.MasterGameCategory }],
            }))
          ) {
            return this.addError(
              ERRORS.BAD_DATA,
              "Casino sub category " + ERROR_MSG.NOT_EXISTS
            );
          }

          model = db.MasterGameSubCategory;
          values = { masterGameSubCategoryId };
          break;
        }

        case TOGGLE_CASE.CATEGORY_GAME: {
          // if (userType !== ROLE.ADMIN) return this.addError(ERRORS.UNAUTHORIZED, ERROR_MSG.NOT_ALLOWED)
          if (!masterGameCategoryId)
            return this.addError(
              ERRORS.BAD_DATA,
              "Master Category game " + ERROR_MSG.ID_REQUIRED
            );
          if (!masterGameSubCategoryId)
            return this.addError(
              ERRORS.BAD_DATA,
              "Master Game sub category " + ERROR_MSG.ID_REQUIRED
            );
          if (
            !(await this.checkExist({
              model: db.MasterGameSubCategory,
              data: { masterGameSubCategoryId },
              include: [{ model: db.MasterGameCategory }],
            }))
          ) {
            return this.addError(
              ERRORS.BAD_DATA,
              "Category game " + ERROR_MSG.NOT_EXISTS
            );
          }
          model = db.MasterGameCategory;
          values = { masterGameCategoryId };
          break;
        }

        case TOGGLE_CASE.CASINO_GAME: {
          // if (userType !== ROLE.SUPERADMIN) return this.addError(ERRORS.UNAUTHORIZED, ERROR_MSG.NOT_ALLOWED)
          if (!masterCasinoGameId)
            return this.addError(
              ERRORS.BAD_DATA,
              "Casino Game " + ERROR_MSG.ID_REQUIRED
            );
          if (
            !(await this.checkExist({
              model: db.MasterCasinoGame,
              data: { masterCasinoGameId },
            }))
          ) {
            return this.addError(
              ERRORS.BAD_DATA,
              "Casino Game " + ERROR_MSG.NOT_EXISTS
            );
          }

          model = db.MasterCasinoGame;
          values = { masterCasinoGameId };
          break;
        }

        case TOGGLE_CASE.CASINO_PROVIDER: {
          // if (userType !== ROLE.SUPERADMIN) return this.addError(ERRORS.UNAUTHORIZED, ERROR_MSG.NOT_ALLOWED)
          if (!masterCasinoProviderId)
            return this.addError(
              ERRORS.BAD_DATA,
              "Casino Provider " + ERROR_MSG.ID_REQUIRED
            );
          if (
            !(await this.checkExist({
              model: db.MasterCasinoProvider,
              data: { masterCasinoProviderId },
            }))
          ) {
            return this.addError(
              ERRORS.BAD_DATA,
              "Casino Provider " + ERROR_MSG.NOT_EXISTS
            );
          }

          model = db.MasterCasinoProvider;
          values = { masterCasinoProviderId };
          break;
        }

        case TOGGLE_CASE.AGGREGATOR: {
          // if (userType !== ROLE.SUPERADMIN) return this.addError(ERRORS.UNAUTHORIZED, ERROR_MSG.NOT_ALLOWED)
          if (!masterGameAggregatorId)
            return this.addError(
              ERRORS.BAD_DATA,
              "Aggregator " + ERROR_MSG.ID_REQUIRED
            );
          if (
            !(await this.checkExist({
              model: db.MasterGameAggregator,
              data: { masterGameAggregatorId },
            }))
          ) {
            return this.addError(
              ERRORS.BAD_DATA,
              "Aggregator " + ERROR_MSG.NOT_EXISTS
            );
          }

          model = db.MasterGameAggregator;
          values = { masterGameAggregatorId };
          break;
        }

        case TOGGLE_CASE.BONUS: {
          if (!bonusId)
            return this.addError(
              ERRORS.BAD_DATA,
              "Bonus " + ERROR_MSG.ID_REQUIRED
            );
          let query = { bonusId };

          if (!(await this.checkExist({ model: db.Bonus, data: query }))) {
            return this.addError(
              ERRORS.BAD_DATA,
              "Bonus " + ERROR_MSG.NOT_EXISTS
            );
          }

          model = db.Bonus;
          values = query;
          break;
        }
        case TOGGLE_CASE.LANGUAGE: {
          if (!languageId)
            return this.addError(
              ERRORS.BAD_DATA,
              "language " + ERROR_MSG.ID_REQUIRED
            );
          let query = { languageId };

          if (!(await this.checkExist({ model: db.Language, data: query }))) {
            return this.addError(
              ERRORS.BAD_DATA,
              "language " + ERROR_MSG.NOT_EXISTS
            );
          }

          model = db.Language;
          values = query;
          break;
        }

        default: {
          return this.addError(ERRORS.BAD_DATA, ERROR_MSG.TOGGLE_CASE_ERROR);
        }
      }

      const updatedValue = await updateEntity({
        model,
        values,
        data,
        transaction: t,
      });

      await t.commit();
      return {
        updatedValue: { updatedValue, ...response },
        message: SUCCESS_MSG.STATUS_UPDATED,
      };
    } catch (error) {
      console.log(error);
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
