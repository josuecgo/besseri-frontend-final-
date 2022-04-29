import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,

  View,
} from 'react-native';
import {SCREEN_HORIZONTAL_MARGIN} from '../../util/constants';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';
import FloatingActionButtonComponent from '../button/floating-action-button.component';

import { HeaderBackground } from '../Background/HeaderBackground';
import { adjust, deviceHeight } from '../../util/Dimentions';

const VendorScreenContainerComponent = ({
  date,
  screenHeading,
 
  children,
  floatButtonHandler,
  needFloatingActionButton = false,
  
}) => {
  

  return (
    <View style={[CommonStyles.flexDirectionColumn,{borderRadius:0,flex:1}]}>
      <HeaderBackground/>
      <View style={{flex:1}} >

            <View style={{
              alignItems:'center',
              height: Platform.OS == 'ios' ?  deviceHeight *0.15 : deviceHeight * 0.12 ,
              justifyContent:'center'
            }} >
              <Text style={[CommonStyles.fontFamily, styles.heading]}>
                {screenHeading} 
              </Text>
              
            
              <Text style={[CommonStyles.fontFamily, styles.date]}> {date}</Text>

            
            </View>


        {needFloatingActionButton ? (
          
          <FloatingActionButtonComponent handler={floatButtonHandler} />
         
        ) : null}
         <ScrollView showsVerticalScrollIndicator={false} >{children}</ScrollView> 
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  date: {
    opacity: 0.5,
    color: Colors.white
  },
  heading: {
    fontSize: adjust(18),
    color: Colors.white
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },
  btnFloat:{
   
    flex:1
  }
 
});

export default VendorScreenContainerComponent;
