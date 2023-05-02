import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { styled } from "@mui/system";

const StyledSelect = styled(Select)`
  font-family: inherit;
  font-size: 0.875rem;
  padding: ${(props) => {
    return props.theme.spacing(0.125) + " 1 " + props.theme.spacing(1.25);
  }};
  border-radius: 0.3125rem;
  transition: 0.3s all ease-in;

  &:focus,
  &:active,
  &:hover {
    border-color: #747cee;
    color: #747cee;
  }

  &:after,
  &:before {
    display: none;
  }
`;

const ITEM_HEIGHT = 50;
const ITEM_PADDING_TOP = 10;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

type SelectProps = {
  names: string[];
};

export default function MultipleSelect({ names }: SelectProps) {
  const [name, setName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const {
      target: { value },
    } = event;
    setName(typeof value === "string" ? value.split(",") : (value as string[]));
  };

  return (
    <>
      <StyledSelect
        variant="outlined"
        fullWidth
        multiple
        color="info"
        size="small"
        sx={{
          padding: "0.17rem",
        }}
        value={name}
        onChange={handleChange}
        MenuProps={MenuProps}
      >
        {names?.map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </StyledSelect>
    </>
  );
}
