import styled from "styled-components";
import { FC, useState } from "react";
import * as Realm from "realm-web";
import { useUser } from "../utils/context/UserContext";

interface Props {
  popupPosition: number;
  showLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginModal: FC<Props> = ({ popupPosition, showLoginModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { user, setUser, logout } = useUser();
  const app = new Realm.App({ id: "data-lcjxaso" });

  const handleLogin = async () => {
    if (email === "" || password === "") {
      setError("Please fill in your login credentials");
      return;
    }
    try {
      const credentials = Realm.Credentials.emailPassword(email, password);
      const user = await app.logIn(credentials);

      setUser(user);
      showLoginModal(false);
    } catch (err) {
      setError("Could not log you in, please contact admin");
    }
  };
  const handleLogout = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    logout();
  };

  return (
    <>
      <Overlay onClick={() => showLoginModal(false)} />
      <Modal onClick={(e) => e.stopPropagation()} top={popupPosition}>
        {user && user.providerType !== "anon-user" ? (
          <LoginOrOutButton href="#" onClick={(e) => handleLogout(e)}>
            Logout
          </LoginOrOutButton>
        ) : (
          <>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="E-mail"
            ></Input>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            ></Input>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <LoginOrOutButton
              href="#"
              type="submit"
              onClick={() => handleLogin()}
            >
              Login
            </LoginOrOutButton>
          </>
        )}
      </Modal>
    </>
  );
};

export default LoginModal;

const Overlay = styled.div`
  cursor: default;
  position: fixed;
  inset: 0;
  opacity: 10%;
  background-color: #000;
  z-index: 50;
`;
const Modal = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "top",
})<{ top: number }>`
  z-index: 100;
  position: absolute;
  display: flex;
  flex-direction: column;
  padding: 24px;
  top: ${(props) => props.top}px;
  margin-right: 200px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  @media (max-width: 768px) {
    margin-right: -200px;
    margin-left: auto;
  }
`;
const LoginOrOutButton = styled.a`
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  color: #fff;
  cursor: pointer;
  transition: border-color 0.25s;
`;
const Input = styled.input`
  margin: auto;
  margin-bottom: 4%;
`;
