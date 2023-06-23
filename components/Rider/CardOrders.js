import {StyleSheet, Text, View, Image,Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {adjust, deviceWidth} from '../../util/Dimentions';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';
import ButtonComponent from '../button/button.component';

import {base_url, vendor_api_urls} from '../../util/api/api_essentials';
import LoaderComponent from '../Loader/Loader.component';
import { useCostos } from '../../hooks/useCostos';

export const CardOrders = ({data,requestRide}) => {
    const [store, setStore] = useState(false);
    const { CalcularDistancia, costoEnvio   } = useCostos()
   // //console.log(store.location);
   ////console.log(data.delivery_address)
    useEffect(() => {
       nameStore(data.storeId);
      
    }, [])
    
    const nameStore = id => {
    
        fetch(`${vendor_api_urls.business_profile_detail}/${id}`)
            .then(response => response.json())
            .then(data => setStore(data.data.store));
       
       
    };
    
    const delivery = () =>  {

      const costoDelivery = data.delivery_fee;
      CalcularDistancia(store,data?.delivery_address,costoDelivery)

    }

    useEffect(() => {
      delivery()
    }, [store])
    
   

    if (!store)  return (<LoaderComponent isVisible={!store} />)
    
    
    return (
    <View style={styles.orderCard}>
        <View style={styles.orderCardContent}>
            <View style={styles.orderCardHeader}>
                <Image
                    source={{
                    uri: `${base_url}/${store?.logo}`
                    }}
                    style={styles.orderCardImg}
                />
                <Text style={styles.orderCardTitle}>{store.storeName}</Text>
            </View>
            <Text style={styles.orderCardDeliveryFee}>
            {costoEnvio} MXN
            </Text>
        </View>
        <Text style={styles.orderCardDeliveryFee}>#{data?.orderId}</Text>

        <View style={{flexDirection: 'row'}}>
            <View style={styles.orderCardDots} />
            <View style={{paddingLeft: 5}}>
                <Text style={{...CommonStyles.fontFamily, color: 'grey'}}>
                    {'Direccíon de tienda'}
                </Text>
                <Text>{store.address} {store.city} </Text>
            </View>
        </View>

        <View style={styles.orderCardLine} />

        <View style={{flexDirection: 'row'}}>
            <View style={styles.orderCardDots} />
            <View style={{paddingLeft: 5}}>
            <Text style={{...CommonStyles.fontFamily, color: 'grey'}}>
                {'Dirección de entrega'}
            </Text>
            <Text>{data?.delivery_address?.addressLine}</Text>
            </View>
        </View>
        <View style={{alignSelf: 'flex-end'}}>
            <ButtonComponent
            buttonText={'Aplicar'}
            colorB={Colors.brightBlue}
            borderRadius={5}
            width={100}
            handlePress={() => {
                Alert.alert(
                '¿Quieres solicitar un viaje?',
                '¿De verdad desea solicitar esta entrega?, tendrá que entregarla dentro de los 5 días',
                [
                    {text: 'No'},
                    {
                    text: 'Si',
                    onPress: () => {
                        requestRide(data?._id);
                    },
                    },
                ],
                );
            }}
            />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    width: deviceWidth - 20,
    minHeight: 250,
    padding: 10,
    right: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginHorizontal: 15,
  },
  orderCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginVertical:10
  },
  orderCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 20,
    justifyContent:'space-between'
  },
  orderCardImg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor:'black'
  },
  orderCardTitle: {
    paddingLeft: 10,
    ...CommonStyles.fontFamily,
    fontSize: 14,
  },
  orderCardDeliveryFee: {fontSize: adjust(14), fontWeight: 'bold'},

  orderCardDots:{
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: Colors.terciarySolid,
    borderRadius: 20 / 2,
    backgroundColor: Colors.terciarySolid,
    
  },
  orderCardLine: {
    borderWidth: 1,
    height: 25,
    alignSelf: 'flex-start',
    left: 10,
    bottom: 5,
  },
  
});


