import React from 'react';
import { Overlay } from 'react-native-elements';

export default function Modal(props) {
  const { isVisible, setIsVisible, children, colorModal, close, setAddCar } =
    props;

  const closeModal = () => {
    if (close) {
      if (setAddCar) {
        setAddCar(false);
      }
      setIsVisible(false);
    }
  };

  return (
    <Overlay
      isVisible={isVisible}
      windowBackgroundColor='rgba(0,0,0,0.5)'
      overlayBackgroundColor='transparent'
      overlayStyle={{
        height: 'auto',
        width: '90%',
        backgroundColor: colorModal,
        borderRadius: 40,
      }}
      onBackdropPress={closeModal}
    >
      {children}
    </Overlay>
  );
}
