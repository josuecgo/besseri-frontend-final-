import React from 'react';
import {Text, View,StyleSheet,Image,TouchableOpacity, Pressable} from 'react-native';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { base_url } from '../../util/api/api_essentials';
import RatingComponent from '../Ratings/rating.component';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux';
const ProductCardComponent = ({cartProduct,inCart,data,onAddToCart,increaseQuantity,decreaseQuantity,horizontal,onRemoveFromCart,onViewDetail}) => {
  const cartProductIds = useSelector(state => state.cart.cart_items_ids);
  if(horizontal) {
    const horizontalCardStyles = {
      cardContainer:{
        width:'100%',padding:20,elevation:12,borderBottomWidth:0.3,backgroundColor:'white'
      },
      img:{
        width:50,height:50,borderWidth:1,borderColor:'transparent',borderRadius:10
      },
      wrapper:{
        flexDirection:'row',justifyContent:'space-between',alignItems:'center'
      }
    }
   return (
    <Pressable  onPress={onViewDetail} style={horizontalCardStyles.cardContainer}>
  <View style={horizontalCardStyles.wrapper}>
  <View>
      <Text style={{...CommonStyles.fontFamily,fontSize:15}}>{data?.name}</Text>
      <Text style={{color:'grey',...CommonStyles.fontFamily}}>{data?.price} MXN</Text>
      <Text style={{color:'grey'}}>{data?.maker?.name}</Text>
      <Text style={{color:'grey'}}>{data?.model?.name}</Text>
      <TouchableOpacity
      onPress={onAddToCart}
      ><Text style={{...CommonStyles.fontFamily,color:Colors.brightBlue,marginTop:10}}>{cartProductIds?.includes(data?._id) ? 'REMOVE FROM CART' : 'ADD TO CART'}</Text></TouchableOpacity>
      {/* <RatingComponent numOfStars={2}/> */}
    </View>
    <Image
    source={{
      uri:`${base_url}/${data?.productImg}`
    }}
    style={horizontalCardStyles.img}
    />
  </View>

        {/* {
        cartProduct ? null : 
        <TouchableOpacity onPress={onAddToCart} style={styles.addToCartIcon}>
        {
          cartProductIds?.includes(data?._id) ? 
          <Ionicons name='cart' color={Colors.primaryColor} size={25}/>
          :
          <Ionicons name='cart-outline' color={Colors.primaryColor} size={25}/>
        }
    </TouchableOpacity>
      } */}
  </Pressable>
   )
  }
  return (
    <Pressable
    onPress={onViewDetail}
    style={styles.cardContainer}>
      {
        cartProduct?
        <TouchableOpacity
      onPress={onRemoveFromCart}
      style={{alignSelf:'flex-end',zIndex:5000,position:'absolute',top:0,width:35,height:35,borderWidth:1,borderColor:'white',borderRadius:35/2,justifyContent:'center',alignItems:'center',backgroundColor:'white',elevation:10}}>
        <AntDesign name='delete' color='red' size={18}/>
      </TouchableOpacity>
      :
      null
      }
    <Image
    source={{uri:`${base_url}/${data?.productImg}`}}
    style={styles.productImg}
    />
     {/* <View style={{flexDirection:'row',alignItems:'center',alignSelf:'center'}}>
      <Image
    source={{uri:`${base_url}/${data?.productImg}`}}
    style={{width:20,height:20,borderRadius:20/2,marginRight:5}}
    />
   
      </View> */}
    <View style={{margin:4}}>
    <Text style={{marginVertical:3}}>Besseri Autoparts</Text>
        <Text style={styles.productTitle}>{data?.name}</Text>
        <Text style={styles.productPrice}>{data?.price} MXN</Text>
        
      
      {
        cartProduct ? null : 
        <TouchableOpacity onPress={onAddToCart} style={styles.addToCartIcon}>
        {
          inCart ? 
          <Ionicons name='cart' color={Colors.primaryColor} size={25}/>
          :
          <Ionicons name='cart-outline' color={Colors.primaryColor} size={25}/>
        }
    </TouchableOpacity>
      }

      
       
        </View>
        {
        cartProduct?
        <View style={styles.quantityCard}>
        <TouchableOpacity 
        disabled={data?.quantity == 1}
        onPress={decreaseQuantity}
        style={styles.quantityButton}>
          <AntDesign
          name='minus'
          size={30}
          />
        </TouchableOpacity>
        <View style={styles.quantityText}> 
        <Text>{data?.quantity}</Text>
        </View>
        <TouchableOpacity 
        onPress={increaseQuantity}
        style={styles.quantityButton}>
        <AntDesign
          name='plus'
          size={20}
          />
        </TouchableOpacity>
      </View>
      :
      null
      }
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

export default ProductCardComponent;
