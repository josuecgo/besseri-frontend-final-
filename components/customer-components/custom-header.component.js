import React, {useRef, useState} from 'react';
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import InputFieldComponent from '../input-field/input-field.component';
import KEYBOARD_TYPES from '../../util/keyboard-types';
import {CUSTOMER_HOME_SCREEN_ROUTES} from '../../util/constants';
import {useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {adjust, deviceHeight, deviceWidth} from '../../util/Dimentions';
import {HeaderBackground} from '../Background/HeaderBackground';
import { getUserId } from '../../util/local-storage/auth_service';
const CustomHeaderComponent = props => {
  const [searchValue, setSearchValue] = useState('');
  const cart_items = useSelector(state => state.cart.cart_items);
  const searchRef = useRef();
  

 
  const goCart = async() => {
    const user_id = await getUserId();
    
    if (user_id) {
      props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDER_STACK) 
    }else{
      props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.INICIAR) 
    }
    
}
  return (
    <>
      <HeaderBackground hios={0.23} handroid={0.18} />
      <View style={[styles.header]}>
        <Pressable
          onPress={() => {
            props.navigation.openDrawer();
          }}>
          <Ionicons color={Colors.white} size={30} name="menu" />
        </Pressable>

        <Text style={styles.titulo}>{props.name}</Text>
        <View style={CommonStyles.flexDirectionRow}>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.MAP_STORES)
            }>
            <MaterialIcons
              style={{marginRight: 10}}
              color={Colors.white}
              size={30}
              name="storefront"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDER_STACK)
            }>
            <TouchableOpacity
              onPress={goCart}>
              <MaterialCommunityIcons
                color={Colors.white}
                size={30}
                name="cart"
              />
            </TouchableOpacity>
            {cart_items.length > 0 ? (
              <View style={styles.cartItemsLengthWrapper}>
                <Text style={styles.cartItemsLengthWrapperText}>
                  {cart_items.length}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
      </View>
      <View style={[{marginTop: 0, marginBottom: 20,alignItems:'center'}]}>
        <InputFieldComponent
          ref={searchRef}
          onFocus={() =>
            props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES?.SEARCH)
          }
          icon={
            <Ionicons
              // style={{marginLeft: 15, left: 6}}
              color={Colors.white}
              size={25}
              name="search"
            />
          }
          keyboardType={KEYBOARD_TYPES.DEFAULT}
          placeholderText={`Buscar`}
          secureTextEntry={false}
          value={searchValue}
          onChangeText={text => {
            setSearchValue(text);
          }}
          width={'86%'}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    width: deviceWidth,
    height: Platform.OS == 'ios' ? deviceHeight * 0.15 : deviceHeight * 0.1,

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
});

export default CustomHeaderComponent;
