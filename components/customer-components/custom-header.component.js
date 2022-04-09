import React, {useRef, useState} from 'react';
import {StyleSheet, View,TouchableOpacity,Text, Pressable} from 'react-native';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import InputFieldComponent from '../input-field/input-field.component';
import KEYBOARD_TYPES from '../../util/keyboard-types';
import { CUSTOMER_HOME_SCREEN_ROUTES } from '../../util/constants';
import { useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
const CustomHeaderComponent = props => {
  const [searchValue, setSearchValue] = useState('');
  const cart_items = useSelector(state => state.cart.cart_items);
  const searchRef = useRef();
  return (
    <View
      style={[
        CommonStyles.flexDirectionColumn,
        CommonStyles.verticalCenter,
        styles.mainHeaderContainer,
      ]}>
      <View
        style={[
          CommonStyles.flexDirectionRow,
          CommonStyles.justifySpaceBetween,
        ]}>
        <Pressable
        onPress={() => {
          props.navigation.openDrawer()
        }}
        >
          <Ionicons color={Colors.white} size={30} name="menu" />
        </Pressable>
        <View style={CommonStyles.flexDirectionRow}>
        <TouchableOpacity
        onPress={() => props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.MAP_STORES)}
        >
        <MaterialIcons
            style={{marginRight: 10}}
            color={Colors.white}
            size={30}
            name="storefront"
          />
        </TouchableOpacity>
                  <TouchableOpacity onPress={() => props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDER_STACK)}>
                  <TouchableOpacity onPress={() => props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDER_STACK)} >
          <MaterialCommunityIcons color={Colors.white} size={30} name="cart" />
        </TouchableOpacity>
                 {
                   cart_items.length > 0 ?
                   <View style={styles.cartItemsLengthWrapper}>
                   <Text style={styles.cartItemsLengthWrapperText}>{cart_items.length}</Text>
                 </View>
                 :
                 null
                 }
                  </TouchableOpacity>
        </View>
      </View>
      <View style={[CommonStyles.flexCenter, {marginTop: 10}]}>
        <InputFieldComponent
        ref={searchRef}
        onFocus={() => props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES?.SEARCH,{
          isServices:props?.isService
        })}
          icon={
            <Ionicons
              style={{marginLeft: 10,left:5}}
              color={Colors.dark}
              size={30}
              name="search"
            />
          }
          keyboardType={KEYBOARD_TYPES.DEFAULT}
          placeholderText={`Search For ${props.name}`}
          secureTextEntry={false}
          value={searchValue}
          onChangeText={text => {
            setSearchValue(text);
          }}
          width={'100%'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainHeaderContainer: {
    backgroundColor: Colors.primaryColor,
    padding: 10,
    paddingHorizontal: 20,
  },
  cartItemsLengthWrapper:{
    position:'absolute',bottom:0,right:0,width:20,height:20,borderWidth:1,borderRadius:20/2,borderColor:Colors.red,backgroundColor:'red',...CommonStyles.flexCenter
  },
  cartItemsLengthWrapperText:{fontSize:10,fontWeight:'bold',color:'white'}
});

export default CustomHeaderComponent;
