import { styled } from "@mui/system";
import { Box, Button } from "@mui/material";
import { Avatar, DataGrid } from "@pankod/refine-mui";

export const PageContainer = styled(Box)`
  max-width: 87rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justicy-content: center;
  flex-direction: column;
  row-gap: ${(props) => {
    return props.theme.spacing(2);
  }};
  padding-bottom: ${(props) => {
    return props.theme.spacing(2);
  }};

  .flex {
    display: flex;
  }

  .fullwidth {
    min-width: 100%;
  }

  .flex-start {
    align-items: center;
    justify-content: flex-start;
  }

  .flex-col-box {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .column {
    flex-direction: column;
  }

  .chip-default {
    font-size: 0.75rem;
    background-color: lightblue;
  }

  .chip {
    font-size: 0.75rem;
    color: white;
  }
  .verified {
    background-color: #15b79e;
  }
  .vip {
    background-color: #f79009;
  }
  .affiliate {
    background-color: #f04438;
  }
  .user-code {
    font-size: 0.8125rem;
  }
  .country {
    background-color: #6941c6;
    margin-right: 0.5rem;
    border: none;
    span {
      display: none;
    }
  }

  .text-normal {
    font-size: 0.875rem;
  }
  .text-bold {
    font-weight: bold;
  }
  .text-bold-black {
    font-weight: bold;
    color: black;
  }

  .text-active {
    font-weight: bold;
    color: #15b79e;
  }

  .full-name {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.8125rem;
  }

  .email {
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.375rem;
  }

  .personal-details-container {
    justify-content: flex-start;
    align-items: center;
    max-height: 50%;
    padding: ${(props) => {
      return props.theme.spacing(0.4375) + " " + props.theme.spacing(1);
    }};
    gap: 1rem;
    margin: 1rem;
    margin-left: 0;
    align-self: stretch;
    height: 5.5rem;
    overflow: none;

    .avatar {
      background-color: gray;
      width: 4rem;
      height: 4rem;
      border: 0.5rem solid #ffffff;
      border-radius: 6.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .personal-details-box {
      box-sizing: border-box;

      .content-box {
        flex-gap: 1rem;
        align-items: center;
        justify-content: flex-start;
        margin-left: 0;
        gap: 0.6rem;
        box-sizing: border-box;
      }
    }

    .content-email {
      align-items: center;
      justify-content: flex-start;
      margin-left: 0;
      gap: 0.6rem;
      box-sizing: border-box;
      margin-top: 0.15rem;
    }
  }
  .personal-details-container-vertical {
    gap: 0.6rem;
    box-sizing: border-box;
    width: 100%;
    margin-left: 1.2rem;
    .item {
      align-items: flex-start;
      justify-content: flex-start;
      flex: 1;
      .details-head {
        font-size: 1.125rem;
        font-weight: 700;
        line-height: 1.35rem;
      }
      .details-sub {
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5rem;
      }
    }
  }

  .panels-container {
    gap: 2rem;

    .info {
      justify-content: center;
      align-items: flex-start;
      padding: 0rem;
      min-width: 100%;
      gap: 0.5rem;
    }

    .info-table {
      align-items: flex-start;
      padding: 0rem;
      min-width: 100%;
    }
  }

  .styled-list {
    text-align: center;
    flex: 1;
    width: 100%;
    padding-top: ${(props) => {
      return props.theme.spacing(0.9375);
    }};
    .list-item {
      padding: 0;
      display: flex;
      justify-content: space-between;

      text-align: start;
      padding: ${(props) => {
        return props.theme.spacing(0.625) + " " + props.theme.spacing(0);
      }};
      flex: 1;
      border-bottom: 0.0625rem solid #f2f4f7;
      line-height: 1.375rem;
      margin: 0;
      color: #111927;
      padding-bottom: 0.3rem;
    }
  }
  .chip-avatar {
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .panels-main {
    flex-flow: row wrap;
    max-width: 100%;
    overflow: none;
  }

  .panels-row {
    gap: 2rem;
    margin-bottom: 1rem;
  }
  .panels-small-box {
    justify-content: space-between;
    align-items: flex-start;
    padding: 0.3rem;
    marginbottom: 0.5rem;
  }

  .chips-box {
    justify-content: center;
    align-items: flex-start;
    padding: 0.3rem;
    marginbottom: 0.5rem;
    gap: 0.5rem;
  }

  .info-horizontal {
    justify-content: center;
    align-items: flex-start;
    padding: 0rem;
    min-width: 100%;
    gap: 0.5rem;
  }

  .list-row {
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    text-align: center;
    flex: 1;
    padding: 0;
  }
`;

export const Container = styled(Box)`
  width: 87rem;
  height: 13.125rem;
  display: flex;
  flex-direction: column;
  padding: ${(props) => {
    return props.theme.spacing(0.4375) + " " + props.theme.spacing(1);
  }};
  margin: 0;
  border-radius: 1.25rem;
  background-color: #6941c6;
  box-sizing: border-box;
  color: white;
`;

export const DataGridBox = styled(Box)`
  max-width: 87rem;
  flex: 1;
`;
export const StyledDataGrid = styled(DataGrid)`
  width: 87rem;
  background-color: white;
  border-radius: 1.25rem;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-color: white;
  flex: 1;
`;

export const StyledButton = styled(Button)`
  border-radius: 1rem;
`;
