import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Heading, Image, Typeahead } from 'native-base';
import { base_url } from '../../util/api/api_essentials';
import { deviceWidth } from '../../util/Dimentions';
import Colors from '../../util/styles/colors';
import { moneda } from '../../util/Moneda';

export const FormFeedback = ({ product }) => {

  console.log(product);

  return (
    <View style={styles.content} >
      <View style={styles.cardTop} >
        <Image
        source={{ uri: `${base_url}/${product?.productImg}` }}
        alt="Image"
        resizeMode="cover"
        style={styles.img}
        />
        <View>
          <Text> {product.name} </Text>
          <Text> {product.description} </Text>
          <Text style={styles.price} > {moneda(product.price)} x {product.quantity} </Text>
        </View>

      </View>

      <View style={styles.cardCenter} >
        <Heading size="sm" >Valora la facilidad de la instalación:</Heading>
    
      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
  content:{    
    width: '95%',
    minHeight: 100,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Colors.white,
    elevation: 3,
    margin: 15,
    alignSelf: 'center',
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderWidth: 1,
    elevation: 2,
    backgroundColor: Colors.white,
  },
  cardTop:{
    flexDirection:'row'
  },
  img:{
    width: deviceWidth * 0.14,
    height: deviceWidth * 0.14,
    borderRadius: 100,
    marginVertical: 2
  },
  price:{
    color:Colors.textSecundary
  },
  cardCenter:{
    marginVertical:10
  }
})