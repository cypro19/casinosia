import { Card } from "@mui/material";
import { styled } from "@mui/system";

export const StyledCard = styled(Card)`
  background-color: #ffffff;
  box-shadow: 0rem 0rem 0rem 0.0313rem rgba(0, 0, 0, 0.03),
    0rem 0.3125rem 1.375rem rgba(0, 0, 0, 0.04);
  border-radius: 1.25rem;
  padding: ${(props) => {
    return props.theme.spacing(2.3);
  }};
  margin-bottom: ${(props) => {
    return props.theme.spacing(2.3);
  }};
  margin-top: ${(props) => {
    return props.theme.spacing(2.3);
  }};
  text-align: start;
  min-width: 87rem;
  height: 11.875rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;

  .player_report {
    font-family: "Plus Jakarta Sans";
    font-size: 1.125rem;
    font-weight: 700;
    line-height: 1.375rem;
    letter-spacing: 0rem;
    text-align: left;
    min-height: 50%;
  }

  .row {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    width: 100%;
    flex: 1;
  }

  .box {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;
    flex: 1;
  }

  .label_box {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .label {
    font-family: "Plus Jakarta Sans";
    font-style: normal;
    font-weight: 700;
    font-size: 1.125rem;
    line-height: 120%;
    color: #111927;
  }

  .content_box {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .content {
    font-family: "Plus Jakarta Sans";
    font-style: normal;
    font-weight: 700;
    font-size: 2.25rem;
    line-height: 120%;
    color: #111927;
  }
  .text-center {
    display: flex;
    text-align: center;
  }
`;
