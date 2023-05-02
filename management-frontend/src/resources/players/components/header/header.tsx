import { FileDownload } from "@mui/icons-material";
import { useTranslate } from "@pankod/refine-core";
import React from "react";
import {
  ButtonDropDown,
  ButtonGroup,
  Container,
  Heading,
  StyledButton,
} from "./header-components";

export const ListHeader = () => {
  const translate = useTranslate();

  const startIndex = 1;
  const endIndex = 10;
  const totalEntries = 57;
  return (
    <Container>
      <Heading>
        {translate("page.players.entries.showing-entries", {
          startIndex,
          endIndex,
          totalEntries,
        })}
      </Heading>
      <ButtonGroup>
        <StyledButton
          variant="contained"
          sx={{
            backgroundColor: "#6366F1",
            color: "#FFFFFF",
            maxWidth: "7.4375rem",
            maxHeight: "2.625rem",
            borderRadius: "0.75rem",
          }}
          startIcon={<FileDownload />}
        >
          {translate("page.players.buttons.export")}
        </StyledButton>
        <ButtonDropDown />
      </ButtonGroup>
    </Container>
  );
};
