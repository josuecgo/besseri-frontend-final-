import { FlatList, StyleSheet, Text, View } from 'react-native'
import React,{ useState } from 'react'
import { HeaderTitle } from '../../../components/Customer/HeaderTitle'
import { FormFeedback } from '../../../components/Feedback/FormFeedback';
import Colors from '../../../util/styles/colors';
import ButtonComponent from '../../../components/button/button.component';
import { showToaster } from '../../../util/constants';
import LoaderComponent from '../../../components/Loader/Loader.component';
import { customer_api_urls } from '../../../util/api/api_essentials';
import axios from 'axios';
import ImageCropPicker from 'react-native-image-crop-picker';


export const CustomerOrderFeedback = ({navigation,route}) => {
  const [isLoading, setIsLoading] = useState(false)
  const {order} = route.params;
  const [valueInputs, setValueInputs] = useState(order.products.map((item,i) => { 
    return { 
      product: item._id ,
      installation: 3,
      durability:3,
      priceQuality:3,
      general:3,
      comments:''
    } }
  ));

  const pickProductImg1 = () => {
    ImageCropPicker.openPicker({
      multiple: true,
      width: 300,
      height: 400,
      maxFiles:3,
      mediaType:'photo',
      compressImageQuality:0.5,
      compressImageMaxHeight:400,
      compressImageMaxWidth:300
      
    }).then((image) => {
      
      onChangeText(image, CREDENTIAL_KEYS.PRODUCT_IMAGE);
      setCurrentScreen(SCREEN_TYPES?.PRODUCT_SUMMARY);
      setisSummaryMode(true);
     
    });
  };

 
  
  const uploadProductImg = async () => {
    setShowLoader(true);
    const imageFormData = new FormData();
    let images = '';
    
    for (let index = 0; index < images.length; index++) {  
      
      imageFormData.append('imageFormData', {
        uri: Platform.OS === 'ios' ? images[index]?.path : images[index]?.path,
        type: images[index]?.mime,
        name: 'photo.jpg',
      });
    }
    

    var requestoptions = {
      method: 'POST',
      body: imageFormData,
      headers:{
        'Content-Type' : 'multipart/form-data'
      }
    };

    let resp = await  fetch(vendor_api_urls.upload_product_image,requestoptions);
    
    const data = await resp.json();
    // console.log(data);
    if (data?.success) {
      return data?.data
    }
    return false
    
  };

  const enviarValoracion = async() => {
    try {
      const apiCall = await axios.post(`${customer_api_urls.create_feedback}/${order._id}`,
        {data:valueInputs}
      );
     

      // console.log(apiCall.data.data);
    } catch (error) {
      console.log(error);
    }
    
  }

  
  // console.log(valueInput[0]);
  
  return (
    <View  style={styles.body} >
      <HeaderTitle
      nav={()=> navigation.goBack() }
      titulo={'Dejar comentarios'}
      />
      
      
      <FlatList
      data={order.products}
      renderItem={({item}) => {
        
        return (
          <FormFeedback 
          product={item} 
          valueInputs={valueInputs} 
          setValueInputs={setValueInputs} 
          
          /> 
        )
        
      } 
      }
      keyExtractor={(item) => item._id}
      showsVerticalScrollIndicator={false}
      />

      <ButtonComponent
      handlePress={enviarValoracion}
      borderRadius={100}
      buttonText={'Enviar valoración'}
      colorB={Colors.terciarySolid}
      margin={10}
      padding={5}

      />

      <LoaderComponent isVisible={isLoading} />
    </View>
  )
}



const styles = StyleSheet.create({
  body:{
    flex:1,
    backgroundColor:Colors.bgColor
  }
})