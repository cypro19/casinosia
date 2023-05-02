export const profileConstants = [
  { key: "First Name", value: "firstName", edit: true },
  { key: "Last Name", value: "lastName", edit: true },
  { key: "Email", value: "email" },
  { key: "Password", value: "password", edit: true },
  { key: "User Name", value: "superAdminUsername" },
  { key: "Role", value: "SuperadminRole", subValue: "name" },
  { key: "Group", value: "group" },
];

export const profileConstantsTA = [
  { key: "First Name", value: "firstName", edit: true },
  { key: "Last Name", value: "lastName", edit: true },
  { key: "Email", value: "email" },
  { key: "Password", value: "password", edit: true },
  { key: "Phone", value: "phone", edit: true },
  { key: "Role", value: "AdminRole", subValue: "name" },
  { key: "Admin Code", value: "agentName" },
  { key: "Group", value: "group" },
];

export const permissionLabel = (label) => {
  switch (label) {
    case "C":
      return "Create";
    case "R":
      return "Read";
    case "U":
      return "Update";
    case "D":
      return "Delete";
    case "T":
      return "Toggle Status";
    case "A":
      return "Apply";
    case "CC":
      return "Create Custom";
    case "AB":
      return "Manage Wallet";
    case "SR":
      return "Limit";
    case "TE":
      return "Test Email";
    default:
      return label;
  }
};
