import { ERRORS } from "../../utils/errors";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { getUserDetails } from "../../utils/common";
import { insertUpdate } from "../helper/customerIo";
import { customerObject, createConnection } from "../helper/rabbitMq";

const constraints = {
  userId: {
    presence: { allowNull: false },
  },
  tags: {
    presence: { allowNull: false },
  },
};

export class DeleteTagsService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let { userId, tags } = this.filteredArgs;

    try {
      if (typeof tags === "string") tags = JSON.parse(tags);
      tags = new Set(tags);

      const userDetails = await getUserDetails(userId);

      if (userDetails.tags && userDetails.tags.length) {
        const newTags = userDetails.tags.filter((tag) => {
          return !tags.has(tag);
        });

        await userDetails.set({ tags: newTags }).save();
        insertUpdate(userId, { tags: newTags });

        userDetails.domainName = userDetails?.domain;
        const customerDetails = await customerObject(userDetails);
        await createConnection("PostCustomers", customerDetails);
      }

      return { success: true, message: SUCCESS_MSG.DELETE_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
