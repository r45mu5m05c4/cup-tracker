import styled from "styled-components";
import { FC } from "react";

interface Props {
  popupPosition: number;
  showLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginModal: FC<Props> = ({ popupPosition, showLoginModal }) => {
  return (
    <>
      <Overlay onClick={() => showLoginModal(false)}></Overlay>
      <Modal top={popupPosition} >
        <LoginOrOutButton>Login</LoginOrOutButton>
      </Modal>
    </>
  );
};

export default LoginModal;

const Overlay = styled.div`
  cursor: default;
  position: fixed;
  inset: 0;
  opacity: 0%;
  background-color: #000;
  z-index: 50;
`;
const Modal = styled.div<{ top: number; }>`
  z-index: 55;
  position: absolute;
  top: ${(props) => props.top}px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;
const LoginOrOutButton = styled.a`
  border-radius: 0;
`;
