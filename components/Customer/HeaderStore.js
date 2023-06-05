import React from 'react';
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
import {  deviceHeight, deviceWidth } from '../../util/Dimentions';
import { HeaderBackground } from '../Background/HeaderBackground';
import { getUserId } from '../../util/local-storage/auth_service';


import { HStack, Image } from 'native-base';




const HeaderStore = (props) => {

  const cart_items = useSelector(state => state.cart.cart_items);
 
  let screenName = props?.titulo;
  

  const goCart = async () => {
    const user_id = await getUserId();
    if (user_id) {
      props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDER_STACK)
    } else {
      props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.INICIAR)
    }

  }
















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

          <Text style={styles.titulo}>{screenName}</Text>

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
        
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    width: deviceWidth,
    height: Platform.OS == 'ios' ? deviceHeight * 0.13 : deviceHeight * 0.10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor:Colors.bgColor,
    paddingTop:15
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
