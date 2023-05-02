import React from "react";
import { IconPicker } from "react-fa-icon-picker";

const CustomIconPicker = ({
  myIconColor,
  setMyIconName,
  myIconName,
  setItemStyle,
}) => (
  <IconPicker
    value={myIconName}
    onChange={(v) => setMyIconName(v)}
    containerStyles={{
      marginLeft: "300px",
      width: "350px",
      marginTop: "30px",
      display: setItemStyle && "none",
    }}
    pickerIconStyles={{
      margin: setItemStyle ? "1px" : "10px",
      fontSize: setItemStyle ? "25px" : "50px",
      color: myIconColor,
    }}
    searchInputStyles={{
      height: "40px",
      fontFamily: "Helvetica",
      fontSize: "17px",
      margin: "10px",
      paddingLeft: "15px",
    }}
    buttonStyles={{
      border: "none",
      width: setItemStyle && "auto",
    }}
    buttonIconStyles={{
      fontSize: setItemStyle ? "25px" : "50px",
      color: myIconColor,
    }}
  />
);

export default CustomIconPicker;
