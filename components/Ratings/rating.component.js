import React, { useEffect, useRef, useState } from 'react';
import {Text, TouchableOpacity, View,StyleSheet, FlatList, ScrollView, Image, useWindowDimensions, Modal} from 'react-native';
import Colors from '../../util/styles/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CommonStyles from '../../util/styles/styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
const RatingComponent = ({workable,numOfStars,totalReviews}) => {
   
  return (
   <View style={{...CommonStyles.flexDirectionRow,marginVertical:5,...CommonStyles.horizontalCenter}}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
       <AntDesign
       name={numOfStars >= 1 ? 'star' : 'staro'}
       size={17}
       color={numOfStars >= 1 ? Colors.primaryColor : 'grey'}
       />
        <AntDesign
       name={numOfStars >= 2 ? 'star' : 'staro'}
       size={17}
       color={numOfStars >= 2 ? Colors.primaryColor : 'grey'}
       />
        <AntDesign
       name={numOfStars >= 3 ? 'star' : 'staro'}
       size={17}
       color={numOfStars >= 3 ? Colors.primaryColor : 'grey'}
       />
        <AntDesign
       name={numOfStars >= 4 ? 'star' : 'staro'}
       size={17}
       color={numOfStars >= 4 ? Colors.primaryColor : 'grey'}
       />
        <AntDesign
       name={numOfStars >= 5 ? 'star' : 'staro'}
       size={17}
       color={numOfStars >= 5 ? Colors.primaryColor : 'grey'}
       />
    </View>
    {
        totalReviews && 
        <Text style={{...CommonStyles.fontFamily,fontSize:12,color:'grey',paddingLeft:5}}>+ 1k Ratings</Text>
    }
   </View>
  );
};
const styles = StyleSheet.create({
   
})

export default RatingComponent;
