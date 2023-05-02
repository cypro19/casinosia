import * as Yup from "yup";

export const loyaltyLevelSchema = () =>
  Yup.object().shape({
    loyaltyLevel: Yup.array().of(
      Yup.object()
        .shape({
          startPoint: Yup.number()
            .typeError("Only Numbers Allowed")
            .required("Value Required.")
            .min(0, "Must be Greater Than 0")
            .max(9999999, "Must be Less Than 9999999")
            .integer("Only Integer Values Allowed."),
          endPoint: Yup.number()
            .typeError("Only Numbers Allowed")
            .required("Value Required.")
            .min(0, "Must be Greater Than 0")
            .test(
              "isLarger",
              "End Point Must Be Greater Than Start Point",
              (value, testContext) => {
                if (testContext.parent.startPoint >= value) return false;
                return true;
              }
            )
            .integer("Only Integer Values Allowed."),
          cashback_multiplier: Yup.number()
            .typeError("Only Numbers Allowed")
            .required("Value Required.")
            .min(0, "Must be Greater Than 0")
            .max(9999, "Must be Less Than 9999"),
        })
        .test(
          "startPoint",
          {
            startPoint:
              "Start Point Must Be Equal To Previous Level End Point and Must be in Continuation",
          },
          validateAgainstPrevious
        )
    ),
  });

function validateAgainstPrevious(currentVal) {
  const { options, parent } = this;
  if (
    options.index > 0 &&
    parent?.[options.index - 1]?.endPoint !== currentVal.startPoint
  ) {
    return false;
  }
  return true;
}
