import styled from "styled-components";
import { Panel } from "./Panel";
import Link from "next/link";

const StyledPanel = styled(Panel)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Left = styled.div`
  display: flex;
  column-gap: 30px;
`;

const Right = styled.div`
  display: flex;
  column-gap: 10px;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 5px;
  justify-content: center;

  h2 {
    font-size: 15px;
    color: ${(props) => props.theme.page.profile.panel.heading};
    font-weight: 400;
    transition: 0.3s all ease-in;
  }

  p {
    font-size: 18px;
    color: ${(props) => props.theme.page.profile.panel.text};
    font-weight: 600;
    transition: 0.3s all ease-in;
  }
`;

const Balance = styled(Box)`
  padding-right: 30px;
  border-right: 1px solid #b5b9c9;

  p {
    font-size: 30px;
  }
`;

const StyledLink = styled(Link)`
  height: 40px;
  padding: 0 37px;
  border-radius: 20px;
  background-color: ${(props) =>
    props.theme.page.profile.panel.button.solid.background};
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.page.profile.panel.button.solid.text};
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: 0.3s all ease-in;

  &.outlined {
    border: 1px solid
      ${(props) => props.theme.page.profile.panel.button.outlined.border};
    background: ${(props) =>
      props.theme.page.profile.panel.button.outlined.background};
    color: ${(props) => props.theme.page.profile.panel.button.outlined.text};
  }
`;

export const WalletInfo = () => {
  return (
    <StyledPanel>
      <Left>
        <Balance>
          <h2>Balance</h2>
          <p>0 EUR</p>
        </Balance>
        <Box>
          <h2>Withdrawal</h2>
          <p>0 EUR</p>
        </Box>
        <Box>
          <h2>Bonus</h2>
          <p>20.12 EUR</p>
        </Box>
        <Box>
          <h2>Top Badges</h2>
          <p>220</p>
        </Box>
      </Left>
      <Right>
        <StyledLink href="/my-profile/deposit">Deposit</StyledLink>
        <StyledLink className="outlined" href="/my-profile/cashier">
          Cashier
        </StyledLink>
      </Right>
    </StyledPanel>
  );
};
