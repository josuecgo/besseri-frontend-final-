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
import { HeaderTitle } from '../Customer/HeaderTitle';




const CustomHeaderComponent = props => {


  let screenName = props?.route?.name;


  return (
    <>
     <HeaderTitle 
     titulo={screenName} 
     />
    </>
  );
};

const styles = StyleSheet.create({

});

export default CustomHeaderComponent;
