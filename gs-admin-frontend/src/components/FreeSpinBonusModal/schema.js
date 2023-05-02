import * as Yup from "yup";
import { formatDateYMD } from "../../utils/dateFormatter";

export const freeSpinFormSchema = () =>
  Yup.object().shape({
    quantity: Yup.number()
      .min(1, "Minimum 1 Spin Required")
      .positive("Spins Must be a Positive Number")
      .integer("Spins Must be an Integer Value")
      .required("Spins Required"),
    betLevel: Yup.number()
      .min(1, "Minimum 1 Bet Level Required")
      .positive("Bet Level Must be a Positive Number")
      .integer("Bet Level Must be an Integer Value")
      .required("Bet Level Required"),
    bonusId: Yup.string().required("Bonus Required"),
    validFrom: Yup.date()
      .min(
        formatDateYMD(new Date()),
        "Valid From Must be Greater Than or Equal To Today's Date"
      )
      .nullable(),
    validTo: Yup.date()
      .test(
        "isSmall",
        "Valid To Must Be Greater Than Valid From",
        (value, context) => {
          if (value.getTime() <= context.parent.validFrom.getTime()) {
            return false;
          } else {
            return true;
          }
        }
      )
      .test(
        "isLess",
        "Valid To Must Be In The Range Of One Month From Valid From Date",
        (value, context) => {
          const validFromDate = context.parent.validFrom;
          validFromDate.setDate(validFromDate.getDate() + 30);
          if (value.getTime() <= validFromDate.getTime()) {
            return true;
          } else {
            return false;
          }
        }
      ),
  });
