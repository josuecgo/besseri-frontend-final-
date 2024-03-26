import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonStyles from '../../../util/styles/styles'
import { Button, HStack, Input, Modal, Select, Text, VStack } from 'native-base'
import { useFuel } from '../../../hooks/useFuel'
import Colors from '../../../util/styles/colors'
import { ModalDriver } from '../../../components/Customer/ModalDriver'
import LoaderComponent from '../../../components/Loader/Loader.component'
import { useSelector } from 'react-redux'
import { MyCarActive } from '../../../components/Customer/MyCarActive'
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal'

export const FormFuelCheckScreen = ({navigation}) => {
    const [driver, setDriver] = useState('');
   
    const [km, setKm] = useState('');
    const [liters, setLiters] = useState('');
    const [amount, setAmount] = useState('');
    const { getDrivers,loading,createFuelConsumption } = useFuel()
    const [isOpenModal, setIsOpenModal] = useState(false)
    const {drivers} = useSelector(state => state.fuel)
   
    const handleSubmit = async() => {
        // Aquí podrías enviar los datos a tu backend o hacer algo con ellos
        if (loading) {
            return
        }
        await createFuelConsumption({ driver,  km, liters, amount })
        // También puedes restablecer el estado del formulario después de enviar los datos
        setDriver('');
        navigation.goBack()
        setKm('');
        setLiters('');
        setAmount('');
    };

    const openCloseModal = () => {
        setIsOpenModal(!isOpenModal)
    }


    useEffect(() => {
        getDrivers()
    }, [])



    return (
        <VStack style={styles.body} space={2} >
            <LoaderComponent isVisible={loading} />


            <MyCarActive  />

            <ModalDriver modalVisible={isOpenModal} openCloseModal={openCloseModal} />
            <HStack justifyContent={'flex-end'} >
                <Button variant={'outline'}  
                onPress={openCloseModal}
                _text={{ color:Colors.white }} 
                >
                    Agregar chofer
                </Button>
            </HStack>
            <Select selectedValue={driver} minWidth="200" 
            accessibilityLabel="Elegir chofer" 
            placeholder="Elegir chofer" 
            _selectedItem={{
                bg: "teal.600",
                // endIcon: <CheckIcon size="5" />
            }} 
            onValueChange={itemValue => setDriver(itemValue)}>
               
                {
                    drivers.map((item) => (
                        <Select.Item key={item._id} label={item.name} value={item._id} />
                    ))
                }
            </Select>
           
            <Input
               
                placeholder="Carga"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
            />

            <Input
              
                placeholder="Kilómetraje"
                value={km}
                onChangeText={setKm}
                keyboardType="numeric"
            />
            <Input
               
                placeholder="Litros"
                value={liters}
                onChangeText={setLiters}
                keyboardType="numeric"
            />



            <BtnPrincipal 
            
            text={'Guardar'} 
            onPress={handleSubmit}
            />

        </VStack>
    )
}



const styles = StyleSheet.create({
    body: {
        ...CommonStyles.screenY,
        paddingHorizontal: 10
    }
})