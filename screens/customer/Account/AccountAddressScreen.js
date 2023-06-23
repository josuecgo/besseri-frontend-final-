import { View,  ScrollView,Image, TouchableOpacity, Platform, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { deviceHeight } from '../../../util/Dimentions';
import CommonStyles from '../../../util/styles/styles';
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../../util/constants';
import Colors from '../../../util/styles/colors';
import AddressComponent from '../../../components/customer-components/customer.addresscard.component';
import ButtonComponent from '../../../components/button/button.component';
import axios from 'axios';
import { api_statuses, customer_api_urls } from '../../../util/api/api_essentials';
import { getUserId } from '../../../util/local-storage/auth_service';
import { Text } from 'native-base';
import { useSelector } from 'react-redux';
import LoaderComponent from '../../../components/Loader/Loader.component';
import { useInfoUser } from '../../../hooks/useInfoUsers';

export const AccountAddressScreen = (props) => {
    const width = 300;
    const [loading, setLoading] = useState(false);
    const {address,addresses,user} = useSelector(state => state.user)
    const {getUserInfo} = useInfoUser();
   
    




    const deleteAddress = async (id) => {
        try {
            if (!user) {
                showToaster('Necesitas iniciar sesion')
                return 
            }
            setLoading(true);
            const apiCall = await axios.delete(`${customer_api_urls.delete_address}/${id}`);
            setLoading(false);
            if (apiCall.status == api_statuses.success) {
                getUserInfo();
              
            } else {
                showToaster('Algo salió mal. Por favor, vuelva a intentarlo :/')
            }
        } catch (e) {
            // //console.log(e.response.data)
            setLoading(false);
            showToaster('Algo salió mal. Por favor, vuelva a intentarlo :/')
        }
    }
    const crearDireccion = () => {

        if (user) {
            //      createAddressRef.current.open()
            props.navigation.navigate('Search Address')
        } else {
            props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.INICIAR)
        }

    }

    if(loading) return <View style={CommonStyles.screenY}><LoaderComponent isVisible={loading} /></View>

  return (
    <View style={CommonStyles.screenY} >
     
      {
                addresses.length > 0 ?
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_SEARCH_MY_ADDRESS)}
                        style={{ alignSelf: 'flex-end', padding: 10 }}
                    >
                        <AntDesign name='plus' color='white' size={30} />
                    </TouchableOpacity>
                    : null
            }
            

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {
                    addresses?.length == 0 ?
                        <View style={{ ...CommonStyles.flexOneCenter }}>
                            <Image
                                source={require('../../../assets/images/location-pin.png')}
                                style={{ width: 200, height: 200 }}
                            />
                            <View style={[styles.AddressesDetailsWrapper, { width }]}>
                                <Text style={styles.createAddressText}>Crear dirección</Text>
                                <Text style={styles.createAddressDetailText}>Cree direcciones y haga que le resulte más fácil seleccionarlas al realizar pedidos, la dirección seleccionada será la dirección de entrega al realizar el pedido</Text>
                                <ButtonComponent
                                    buttonText={'Crea ahora'}
                                    colorB={Colors.terciarySolid}
                                    width={width / 1.5}
                                    margin={10}
                                    handlePress={crearDireccion}
                                />
                            </View>
                        </View>
                        :
                        addresses.map((item) => {
                            
                            return(
                            <View key={item._id} >
                                <AddressComponent
                                    info={item.info}
                                    phone={item.phone}
                                    deleteAddress={deleteAddress}
                                    
                                    addressLine={item.addressLine} label={item.label}
                                    item={item} 
                                    selected={address._id === item._id}   
                                />
                            </View>
                        )
                        })



                }


            </ScrollView>
    </View>
  )
}

 

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: Platform.OS == 'ios' ? deviceHeight * 0.15 : deviceHeight * 0.10,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerText: { ...CommonStyles.fontFamily, color: Colors.bgColor, fontSize: 20, position: 'absolute' },
    detailCard: {
        width: '100%',
      
        elevation: 5,
        alignSelf: 'center',
        padding: 20,
    },
    createAddressText: { ...CommonStyles.fontFamily, fontSize: 20 },
    createAddressDetailText: { fontSize: 13, fontWeight: '300', width: '90%', alignSelf: 'center', textAlign: 'center', color: Colors.dark },
    AddressesDetailsWrapper: { justifyContent: 'center', alignItems: 'center', bottom: 40 }
})