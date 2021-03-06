import React from 'react';
import {FlatList, Text, TouchableOpacity, View,Image, StyleSheet,Pressable, useWindowDimensions} from 'react-native';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import AntDesign from 'react-native-vector-icons/AntDesign'
import ProductCardComponent from './product-card.component';
import * as CartActions from '../../util/ReduxStore/Actions/CustomerActions/CartActions';
import { useDispatch, useSelector } from 'react-redux';
import { CUSTOMER_HOME_SCREEN_ROUTES, SHARED_ROUTES, showToaster } from '../../util/constants';
import { base_url } from '../../util/api/api_essentials';
import { adjust, deviceWidth } from '../../util/Dimentions';
import LinearGradient from 'react-native-linear-gradient';
import { moneda } from '../../util/Moneda';

const ServiceListing = ({category,services,navigation,comision}) => {


  return (
    <View style={styles.container}>
        <View style={styles.buttonAndTextContainer}>
            <View style={{width:'60%'}}>
            <Text style={{...CommonStyles.fontFamily,fontSize:adjust(14)}}>{category}</Text>
            </View>
            {/* <TouchableOpacity style={styles.seeMoreButton}>
                <Text style={{...CommonStyles.fontFamily,color:'white'}}>See more</Text>
            </TouchableOpacity> */}
        </View>

        <FlatList
        data={services}
        contentContainerStyle={{marginTop:15,marginLeft:10}}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <Pressable
            onPress={() => {
                navigation.navigate(SHARED_ROUTES.SERVICE_DETAIL,{
                    service:item,
                    isVendor:false,
                    comision:comision
                })
            }}
            style={styles.cardContainer}
            >
              <Image
                source={{uri:`${base_url}/${item?.coverImg}`}}
              style={styles.productImg} 
            
              />

              <LinearGradient
               colors={Colors.primaryGradient}
               style={styles.LinearGradient}
              >
                <View>
                  <Text ellipsizeMode='tail' numberOfLines={1} style={styles.productTitle}>{item?.name}</Text>
                  <Text style={styles.productMaker}>{item?.makers.name} {item?.model?.name} </Text>
                  <Text style={styles.category}>{item?.category?.name}</Text>
                </View>
                
                <Text style={styles.productPrice}>MXN {moneda( Number(item?.price)+ Number(comision) *Number(item?.price) / 100 )}</Text>
                
               

              </LinearGradient>

      

                 
          </Pressable>
        )}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    marginVertical:15,
    width:'95%'
  },
  buttonAndTextContainer:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:10},
  seeMoreButton:{paddingHorizontal:15,
    backgroundColor:Colors.primaryColor,
    justifyContent:'center',alignItems:'center',
    padding:10,borderWidth:1,borderColor:Colors.primaryColor,
    borderRadius:30
  },
  card:{
    width: '100%', 
    padding: 20, 
    elevation: 12, 
    borderBottomWidth: 0.3,
    backgroundColor:Colors.white,
    elevation:2
  
  },
  cardContainer: {
    width: 160,
    // minHeight:250,
    // borderColor: 'white',
    margin: 5,
    elevation:0,
    // padding:5
  },
  LinearGradient: {
    minHeight: deviceWidth * 0.24,
    padding: 5,
    justifyContent:'space-between'
  },
  category:{
    fontSize:adjust(7),
    color:Colors.gray,
    textTransform:'capitalize'

  },
  productImg: {
    width: '100%',
    height: deviceWidth * 0.3,
    // marginVertical:10,
    alignSelf: 'center',
    resizeMode:'stretch'
  },
  productTitle: { ...CommonStyles.fontFamily, fontSize: adjust(10), bottom: 5, color: Colors.white },
  productPrice: { ...CommonStyles.fontFamily, fontSize: adjust(11), marginVertical: 4, color: Colors.secundarySolid },
  productMaker:{ ...CommonStyles.fontFamily, fontSize: adjust(7), bottom: 5, color: Colors.secundarySolid },
  wrapper:{
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center'
     
  }
 
})

export default ServiceListing;
