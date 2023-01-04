import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useMemo } from 'react'
import { useVendor } from '../../../hooks/useVendor'
import TopCircleComponent from '../../../components/top-circle/top-circle.component';
import ListCard from '../../../components/Vendor/ListCard';
import { Avatar, Box, FlatList, HStack, Spacer, VStack, Text, Pressable } from 'native-base';
import { useState } from 'react';
import Loading from '../../../components/Loader/Loading';
import { showToaster, VENDOR_DETAILS_ROUTES } from '../../../util/constants';
import FloatingActionButtonComponent from '../../../components/button/floating-action-button.component';



const getIcons = (name) => {
  const ICONS = {
    
    'FRENO': (
        <Avatar size="40px" source={require('../../../assets/images/categorias/freno.png')} />
    ),
    'TRANSMISION': (
        <Avatar size="40px" source={require('../../../assets/images/categorias/transmision.png')} />
    ),
    'LLANTAS': (
      <Avatar size="40px" source={require('../../../assets/images/categorias/llanta.png')} />
    ),
    'SUSPENSION': (
      <Avatar size="40px" source={require('../../../assets/images/categorias/amortiguador.png')} />
    ),
    'AFINACION': (
      <Avatar size="40px" source={require('../../../assets/images/categorias/afina.png')} />
    ),
    'MOTOR' : (
      <Avatar size="40px" source={require('../../../assets/images/categorias/motor.png')} />
    ),
    'DIRECCION' : (
      <Avatar size="40px" source={require('../../../assets/images/categorias/direccion.png')} />
    ),
    'BATERIAS' : (
      <Avatar size="40px" source={require('../../../assets/images/categorias/bateria.png')} />
    ),
    'CARROCERIA' : (
      <Avatar size="40px" source={require('../../../assets/images/categorias/carroceria.png')} />
    ),
    'DEFAULT' : (
      <Avatar size="40px" source={require('../../../assets/images/categorias/carroceria.png')} />
    )

  };
  
  if (!ICONS[name]) {

    return ICONS['DEFAULT'];
  }
  return ICONS[name];
};


export const ProductsScreen = ({navigation}) => {
  const {  showLoader, categorias,setSelectedcategory,selectedCategory, business_profile,
    business } = useVendor();
 
  // console.log({ showLoader, products, categorias });
  const floatButtonHandler = () => {
      if(!business?.location?.latitude || !business?.location?.longitude || !business?.location?.city || !business?.location?.state) {
        showToaster('Su ubicación no está configurada completamente, configúrela desde la configuración');
        return
      }
      if(business?.status == 'BLOCKED') {
        showToaster('No puedes crear productos porque tu cuenta está bloqueada');
        return;
      }
      if(!business?.wallet_id || !business_profile?.wallet?.charges_enabled) {
        showToaster('Es necesario configurar una cuenta comercial de Stripe antes de vender, vaya al panel y agregue la cuenta');
        return;
      }
      navigation.navigate(VENDOR_DETAILS_ROUTES.CREATE_PRODUCT,{
        product:null,
        isEdit:false
      });
  };
  
  const setView = async(item) => {
    
    await setSelectedcategory(item);
    navigation.navigate(VENDOR_DETAILS_ROUTES.SUBCATEGORIA,{item})
  }

  const renderItem = ({ item }) => (
    <Box borderBottomWidth="1" 
    _dark={{
      borderColor: "muted.50"
    }}
      borderColor="muted.800"
      pl={["0", "4"]} pr={["0", "5"]}
      py="2"
      
    >
      <TouchableOpacity
      onPress={()=> setView(item) }
      >
        <HStack 
        space={[2, 3]} 
        justifyContent="center" 
        alignItems={'center'} 
        style={styles.list}
        >
        {/* <Avatar size="40px" source={getIcon(item.name)} /> */}
        {
          getIcons(item.name)
        }
          <VStack>
            <Text
              _dark={{
                color: "warmGray.50"
              }} color="coolGray.800"
              bold
            >
              {item.name}
            </Text>
          </VStack>
        <Spacer />

        </HStack>
      </TouchableOpacity>
      
    </Box>
  )

  

  const memorizedValue = useMemo(() => renderItem, [categorias]);
  
 

  return (
    <View style={{flex:1}} >
      <TopCircleComponent textHeading={'Categorias'} />
      
      {
        showLoader ? (
          <Loading/>
        ) 
        : (
           <FlatList data={categorias}
            renderItem={memorizedValue}
            keyExtractor={item => item._id}
            showsVerticalScrollIndicator={false}
          />
        )
      }
      <FloatingActionButtonComponent handler={floatButtonHandler} />
    </View>
  )
}


const styles = StyleSheet.create({
  list:{
    marginHorizontal:5
  }
})