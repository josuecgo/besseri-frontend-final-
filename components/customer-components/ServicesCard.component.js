import React, { useEffect, useState } from 'react';
import {Text, View,StyleSheet,Image,TouchableOpacity, Pressable} from 'react-native';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { base_url, customer_api_urls } from '../../util/api/api_essentials';
import RatingComponent from '../Ratings/rating.component';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux';
import { moneda } from '../../util/Moneda';
import axios from 'axios';
const ServicesCardComponent = ({onViewDetail,data}) => {
    const horizontalCardStyles = {
        cardContainer:{
          width:'100%',padding:20,elevation:12,borderBottomWidth:0.3,backgroundColor:'white'
        },
        img:{
          width:'25%',height:'100%',borderWidth:1,borderColor:'transparent',borderRadius:10
        },
        wrapper:{
          flexDirection:'row',justifyContent:'space-between',alignItems:'center'
        }
      }
      const [comision, setComision] = useState(0)
  
      
      useEffect(() => {
        if (data.name.length > 0) {
          getComision();
        }
        
      }, [data])
      
     
      const getComision = async() => {
        try {
          const getFee = await axios.get(customer_api_urls?.get_fees);
          
          setComision(getFee.data.data[0]?.besseri_comission);
        } catch (error) {
          console.log(error);
        }
        
    
      }

    return (
    <Pressable  onPress={onViewDetail} style={horizontalCardStyles.cardContainer}>
    <View style={horizontalCardStyles.wrapper}>
    <View>
        <Text style={{...CommonStyles.fontFamily,fontSize:15}}>{data?.name}</Text>
        <Text style={{color:'grey',...CommonStyles.fontFamily}}>{moneda(Number(data?.price) + Number((comision * data?.price) / 100))}
              {' '} MXN</Text>
        <Text style={{color:'grey'}}>{data?.maker?.name}</Text>
        <Text style={{color:'grey'}}>{data?.model?.name}</Text>
        <TouchableOpacity
        onPress={onViewDetail}
        ><Text style={{...CommonStyles.fontFamily,color:Colors.brightBlue,marginTop:10}}>{'Reservar ahora'}</Text></TouchableOpacity>
        {/* <RatingComponent numOfStars={2}/> */}
      </View>
      <Image
      source={{
        uri:`${base_url}/${data?.coverImg}`
      }}
      style={horizontalCardStyles.img}
      />
    </View>
  
    </Pressable>
  );
};
const styles = StyleSheet.create({
  cardContainer:{
    width:160,
    minHeight:290,
    borderWidth:1,
    borderColor:'white',
    backgroundColor:'white',
    elevation:5,
    margin:5,
    padding:5,
    paddingBottom:10
},
productImg:{
    width:'95%',
    height:100,
    marginVertical:10,
    alignSelf:'center'
},
productTitle:{...CommonStyles.fontFamily,fontSize:17,bottom:5,color:'grey'},
productPrice:{...CommonStyles.fontFamily,fontSize:20,marginVertical:4,color:Colors.black},
addToCartIcon:{alignSelf:'flex-end',marginRight:5},
quantityCard:{width:'100%',height:40,alignSelf:'center',flexDirection:'row',borderWidth:3,borderColor:'#D3D3D3',position:'absolute',bottom:5},
quantityButton:{width:'30%',backgroundColor:'#D3D3D3',...CommonStyles.flexCenter},
quantityText:{width:'40%',backgroundColor:'white',...CommonStyles.flexCenter},
addToCartButton:{
  margin:5
},
addToCartButtonText:{
  fontSize:15,color:Colors.brightBlue
}
})

export default ServicesCardComponent;
