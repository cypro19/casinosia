import { styled, css } from "styled-components";

export const Panel = styled.div`
  padding: 30px;
  border-radius: 6px;
  background: ${(props) => props.theme.page.profile.panel.background};
  backdrop-filter: blur(5px);
  transition: 0.3s all ease-in;
  box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.02);
`;
