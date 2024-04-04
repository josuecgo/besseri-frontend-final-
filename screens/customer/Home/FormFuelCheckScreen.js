import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonStyles from '../../../util/styles/styles'
import { Box, Button, Center, HStack, Input, Modal, Radio, ScrollView, Select, Text, VStack } from 'native-base'
import { useFuel } from '../../../hooks/useFuel'
import Colors from '../../../util/styles/colors'
import { ModalDriver } from '../../../components/Customer/ModalDriver'
import LoaderComponent from '../../../components/Loader/Loader.component'
import { useSelector } from 'react-redux'
import { MyCarActive } from '../../../components/Customer/MyCarActive'
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal'
import { HeaderTitle } from '../../../components/Customer/HeaderTitle'
import { showToaster } from '../../../util/constants'

export const FormFuelCheckScreen = ({ navigation, route }) => {
    const { type, finish, data, km_actual } = route.params
    const [driver, setDriver] = useState('');
    const [value, setValue] = useState("inicio");
    const [km, setKm] = useState(km_actual && type === 'travel' ? km_actual.toString() : '');
    const [liters, setLiters] = useState(data?.liters ? data.liters.toString() :'');
    const [amount, setAmount] = useState(data?.amount  ? data.amount.toString() : '');
    const { getDrivers, loading, createFuelConsumption, createFuelConsumptionInitial, createTravel, closeTravel } = useFuel()
    const [isOpenModal, setIsOpenModal] = useState(false)
    const { drivers } = useSelector(state => state.fuel)

   

    const handleSubmit = async () => {
        // Aquí podrías enviar los datos a tu backend o hacer algo con ellos
        if (loading) {
            return
        }

        if (!km) {
            showToaster('Por favor, ingresa el kilómetraje.'); // Mostrar un mensaje de alerta o manejar de alguna otra manera la falta de kilómetraje
            return;
        }

        if (type === 'gas') {
            if (!driver || !km || !liters || !amount) {
                showToaster('Por favor, completa todos los campos.'); // Mostrar un mensaje de alerta o manejar de alguna otra manera la falta de kilómetraje
                return;
            }

            if (finish) {
                await closeTravel({

                    km,
                    liters,
                    amount,
                    // type,
                    id: data._id,
                    data

                })


            }else{
                if (value === 'inicio') {
                    console.log('ssssss');
                    await createFuelConsumptionInitial({ driver, km, liters, amount, type })
                  
                }else{
                    await createFuelConsumption({ driver, km, liters, amount, type })
                    
                }
            }
           
            
            
        } else {
            if (finish) {
                await closeTravel({

                    km,
                    liters,
                    amount,
                    // type,
                    id: data._id,
                    data

                })
            } else {
                if (!driver || !km) {
                    showToaster('Por favor, completa todos los campos.'); // Mostrar un mensaje de alerta o manejar de alguna otra manera la falta de kilómetraje
                    return;
                }
                await createTravel({ driver, km, liters, amount, type })
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

    if (type === 'gas') {
        return (
            (
                <VStack style={styles.body} >
                    <ScrollView  >

                        <HeaderTitle
                            titulo={!finish ? "Iniciar recorrido" : "Terminar recorrido"}
                            nav={navigation.goBack}
                        />
                        <LoaderComponent isVisible={loading} />


                        <MyCarActive />


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
                                            _text={{ color: Colors.white }}
                                        >
                                            Agregar chofer
                                        </Button>
                                    </HStack>


                                    <Text>Chofer</Text>

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

                        <Text>Fase del recorrido</Text>
                        <Box justifyContent={'center'} alignItems={'center'} >


                            <Radio.Group
                                name="myRecorrido"
                                accessibilityLabel="Fase del recorrido"
                                value={value}
                                onChange={nextValue => {
                                    setValue(nextValue);
                                }}

                            >
                                <HStack space={12} justifyContent={'space-around'} >
                                    <Radio value="inicio" >
                                        Inicio
                                    </Radio>
                                    <Radio value="final" >
                                        Final
                                    </Radio>
                                </HStack>
                            </Radio.Group>
                        </Box>


                        <Text>Litros</Text>
                        <Input
                            placeholder="Litros"
                            value={liters}
                            onChangeText={setLiters}
                            keyboardType="numeric"
                        />

                        <Text>Carga de combustible</Text>
                        <Input
                            placeholder="Carga"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                        />


                        <Text>Kilómetraje</Text>
                        <Input
                            placeholder="Kilómetraje"
                            value={km}
                            onChangeText={setKm}
                            keyboardType="numeric"
                        />

                        


                        <BtnPrincipal

                            text={'Guardar'}
                            onPress={handleSubmit}
                        />


                    </ScrollView>
                </VStack>

            )
        )
    }

    return (
        <VStack style={styles.body} space={2} >
            <HeaderTitle
                titulo={!finish ? "Iniciar recorrido" : "Terminar recorrido"}
                nav={navigation.goBack}
            />
            <LoaderComponent isVisible={loading} />


            <MyCarActive />

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
                                _text={{ color: Colors.white }}
                            >
                                Agregar chofer
                            </Button>
                        </HStack>



                        <Text>Seleccionar chofer</Text>
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
                        <Text>Litros</Text>
                        <Input
                            placeholder="Litros"
                            value={liters}
                            onChangeText={setLiters}
                            keyboardType="numeric"
                        />

                        <Text>Carga</Text>
                        <Input
                            placeholder="Carga"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                        />

                        <Text>Kilómetraje final</Text>
                        <Input
                            placeholder="Kilómetraje final"
                            value={km}
                            onChangeText={setKm}
                            keyboardType="numeric"
                        />
                    </>
                ) : (
                    <>
                        <Text>Kilómetraje inicial</Text>
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