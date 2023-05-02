import * as Yup from "yup";

export const adminProfileSchema = Yup.object().shape({
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Invalid Password"
    )
    .max(50)
    .nullable(),
  firstName: Yup.string()
    .min(3, "First Name must be atleast 3 characters")
    .max(200)
    .matches(
      /^[a-zA-Z]+(\s[a-zA-Z]+)?$/,
      "Only Alphabets and Space Allowed and Must Start with Alphabet"
    )
    .required("First Name Required"),
  lastName: Yup.string()
    .min(3, "Last Name must be atleast 3 characters")
    .max(200)
    .matches(
      /^[a-zA-Z]+(\s[a-zA-Z]+)?$/,
      "Only Alphabets and Space Allowed and Must Start with Alphabet"
    )
    .required("Last Name Required"),
  phone: Yup.string()
    .min(10, "Phone must be at least 10 digits")
    .max(20, "Phone must be at most 20 digits")
    .matches(
      /^((\\+[1-9]{1,10}[ \\-]*)|(\\([0-9]{1,10}\\)[ \\-]*)|([0-9]{1,10})[ \\-]*)*?[0-9]{1,10}?[ \\-]*[0-9]{1,10}?$/,
      "Enter a valid Phone Number"
    ),
});

const validUrlRE =
  /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;

export const siteConfigSchema = Yup.object().shape({
  siteName: Yup.string()
    .min(3, "Site name must be at-least 3 characters")
    .max(30, "Site name must be at most 30 characters")
    .nullable(),
  siteUrl: Yup.string().matches(validUrlRE, "Site URL is not valid").nullable(),
  supportEmailAddress: Yup.string()
    .email("Enter a valid email address")
    .nullable(),
  siteLogo: Yup.mixed()
    .test(
      "File Size",
      "File Size Should be Less Than 1MB",
      (value) => !value || (value && value.size <= 1024 * 1024)
    )
    .test(
      "FILE_FORMAT",
      "Uploaded file has unsupported format.",
      (value) =>
        !value ||
        (value && ["image/png", "image/jpeg", "image/jpg"].includes(value.type))
    )
    .nullable(),
});
