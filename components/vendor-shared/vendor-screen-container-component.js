import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {SCREEN_HORIZONTAL_MARGIN} from '../../util/constants';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';
import FloatingActionButtonComponent from '../button/floating-action-button.component';
import { base_url } from '../../util/api/api_essentials';
import { HeaderBackground } from '../Background/HeaderBackground';
import { adjust, deviceHeight } from '../../util/Dimentions';
import TopHeader from '../Background/TopHeader';

const VendorScreenContainerComponent = ({
  date,
  screenHeading,
  showHeader,
  imageSource,
  children,
  floatButtonHandler,
  needFloatingActionButton = false,
  business
}) => {
  const {height} = useWindowDimensions();

  return (
    <View style={[CommonStyles.flexDirectionColumn,{borderRadius:0,flex:1,backgroundColor:Colors.bgColor}]}>
      <HeaderBackground/>
      <View>

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
});

export default VendorScreenContainerComponent;
