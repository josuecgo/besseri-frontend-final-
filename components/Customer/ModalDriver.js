import React, { useState } from 'react';
import { Modal, VStack, Button, Input, HStack } from 'native-base';
import { useFuel } from '../../hooks/useFuel';

export const ModalDriver = ({ modalVisible, openCloseModal }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const {createDriver} = useFuel()

    const handleCreateDriver = async() => {
      
        
        await createDriver({
            name,
            age
        })
       
        setName('');
        setAge('');
        // Cerrar el modal después de crear el conductor
        openCloseModal();
    };

    return (
        <Modal isOpen={modalVisible} onClose={openCloseModal}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>Registrar Conductor</Modal.Header>
                <Modal.Body>
                    <VStack space={3}>
                        <Input
                            mx="3"
                            placeholder="Nombre del conductor"
                            value={name}
                            onChangeText={setName}
                        />
                        <Input
                            mx="3"
                            placeholder="Edad del conductor"
                            value={age}
                            onChangeText={setAge}
                            keyboardType="numeric"
                        />
                    </VStack>
                </Modal.Body>
                <Modal.Footer>
                    <HStack space={3}>
                        <Button colorScheme="danger" onPress={openCloseModal}>
                            Cancelar
                        </Button>
                        <Button colorScheme="teal" onPress={handleCreateDriver}>
                            Crear
                        </Button>
                    </HStack>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};




