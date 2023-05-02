import React from "react";
import { styled } from "@mui/system";
import { useTranslate } from "@pankod/refine-core";
import { Breadcrumbs, Link, Typography, Box } from "@mui/material";

const PageHeaderWrapper = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => {
    return props.theme.spacing(0.9375);
  }};
`;

const PageHeaderTitle = styled(Typography)`
  font-size: 1rem;
  font-weight: 700;
  color: #6e757c;
`;

const Header = () => {
  const translate = useTranslate();

  return (
    <>
      <PageHeaderWrapper>
        <PageHeaderTitle variant="h1">
          {translate("page.games.name")}
        </PageHeaderTitle>

        <div className="breadcrumbs">
          <Breadcrumbs aria-label="breadcrumbs">
            <Link underline="hover" color="inherit" href="/">
              {translate("page.dashboard.name")}
            </Link>
            <Typography color="text.primary">
              {translate("page.games.name")}
            </Typography>
          </Breadcrumbs>
        </div>
      </PageHeaderWrapper>
    </>
  );
};

export default Header;
