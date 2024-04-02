import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonStyles from '../../../util/styles/styles'
import { Button, Center, HStack, Input, Modal, Select, Text, VStack } from 'native-base'
import { useFuel } from '../../../hooks/useFuel'
import Colors from '../../../util/styles/colors'
import { ModalDriver } from '../../../components/Customer/ModalDriver'
import LoaderComponent from '../../../components/Loader/Loader.component'
import { useSelector } from 'react-redux'
import { MyCarActive } from '../../../components/Customer/MyCarActive'
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal'
import { HeaderTitle } from '../../../components/Customer/HeaderTitle'

export const FormFuelCheckScreen = ({navigation,route}) => {
    const {type,finish,data} = route.params
    const [driver, setDriver] = useState('');
    const [km, setKm] = useState('');
    const [liters, setLiters] = useState('');
    const [amount, setAmount] = useState('');
    const { getDrivers,loading,createFuelConsumption,createTravel,closeTravel } = useFuel()
    const [isOpenModal, setIsOpenModal] = useState(false)
    const {drivers} = useSelector(state => state.fuel)
   
    console.log(data);

    const handleSubmit = async() => {
        // Aquí podrías enviar los datos a tu backend o hacer algo con ellos
        if (loading) {
            return
        }

        if (type === 'gas') {
            await createFuelConsumption({ driver,  km, liters, amount,type })
        } else{
            if (finish) {
                await closeTravel({ 
                   
                    km, 
                    liters, 
                    amount,
                    // type,
                    id:data._id
                    
                })
            }else{
                await createTravel({ driver,  km, liters, amount,type })
            }
            
        }
        
       
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
              <HeaderTitle 
              titulo={!finish ? "Iniciar recorrido" : "Terminar recorrido"}
              nav={navigation.goBack}
            />
            <LoaderComponent isVisible={loading} />


            <MyCarActive  />

            <ModalDriver modalVisible={isOpenModal} openCloseModal={openCloseModal} />

           {
            data ? (
                <Center>
                    <Text>{data.driver.name}</Text>
                </Center>
            ) : (
                <>
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
                </>
            )
           }
           
            

            
            {
                // type === 'gas' ? (
                finish ? (
                <>
                    
                    <Input      
                    placeholder="Litros"
                    value={liters}
                    onChangeText={setLiters}
                    keyboardType="numeric"
                    />

                    <Input
                    placeholder="Carga"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    />  

                    <Input
                        placeholder="Kilómetraje final"
                        value={km}
                        onChangeText={setKm}
                        keyboardType="numeric"
                        /> 
                </>
                ) : (
                    <>
                        <Input
                        placeholder="Kilómetraje inicial"
                        value={km}
                        onChangeText={setKm}
                        keyboardType="numeric"
                        />
                    </>
                )
            }
            


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