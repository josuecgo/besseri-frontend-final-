import { FlatList, StyleSheet,  View } from 'react-native'
import React from 'react'

import CommonStyles from '../../../util/styles/styles'
import { Box, } from 'native-base'

import Colors from '../../../util/styles/colors'
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../../util/constants'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useFuel } from '../../../hooks/useFuel'

import { MyCarActive } from '../../../components/Customer/MyCarActive'
import { SkeletonScreen } from '../SkeletonScreen'
import { FabFuel } from '../../../components/button/FabFuel'
import { LevelCheck } from '../../../components/Customer/LevelCheck'
import { CardFuel } from '../../../components/Customer/CardFuel'




export const FuelCheckScreen = ({ navigation }) => {
    const { getFuelConsumption, loading } = useFuel()
    const { consumption } = useSelector(state => state.fuel);


   

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
       

        return <CardFuel item={item} navigation={navigation} />
       
    };

    
    if (loading) return <SkeletonScreen/>

    return (
        <View style={styles.body} >
            <Box 
             
            overflow={'hidden'} >
                <MyCarActive />
                <LevelCheck/>
            </Box>


            
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