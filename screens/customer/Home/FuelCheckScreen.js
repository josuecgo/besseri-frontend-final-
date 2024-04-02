import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CommonStyles from '../../../util/styles/styles'
import { Button, HStack, Text } from 'native-base'
import { adjust } from '../../../util/Dimentions'
import Colors from '../../../util/styles/colors'
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../../util/constants'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useFuel } from '../../../hooks/useFuel'
import moment from 'moment'
import { moneda } from '../../../util/Moneda'
import { MyCarActive } from '../../../components/Customer/MyCarActive'




export const FuelCheckScreen = ({ navigation }) => {
    const { getFuelConsumption, loading, calcularConsumoEntreRecargas } = useFuel()
    const { consumption, averageGasConsumption } = useSelector(state => state.fuel);

    const calculateGasConsumption = (km, liters) => {
        return km / liters;
    };

    useEffect(() => {
        getFuelConsumption()
    }, [])



    const goForm = (type) => {

        const ultimoKmActualNull = verificarUltimoKmActualNull(consumption);

        
        if (ultimoKmActualNull) {
            // No dejes avanzar a otra pantalla
            showToaster("Aun no cierras tu ultimo recorrido. No se puede avanzar.");
            return
        } else{
            if (type === 'travel') {
                navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.FORM_FUEL_CHECK, { type,finish:false })
            }else{
                navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.FORM_FUEL_CHECK, { type })
            }
        }


        

        
       
        
    }

    const verificarUltimoKmActualNull = (registros) => {
        // Obtener el último objeto del arreglo
        const ultimoRegistro = registros[registros.length - 1];
       
        // Verificar si el campo km_actual es null en el último objeto
        if (ultimoRegistro.km_actual === null) {
            return true; // El último registro tiene km_actual en null
        } else {
            return false; // El último registro tiene un valor en km_actual
        }
    };


    const renderItem = ({ item }) => {
        const gasConsumption = calculateGasConsumption(item.km_recorrido, item.liters);
        if (item.type === 'travel') {
           
            return  (
                <View style={styles.card}>
                    
                    <Text>Chofer: {item.driver?.name}</Text>
                    <Text>Fecha: {moment(item.createdAt).format('L')}</Text>
                    <Text>Kilometraje inicial: {item?.km_anterior ?? 'Primer registro'}</Text>

                    {
                        item.km_actual ? ( 
                            <> 
                                <Text>Kilometraje final: {item?.km_actual  }</Text>
                                <Text>Kilometros recorridos: {item?.km_recorrido ?? 'Primer registro'}</Text>
                            </>
                       
                        ) 
                        : (
                            <TouchableOpacity 
                            onPress={() => navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.FORM_FUEL_CHECK, { type: 'travel', finish:true, data:item })}
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
                <Text>Chofer: {item.driver?.name}</Text>
                <Text>Carga: {moneda(item.amount)}</Text>
                <Text>Kilometraje inicial: {item?.km_anterior ?? 'Primer registro'}</Text>
                <Text>Kilometraje final: {item?.km_actual }</Text>
                <Text>Kilometros recorridos: {item?.km_recorrido ?? 'Primer registro'}</Text>

                <Text>Liters: {item.liters}</Text>
                <Text>Gas Consumption: {gasConsumption.toFixed(2)} km/l</Text>
                <Text>Fecha: {moment(item.createdAt).format('L')}</Text>

            </View>
        )
    };

    useEffect(() => {
        calcularConsumoEntreRecargas(consumption)
    }, [consumption])

   
    return (
        <View style={styles.body} >

            <MyCarActive />
            <HStack justifyContent={'space-around'} alignItems={'center'} mb={4} >
                <Button
                    onPress={() => goForm('travel')}
                    variant={'outline'}
                    leftIcon={
                        <MaterialCommunityIcons
                            name='car-traction-control'
                            color={Colors.white}
                            size={adjust(19)}
                        />
                    }
                    _text={{ color: Colors.white }}
                >
                    Nuevo recorrido
                </Button>

                <Button
                    onPress={() => goForm('gas')}
                    variant={'outline'}
                    leftIcon={
                        <MaterialCommunityIcons
                            name='gas-station'
                            color={Colors.white}
                            size={adjust(19)}
                        />
                    }
                    _text={{ color: Colors.white }}
                >
                    Nueva carga
                </Button>
            </HStack>
            {/* <Text style={{ alignSelf: 'center', marginVertical: 10 }}>Promedio de Consumo:{averageGasConsumption}  km/l</Text> */}

            <FlatList
                data={consumption}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    body: {
        ...CommonStyles.screenY,
        paddingHorizontal: 10
    },
    card:{
        padding: 10, 
        borderWidth: 0.5, 
        borderColor: '#cccccc',
        borderRadius:10

    },
    btn:{
        borderWidth: 0.5, 
        borderColor: Colors.alert,
        borderRadius:2,
        justifyContent:'center',
        alignItems:'center',
        padding:5,
        margin:5
    },
    btnTxt:{
        color:Colors.alert
    }
})