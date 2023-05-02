import styled from "styled-components";
import { Panel } from "./Panel";
import Link from "next/link";

const StyledPanel = styled(Panel)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #4959e8;
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
  row-gap: 8px;
  justify-content: center;

  h2 {
    font-size: 15px;
    color: #aeb1ba;
    font-weight: 400;
  }

  p {
    font-size: 18px;
    color: #fff;
    font-weight: 600;
  }
`;

const StyledLink = styled(Link)`
  height: 40px;
  padding: 0 37px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  border: 1px solid #fff;
  background: transparent;
  color: #fff;
`;

export const ProfileInfo = () => {
  return (
    <StyledPanel>
      <Left>
        <Box>
          <h2>Email</h2>
          <p>michael12@gmail.com</p>
        </Box>
        <Box>
          <h2>Name</h2>
          <p>Michael Davidov</p>
        </Box>
        <Box>
          <h2>Country</h2>
          <p>Bulgaria</p>
        </Box>
        <Box>
          <h2>Phone</h2>
          <p>+359 232 212 211</p>
        </Box>
      </Left>
      <Right>
        <StyledLink href="/my-profile/edit-profile">Edit Profile</StyledLink>
      </Right>
    </StyledPanel>
  );
};
