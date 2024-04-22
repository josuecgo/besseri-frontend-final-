import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import moment from 'moment'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatNumberWithCommas, moneda } from '../../util/Moneda'
import { HStack, Text, Button, VStack, Box, useDisclose, Modal } from 'native-base'
import Colors from '../../util/styles/colors';
import { useState } from 'react';
import { CUSTOMER_HOME_SCREEN_ROUTES } from '../../util/constants';




export const CardFuel = ({ item, navigation }) => {

    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);

    const styleIcon = {
        size: 16,
        color: Colors.white,

    }
    const gasConsumption = item.km_recorrido / item.liters

   

    if (item.type === 'travel') {

        return (
            <View style={styles.card}>

                

    {/* Info */}
    <HStack alignItems={'center'} justifyContent={'space-between'}>
                <HStack alignItems={'center'} >
                    <MaterialCommunityIcons name='account' color={styleIcon.color} size={styleIcon.size} />
                    <Text> {item.driver?.name}</Text>
                </HStack>
                <HStack alignItems={'center'} >
                    <MaterialCommunityIcons name='calendar' color={styleIcon.color} size={styleIcon.size} />

                    <Text> {moment(item.createdAt).format('L')}</Text>
                </HStack>
            </HStack>

            <HStack justifyContent={'space-around'} my={2} >
                {
                    !isNaN(gasConsumption)  && (
                        <>
                     <Button
                            variant={'outline'}
                            onPress={() => setShowModal(true)}
                            size={'sm'}
                            _text={{ color: Colors.white }}
                        >
                            Combustible
                        </Button>
                        </>
                        
                    )
                }
                
                <Button
                    variant={'outline'}
                    onPress={() => setShowModal2(true)}
                    size={'sm'}
                    _text={{ color: Colors.white }}
                >
                    Kilómetraje
                </Button>
            </HStack>

            <ModalGas
                data={item}
                showModal={showModal}
                setShowModal={setShowModal}
                gasConsumption={gasConsumption}

            />

            <ModalKilometraje
                data={item}
                showModal={showModal2}
                setShowModal={setShowModal2}
                gasConsumption={gasConsumption}

            />









            {
                !item.km_actual && (
                    <TouchableOpacity
                        onPress={
                            () => navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.FORM_FUEL_CHECK, {
                                type: 'travel',
                                finish: true,
                                data: item
                            })}
                        style={styles.btn}  >
                        <Text style={styles.btnTxt} >Cerrar recorrido</Text>
                    </TouchableOpacity>
                )
            }



            </View>
        )
    }
    return (
        <View style={styles.card}>

            {/* Info */}
            <HStack alignItems={'center'} justifyContent={'space-between'}>
                <HStack alignItems={'center'} >
                    <MaterialCommunityIcons name='account' color={styleIcon.color} size={styleIcon.size} />
                    <Text> {item.driver?.name}</Text>
                </HStack>
                <HStack alignItems={'center'} >
                    <MaterialCommunityIcons name='calendar' color={styleIcon.color} size={styleIcon.size} />

                    <Text> {moment(item.createdAt).format('L')}</Text>
                </HStack>
            </HStack>

            <HStack justifyContent={'space-around'} my={2} >
                <Button
                    variant={'outline'}
                    onPress={() => setShowModal(true)}
                    size={'sm'}
                    _text={{ color: Colors.white }}
                >
                    Combustible
                </Button>
                <Button
                    variant={'outline'}
                    onPress={() => setShowModal2(true)}
                    size={'sm'}
                    _text={{ color: Colors.white }}
                >
                    Kilómetraje
                </Button>
            </HStack>

            <ModalGas
                data={item}
                showModal={showModal}
                setShowModal={setShowModal}
                gasConsumption={gasConsumption}

            />

            <ModalKilometraje
                data={item}
                showModal={showModal2}
                setShowModal={setShowModal2}
                gasConsumption={gasConsumption}

            />









            {
                !item.km_actual && (
                    <TouchableOpacity
                        onPress={
                            () => navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.FORM_FUEL_CHECK, {
                                type: 'travel',
                                finish: true,
                                data: item
                            })}
                        style={styles.btn}  >
                        <Text style={styles.btnTxt} >Cerrar recorrido</Text>
                    </TouchableOpacity>
                )
            }

        </View>
    )
}



const ModalGas = ({ data, showModal, setShowModal, gasConsumption }) => {
    const styleIcon = {
        size: 20,
        color: Colors.white,

    }

    console.log(data.fuel_level);
    return (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
            <Modal.Content maxWidth="350">
                <Modal.CloseButton />
                <Modal.Header>Consumo de combustible</Modal.Header>
                <Modal.Body>
                    <VStack space={3}>

                        <HStack alignItems="center" justifyContent="space-between">
                            <Text fontWeight="medium">Tipo de combustible</Text>
                            <Text textTransform={'capitalize'} color="blueGray.400"> {data.gasolineType}</Text>
                        </HStack>

                        <HStack alignItems="center" justifyContent="space-between">
                            <Text fontWeight="medium">Litros</Text>
                            <Text color="blueGray.400"> {data.liters} L</Text>
                        </HStack>
                        <HStack alignItems="center" justifyContent="space-between">
                            <Text fontWeight="medium">Precio por litro</Text>
                            <Text color="blueGray.400"> {moneda(data.gasolinePrice)} </Text>
                        </HStack>

                        <HStack alignItems="center" justifyContent="space-between">
                            <Text fontWeight="medium">Nivel de combustible</Text>
                            <Text color="blueGray.400"> {data?.fuel_level}% </Text>
                        </HStack>
                        <HStack alignItems="center" justifyContent="space-between">
                            <Text fontWeight="medium">Total</Text>
                            <Text color="green.500">{moneda(data.amount)}</Text>
                        </HStack>

                        {
                            data.km_actual && (
                                <>
                                    <HStack alignItems="center" justifyContent="space-between">
                                        <Text fontWeight="medium">Consumo por km</Text>
                                        <Text color="green.500" > {gasConsumption.toFixed(2)} km/l</Text>

                                    </HStack>
                                </>

                            )
                        }
                    </VStack>
                </Modal.Body>

            </Modal.Content>
        </Modal>

    )
}


const ModalKilometraje = ({ data, showModal, setShowModal, gasConsumption }) => {


    return (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
            <Modal.Content maxWidth="350">
                <Modal.CloseButton />
                <Modal.Header>Kilómetraje</Modal.Header>
                <Modal.Body>
                    <VStack space={3}>

                        <HStack alignItems="center" justifyContent="space-between">
                            <Text fontWeight="medium">Kilómetraje inicial</Text>
                            <Text textTransform={'capitalize'} color="blueGray.400"> {formatNumberWithCommas(data?.km_anterior)}</Text>
                        </HStack>

                        <HStack alignItems="center" justifyContent="space-between">
                            <Text fontWeight="medium">Kilómetraje final</Text>
                            <Text color="blueGray.400"> {data?.km_actual ? formatNumberWithCommas(data?.km_actual) : ''}</Text>
                        </HStack>




                        <HStack alignItems="center" justifyContent="space-between">
                            <Text fontWeight="medium">Recorrido total</Text>
                            <Text color="green.500">{data?.km_actual ? formatNumberWithCommas(data.km_recorrido) : ''}</Text>

                        </HStack>



                    </VStack>
                </Modal.Body>

            </Modal.Content>
        </Modal>

    )
}


const styles = StyleSheet.create({
    card: {
        padding: 10,
        borderWidth: 0.5,
        borderColor: '#cccccc',
        borderRadius: 10,
        marginVertical: 5
    },
    btn: {
        borderWidth: 0.5,
        borderColor: Colors.alert,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        margin: 5
    },
    btnTxt: {
        color: Colors.alert
    }
})