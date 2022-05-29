import React from "react";
import useModal from "../hooks/useModal";
import {Modal} from "../components/Modal";

interface IModalContext {
  isShown: boolean;
  handleModal: (arg: string) => void;
  template: string; //JSX.Element
}

let ModalContext:any;
let { Provider } = (ModalContext = React.createContext<IModalContext>({
  isShown: false,
  handleModal: () => {},
  template: ''
}));

let ModalProvider = ({ children }) => {
  let { isShown, handleModal, template } = useModal();
  return (
    <Provider value={{ isShown, handleModal, template }}>
      <Modal />
      {children}
    </Provider>
  );
};

export { ModalContext, ModalProvider };
