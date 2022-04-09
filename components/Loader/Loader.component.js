import React from 'react';
import CommonStyles from '../../util/styles/styles';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Colors from '../../util/styles/colors';
import Modal from 'react-native-modal';
import SpinKit from 'react-native-spinkit';
const LoaderComponent = ({isVisible}) => {
  
  return (
    <Modal
    isVisible={isVisible}
    >
       <View style={CommonStyles.flexOneCenter}>
           <View style={styles.loaderWrapperStyle}>
               <SpinKit
               type='Wave'
               isVisible={isVisible}
               color={Colors.primaryColor}
               size={30}
               />
             </View>
        </View> 
    </Modal>
  );
};

const styles = StyleSheet.create({
    loaderWrapperStyle:{ 
        width:60,
        height:60,
        borderWidth:1,
        borderColor:Colors.white,
        backgroundColor:Colors.white,
        borderRadius:10,
        ...CommonStyles.flexCenter
    }
});

export default LoaderComponent;
