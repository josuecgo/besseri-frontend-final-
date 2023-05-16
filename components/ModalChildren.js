import { View, Text } from 'react-native'
import React from 'react'
import { Modal } from 'native-base'

const ModalChildren = ({showModal,handleModal,children}) => {
  return (

    <Modal
    isOpen={showModal}
    onClose={() => handleModal(false)}
    backgroundColor={'#039EF299'}
    >
     
      {children}
    </Modal>
  )
}

export default ModalChildren