import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CommonStyles from '../../../util/styles/styles'
import { Box, Button, Fab, HStack, Text } from 'native-base'
import { adjust } from '../../../util/Dimentions'
import Colors from '../../../util/styles/colors'
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../../util/constants'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useFuel } from '../../../hooks/useFuel'
import moment from 'moment'
import { moneda } from '../../../util/Moneda'
import { MyCarActive } from '../../../components/Customer/MyCarActive'
import { SkeletonScreen } from '../SkeletonScreen'
import { FabFuel } from '../../../components/button/FabFuel'
import { LevelCheck } from '../../../components/Customer/LevelCheck'




export const FuelCheckScreen = ({ navigation }) => {
    const { getFuelConsumption, loading, calcularConsumoEntreRecargas } = useFuel()
    const { consumption, kmPerByDay, totalKmTraveled,daysPassed,fuelTotal,amountTotal } = useSelector(state => state.fuel);

    // console.log({kmPerByDay,totalKmTraveled});
    const calculateGasConsumption = (km, liters) => {
        return km / liters;
    };

    useEffect(() => {
        getFuelConsumption()
    }, [])

    

    const goForm = (type) => {

        const ultimoKmActualNull = verificarUltimoKmActualNull(consumption);
        const ultimoRegistro = consumption[0];
        
        if (!ultimoKmActualNull) {
            // No dejes avanzar a otra pantalla
            showToaster("Aun no cierras tu ultimo recorrido. No se puede avanzar.");
            return
        } else{
            if (type === 'travel') {
                navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.FORM_FUEL_CHECK, { type,finish:false,km_actual:ultimoRegistro?.km_actual })
            }else{
                navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.FORM_FUEL_CHECK, { type,km_actual:ultimoRegistro?.km_actual })
            }
        }


        

        
       
        
    }

    const verificarUltimoKmActualNull = (registros) => {
        // Obtener el último objeto del arreglo
        const ultimoRegistro = registros[0];
       
        // Verificar si el campo km_actual es null en el último objeto
        if (ultimoRegistro?.km_actual === null && registros.length > 0) {
            return false; // El último registro tiene km_actual en null
        } else {
            return true; 
        }
    };

    
    

    const renderItem = ({ item }) => {
        const gasConsumption = calculateGasConsumption(item.km_recorrido, item.liters);
        if (item.type === 'travel') {
           
            return  (
                <View style={styles.card}>
                    
                    <Text>Chofer: {item.driver?.name}</Text>
                    <Text>Fecha: {moment(item.createdAt).format('L LT')}</Text>
                    <Text>Kilometraje inicial: {item?.km_anterior ?? ''}</Text>

                    {
                        item.km_actual ? ( 
                            <> 
                                <Text>Kilómetraje final: {item?.km_actual  }</Text>
                                <Text>Kilómetros recorridos: {item?.km_recorrido ?? ''}</Text>
                                {
                                   item.amount && item.liters &&  (
                                        <>
                                        <Text>Carga: {moneda(item.amount)}</Text>
                                        <Text>Liters: {item.liters}</Text>
                                        <Text>Gas Consumption: {gasConsumption.toFixed(2)} km/l</Text>
                                        </>
                                    )
                                }
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
                <Text>Kilómetraje inicial: {item?.km_anterior ?? ''}</Text>
                <Text>Fecha: {moment(item.createdAt).format('L')}</Text>
               
                {
                        item.km_actual ? ( 
                            <> 
                                <Text>Kilómetraje final: {item?.km_actual  }</Text>
                                <Text>Kilómetros recorridos: {item?.km_recorrido ?? ''}</Text>
                                <Text>Liters: {item.liters}</Text>
                                <Text>Gas Consumption: {gasConsumption.toFixed(2)} km/l</Text>
                                
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
    };

    
    if (loading) return <SkeletonScreen/>

    return (
        <View style={styles.body} >
            <Box backgroundColor={'#1e1e1e'} rounded={'lg'} >
                <MyCarActive />
                <LevelCheck/>
            </Box>

            
            {/* <HStack justifyContent={'space-around'} >
                <Text style={{ alignSelf: 'center' }}>Total km: {totalKmTraveled} km</Text>
                <Text style={{ alignSelf: 'center'}}>Por dia: {kmPerByDay} km</Text>
            </HStack>

            <HStack justifyContent={'space-around'} >
                <Text style={{ alignSelf: 'center' }}>Carga total: ${amountTotal}</Text>
                <Text style={{ alignSelf: 'center'}}>Carga por dia: ${amountTotal / daysPassed}</Text>
            </HStack>
            
            <HStack justifyContent={'space-around'} >
                <Text style={{ alignSelf: 'center' }}>Litros totales: {fuelTotal} lt</Text>
                <Text style={{ alignSelf: 'center'}}>Litros por dia: {fuelTotal / daysPassed} lt</Text>
            </HStack> */}
            
            {/* <Text style={{ alignSelf: 'center' }}>Dias transcurridos: {daysPassed} dias</Text> */}
            
            <FlatList
                data={consumption}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                showsVerticalScrollIndicator={false}
            />

            <FabFuel goForm={goForm}/>
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