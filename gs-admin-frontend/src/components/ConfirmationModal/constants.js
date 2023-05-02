export const tableHeaders = [
  { label: "User Id", value: user?.userId || "NA" },
  { label: "First Name", value: user?.firstName || "NA" },
  { label: "Last Name", value: user?.lastName || "NA" },
  { label: "Email", value: user?.email || "NA" },
  { label: "User Name", value: user?.username || "NA" },
  { label: "Phone", value: user?.phone || "NA" },
  { label: "SignIn IP", value: user?.signInIp || "NA" },
  {
    label: "DOB",
    value: user?.dateOfBirth ? formatDateYMD(user?.dateOfBirth) : "NA",
  },
  { label: "Address", value: user?.address || "NA" },
];
