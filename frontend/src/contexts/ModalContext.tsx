import React from "react";
import useModal from "../hooks/useModal";
import { Modal } from "../components/Modal";

interface IModalContext {
  isShown: boolean;
  handleModal: (arg?: string) => void;
  template: string;
}

let ModalContext = React.createContext<IModalContext>({
  isShown: false,
  handleModal: () => {},
  template: "",
});

let ModalProvider = ({ children }) => {
  let { isShown, handleModal, template } = useModal();
  return (
    <ModalContext.Provider value={{ isShown, handleModal, template }}>
      <Modal />
      {children}
    </ModalContext.Provider>
  );
};

export { ModalContext, ModalProvider };
