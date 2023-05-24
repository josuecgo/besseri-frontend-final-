import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Pressable,
  Platform,
} from 'react-native';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CUSTOMER_HOME_SCREEN_ROUTES } from '../../util/constants';
import { useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { adjust, deviceHeight, deviceWidth } from '../../util/Dimentions';
import { HeaderBackground } from '../Background/HeaderBackground';
import { getUserId } from '../../util/local-storage/auth_service';

import { Badge } from '../Badge';
import { NotificationContext } from '../../util/context/NotificationContext';

import { ProductContext } from '../../util/context/Product/ProductContext';

import { ChatContext } from '../../util/context/Chat/ChatContext';
import { HStack, Image } from 'native-base';




const HeaderStore = props => {

  const cart_items = useSelector(state => state.cart.cart_items);
  const [searchText, setSearchText] = useState('')
  let screenName = props?.route?.name;
  const {
    searchCall,
    loading,
    resetFiltro,
    carCompatible
  } = useContext(ProductContext)



  const goCart = async () => {
    const user_id = await getUserId();
    if (user_id) {
      props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDER_STACK)
    } else {
      props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.INICIAR)
    }

  }






  useEffect(() => {
    if (searchText.length > 0) {
      searchCall(searchText, props?.route?.name);
    } else {
      resetFiltro();
    }
  }, [searchText]);









  return (
    <>
      <HeaderBackground />
      <View style={[styles.header]}>
        <HStack alignItems={'center'} space={3}>
          <Pressable
            onPress={() => {
              props.navigation.goBack();
            }}
            style={{
              backgroundColor: Colors.darker,
              borderRadius: 5,
              padding: 2
            }}
          >

            <MaterialCommunityIcons
              name={'keyboard-backspace'}
              color={Colors.white}
              size={24}
            />
          </Pressable>

          <Text style={styles.titulo}>Tienda</Text>

        </HStack>



        <View style={[CommonStyles.flexDirectionRow, {
          justifyContent: 'space-between',

        }]}>


          <TouchableOpacity onPress={goCart}  >
            <Image
              source={require('../../assets/images/24.png')}
              alt='car'
              resizeMode='contain'
              style={{
                height: 40,
                width: 30
              }}
            />
          </TouchableOpacity>
          {cart_items.length > 0 ? (
            <TouchableOpacity onPress={goCart} style={styles.cartItemsLengthWrapper}>
              {/* <Text style={styles.cartItemsLengthWrapperText}>
                {cart_items.length}
              </Text> */}
            </TouchableOpacity>
          ) : null}



        </View>

      </View>
      <View style={styles.top}>
        {/* <CarDefault/> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    width: deviceWidth,
    height: Platform.OS == 'ios' ? deviceHeight * 0.16 : deviceHeight * 0.10,

    // padding: 10,
    // borderWidth: 1,
    // borderColor: Colors.primaryColor,
    // backgroundColor: Colors.primaryColor,
    // ...CommonStyles.horizontalCenter,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  titulo: {

    ...CommonStyles.h2,
  },
  mainHeaderContainer: {
    // backgroundColor: Colors.red,
    padding: 10,
    paddingHorizontal: 20,
  },
  cartItemsLengthWrapper: {
    position: 'absolute',
    top: 5,
    right: 0,
    width: 10,
    height: 10,
    borderWidth: 1,
    borderRadius: 20 / 2,
    borderColor: Colors.red,
    backgroundColor: 'red',
    justifyContent:'center',
    alignItems:'center'
  },
  cartItemsLengthWrapperText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  top: {
    width: deviceWidth - 20,
    backgroundColor: Colors.bgColor,
    // height: 45,
    // borderWidth: 1,
    // borderColor: '#f8f8f8',
    // backgroundColor: '#f8f8f8',
    borderRadius: 5,
    paddingLeft: 10,
    color: 'grey',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    width: deviceWidth / 2,
    paddingHorizontal: 10,
    zIndex: 99999
  },
});

export default HeaderStore;
