import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Heading, Image, TextArea } from 'native-base';
import { AirbnbRating } from 'react-native-ratings';

import { base_url } from '../../util/api/api_essentials';
import { deviceWidth } from '../../util/Dimentions';
import Colors from '../../util/styles/colors';
import { moneda } from '../../util/Moneda';
import { UploadImages } from '../UploadImages';
import ButtonComponent from '../button/button.component';


export const FormFeedback = ({ product,valueInputs, setValueInputs }) => {
  

  const ratingCompleted = (input,rating) => {
   
    
    const newState = valueInputs.map(obj => {
     
      if (obj.product === product._id) {
        
        if (input === 'imgs') {
          
         
          return {...obj, [input]: [...obj.imgs ,rating]};
        }

        return {...obj, [input]: rating};
      }

      
      return obj;
    });
    // //console.log(newState);

    setValueInputs(newState)
   
  

  }

  const deleteImg = (input,data) => {
   
    const newState = valueInputs.map(obj => {
    
      
      if (obj.product === product._id) { 
      
        let newImg =  obj.imgs.filter((img) =>  img.path !== data.path );
       
        return {...obj, [input]: newImg};
        
      }

      return obj;
    });
    
   
    setValueInputs(newState)
  }




  

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
        <AirbnbRating
          showRating={false}
          count={5}
          defaultRating={3}
          starContainerStyle={styles.starContainer}
          onFinishRating={(rating) => ratingCompleted('installation',rating)}
        />
        <Heading size="sm" >Durabilidad:</Heading>
        <AirbnbRating
          showRating={false}
          count={5}
          defaultRating={3}
          starContainerStyle={styles.starContainer}
          onFinishRating={(rating) => ratingCompleted('durability',rating)}
        />
        <Heading size="sm" >Relacion calidad precio:</Heading>
        <AirbnbRating
          showRating={false}
          count={5}
          defaultRating={3}
          starContainerStyle={styles.starContainer}
          onFinishRating={(rating) => ratingCompleted('price_quality',rating)}
        />
        <Heading size="sm" >General:</Heading>
        <AirbnbRating
          showRating={false}
          count={5}
          defaultRating={3}
          starContainerStyle={styles.starContainer}
          onFinishRating={(rating) => ratingCompleted('general',rating)}
        />
        <Heading size="sm" >Comentarios</Heading>
        <TextArea
          placeholder='Comentanos tu experiencia con el producto.'
          onChangeText={(text) => ratingCompleted('comments',text) }
        />

        <Heading size="sm" >Imágenes</Heading>
        <UploadImages 
        form={valueInputs.find((item) => item.product === product._id)}
        onChange={ratingCompleted} 
        deleteImg={deleteImg}
        />
      </View>

     

    </View>
  )
}

const styles = StyleSheet.create({
  content: {
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
  cardTop: {
    flexDirection: 'row'
  },
  img: {
    width: deviceWidth * 0.14,
    height: deviceWidth * 0.14,
    borderRadius: 100,
    marginVertical: 2
  },
  price: {
    color: Colors.textSecundary
  },
  cardCenter: {
    marginVertical: 10,
    justifyContent:'space-around'
  },
  starContainer:{
    alignSelf: "flex-start",
    marginHorizontal: 3,
    marginVertical: 5,
  }
})