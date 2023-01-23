import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Pressable,
  Platform,
} from 'react-native';
import SpinKit from 'react-native-spinkit';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CUSTOMER_HOME_SCREEN_ROUTES} from '../../util/constants';
import {useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {adjust, deviceHeight, deviceWidth} from '../../util/Dimentions';
import {HeaderBackground} from '../Background/HeaderBackground';
import {  getUserId } from '../../util/local-storage/auth_service';

import { Badge } from '../Badge';
import { NotificationContext } from '../../util/context/NotificationContext';
import { SearchInput } from './SearchInput';
import { ProductContext } from '../../util/context/Product/ProductContext';
import { CarDefault } from '../Customer/CarDefault';
import { ChatContext } from '../../util/context/Chat/ChatContext';




const CustomHeaderComponent = props => {

  const cart_items = useSelector(state => state.cart.cart_items);
  const [searchText, setSearchText] = useState('')
  let screenName = props?.route?.name;
  const {countCustomer,getNotificaciones} = useContext(NotificationContext);
  const {newsChats} = useContext(ChatContext);
  const {
    searchCall,
    loading,
    resetFiltro,
    carCompatible
  } = useContext(ProductContext)

 

  const goCart = async() => {
    const user_id = await getUserId();
    if (user_id) {
      props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDER_STACK) 
    }else{
      props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.INICIAR) 
    }
    
  }


  
  useEffect(() => {
    let abortController = new AbortController();  
    // getComision(); 
    getNotificaciones();
    return () => {  
    abortController.abort();  
    }  
  }, [])

 
  useEffect(() => {
    if (searchText.length > 0) {
        searchCall(searchText, props?.route?.name);
    }else{
      resetFiltro();
    }
  }, [searchText]);
 

  
  
  

  

 
  return (
    <>
      <HeaderBackground hios={0.16} handroid={0.12 } />
      <View style={[styles.header]}>
        <Pressable
          onPress={() => {
            props.navigation.openDrawer();
          }}>
          <Badge count={countCustomer + newsChats } />
          <Ionicons color={Colors.white} size={30} name="menu" />
        </Pressable>

        <Text style={styles.titulo}>{props.name}</Text>
        <View style={[CommonStyles.flexDirectionRow,{
          justifyContent:'space-between',
         
          }]}>
          <TouchableOpacity onPress={() =>
              props.navigation.navigate('Garage')
            }>
              <MaterialCommunityIcons
                color={Colors.white}
                size={30}
                name="car"
              />
            </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>{
              carCompatible(false)
              props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.MAP_STORES)
            }}>
            <MaterialIcons
              style={{marginHorizontal: 5}}
              color={Colors.white}
              size={30}
              name="storefront"
            />
          </TouchableOpacity>
        

          <TouchableOpacity onPress={goCart}  >
              <MaterialCommunityIcons
                color={Colors.white}
                size={30}
                name="cart"
                onPress={goCart}
              />
          </TouchableOpacity>
          {cart_items.length > 0 ? (
              <TouchableOpacity onPress={goCart} style={styles.cartItemsLengthWrapper}>
                <Text style={styles.cartItemsLengthWrapperText}>
                  {cart_items.length}
                </Text>
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
    flexDirection:'row',
    alignItems: 'center',
    justifyContent:'space-between'
  },
  titulo: {
    fontSize: adjust(20),
    color: Colors.white,
    textAlign: 'center',
  },
  mainHeaderContainer: {
    // backgroundColor: Colors.red,
    padding: 10,
    paddingHorizontal: 20,
  },
  cartItemsLengthWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 20 / 2,
    borderColor: Colors.red,
    backgroundColor: 'red',
    ...CommonStyles.flexCenter,
  },
  cartItemsLengthWrapperText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  top: {
    width: deviceWidth - 20,
    backgroundColor:Colors.bgColor,
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
    marginHorizontal:10
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    width:deviceWidth/2,
    paddingHorizontal:10,
    zIndex:99999
  },
});

export default CustomHeaderComponent;
