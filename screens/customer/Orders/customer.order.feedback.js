import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { HeaderTitle } from '../../../components/Customer/HeaderTitle'
import { FormFeedback } from '../../../components/Feedback/FormFeedback';
import Colors from '../../../util/styles/colors';
import ButtonComponent from '../../../components/button/button.component';
import { showToaster } from '../../../util/constants';
import LoaderComponent from '../../../components/Loader/Loader.component';
import { customer_api_urls } from '../../../util/api/api_essentials';
import axios from 'axios';
import ImageCropPicker from 'react-native-image-crop-picker';
import { useDispatch, useSelector } from 'react-redux';
import { addImgs, changeForm, resetForm } from '../../../util/ReduxStore/Actions/FeedbackActions';
import { useOrder } from '../../../hooks/useOrder';
import { useEffect } from 'react';
import { getUserId } from '../../../util/local-storage/auth_service';


export const CustomerOrderFeedback = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const { order } = route.params;
  const [valueInputs, setValueInputs] = useState(order.products.map((item, i) => {
    return {
      product: item._id,
      installation: 3,
      durability: 3,
      price_quality: 3,
      general: 3,
      comments: '',
      imgs: []
    }
  }
  ));
  const {getMyOrders} = useOrder();
  
  


  const uploadProductImg = async () => {
    
    try {
      const user = await getUserId()
      await dispatch(resetForm());
      setIsLoading(true)
      valueInputs.map( async(item,i) => {
        let formData = new FormData()
        
        
        if (item?.imgs.length === 0) {
         
         
          enviarValoracion({
            customer:user,
            product:item.product,
            installation: item.installation,
            durability: item.durability,
            price_quality: item.price_quality,
            general: item.general,
            comments: item.comments,
            imgs:null
          })


         
        }else{
          item?.imgs?.map(  (img) =>  formData.append('imageFormData', {
            uri: img?.path,
            type: img?.mime,
            name: 'product.jpg',
          }));

          var requestoptions = {
            method: 'POST',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          };
    

          let resp = await fetch(customer_api_urls.upload_imgs_feedback, requestoptions);
    
          const data = await resp.json();

            let response =  {
              customer:user,
              product:item.product,
              installation: item.installation,
              durability: item.durability,
              price_quality: item.price_quality,
              general: item.general,
              comments: item.comments,
              imgs:data?.data
            }

           
            enviarValoracion(response)
            
        }


      })

      
      // await dispatch(resetForm());
      await getMyOrders();
      navigation.goBack();
     
     
    } catch (error) {
      console.log(error, 'upload');
      setIsLoading(false)
      return false
    }


  };

  
  // console.log(form);
  // console.log(valueInputs);
  const enviarValoracion = async (data) => {
    try {
      
     
      
      const apiCall = await axios.post(`${customer_api_urls.create_feedback}/${order._id}`,
        {data:[data]}
      );


      await dispatch(resetForm());
      setIsLoading(false)
     
      

    } catch (error) {
      console.log(error);
      await dispatch(resetForm());
      setIsLoading(false)
      showToaster('No hay conexion con el servidor.')
    }

  }



  

  return (
    <View style={styles.body} >
      <HeaderTitle
        nav={() => navigation.goBack()}
        titulo={'Dejar comentarios'}
      />


      <FlatList
        data={order.products}
        renderItem={({ item }) => {

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
        handlePress={uploadProductImg}
        borderRadius={100}
        buttonText={'Enviar valoración'}
        colorB={Colors.terciarySolid}
        margin={10}
        padding={5}
        disabled={isLoading}

      />
      <LoaderComponent isVisible={isLoading} />
    </View>
  )
}



const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: Colors.bgColor
  }
})