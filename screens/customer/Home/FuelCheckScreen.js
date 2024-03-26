import { FlatList, StyleSheet, View } from 'react-native'
import React from 'react'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CommonStyles from '../../../util/styles/styles'
import { Button, HStack, Text } from 'native-base'
import { adjust } from '../../../util/Dimentions'
import Colors from '../../../util/styles/colors'
import { CUSTOMER_HOME_SCREEN_ROUTES } from '../../../util/constants'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useFuel } from '../../../hooks/useFuel'
import moment from 'moment'
import { moneda } from '../../../util/Moneda'
import { MyCarActive } from '../../../components/Customer/MyCarActive'




export const FuelCheckScreen = ({ navigation }) => {
    const { getFuelConsumption, loading } = useFuel()
    const { consumption } = useSelector(state => state.fuel)
    const calculateGasConsumption = (km, liters) => {
        return km / liters;
    };

    useEffect(() => {
        getFuelConsumption()
    }, [])



    const renderItem = ({ item }) => {
        const gasConsumption = calculateGasConsumption(item.km, item.liters);
        return (
            <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#cccccc' }}>
                <Text>Chofer: {item.driver?.name}</Text>
                <Text>Carga: {moneda(item.amount)}</Text>
                <Text>Kilometers: {item.km}</Text>
                <Text>Liters: {item.liters}</Text>
                <Text>Gas Consumption: {gasConsumption.toFixed(2)} km/l</Text>
                <Text>Fecha: {moment(item.createdAt).format('L')}</Text>

            </View>
        )
    };

    const totalGasConsumption = consumption.reduce((total, item) => {
        const consumption = calculateGasConsumption(item.km, item.liters);
        return total + consumption;
    }, 0);
    const averageGasConsumption = totalGasConsumption / consumption.length;

    function calcularConsumoEntreRecargas(registros) {
        if (consumption.length < 2) {
            return 0; // No se pueden calcular consumos sin al menos dos registros
        }

        // Obtener los dos registros consecutivos de recarga de combustible
        const recargaInicial = consumption[consumption.length - 2];
        const recargaFinal = consumption[consumption.length - 1];

        // Obtener el kilometraje y la cantidad de litros de gasolina en cada registro
        const kmInicial = recargaInicial.km;
        const litrosInicial = recargaInicial.liters;
        const kmFinal = recargaFinal.km;
        const litrosFinal = recargaFinal.liters;

        // Calcular la distancia recorrida
        const distanciaRecorrida = kmFinal - kmInicial;

        // Calcular la cantidad de litros de gasolina consumidos
        const litrosConsumidos = litrosInicial - litrosFinal;

        // Calcular el consumo de combustible por kilómetro
        const consumoPorKm = litrosConsumidos / distanciaRecorrida;

        console.log(consumoPorKm);
        return consumoPorKm;
    }

    calcularConsumoEntreRecargas()
    return (
        <View style={styles.body} >

            <MyCarActive />
            <HStack justifyContent={'space-between'} alignItems={'center'} >
                <Text>FuelCheckScreen</Text>

                <Button
                    onPress={() => navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.FORM_FUEL_CHECK)}
                    variant={'ghost'}
                    leftIcon={
                        <MaterialCommunityIcons
                            name='plus'
                            color={Colors.white}
                            size={adjust(20)}
                        />
                    }
                    _text={{ color: Colors.white }}
                >
                    Nueva carga
                </Button>
            </HStack>
            <Text style={{ alignSelf: 'center', marginVertical: 10 }}>Promedio de Consumo: {averageGasConsumption.toFixed(2)} km/l</Text>

            <FlatList
                data={consumption}
                renderItem={renderItem}
                keyExtractor={item => item._id}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    body: {
        ...CommonStyles.screenY,
        paddingHorizontal: 10
    }
})