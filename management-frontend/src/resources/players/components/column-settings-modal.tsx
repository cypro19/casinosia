import React from "react";
import { GridColumnsPanel, Typography } from "@pankod/refine-mui";
import CloseIcon from "@mui/icons-material/Close";
import {
  SaveButton,
  StyledBtnContainer,
  StyledHeader,
  StyledIconButton,
  StyledModal,
  StyledPaper,
} from "./modal-components";
import { useTranslate } from "@pankod/refine-core";

export function ColumnSettingsModal() {
  const translate = useTranslate();
  const [isModalOpen, setIsModalOpen] = React.useState(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleSubmit = () => {
    handleCloseModal();
  };
  return (
    <StyledModal open={isModalOpen}>
      <StyledPaper>
        <StyledHeader>
          <Typography variant="h5" component="h2">
            {translate("page.players.typography.columnSettings")}
          </Typography>
          <StyledIconButton onClick={handleCloseModal}>
            <CloseIcon />
          </StyledIconButton>
        </StyledHeader>
        <GridColumnsPanel className="gridcolumns" />
        <StyledBtnContainer>
          <SaveButton variant="contained" type="submit" onClick={handleSubmit}>
            {translate("page.players.buttons.save-changes")}
          </SaveButton>
        </StyledBtnContainer>
      </StyledPaper>
    </StyledModal>
  );
}
