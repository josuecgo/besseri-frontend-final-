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
import { addImgs, resetForm } from '../../../util/ReduxStore/Actions/FeedbackActions';


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

  const form = useSelector( state => state.feedback )


 
  const uploadProductImg = async (formData) => {
    // console.log(valueInputs);

    try {

     

     

      var requestoptions = {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      let resp = await fetch(customer_api_urls.upload_imgs_feedback, requestoptions);

      const data = await resp.json();
      

      if (data?.success) {
       
        return data?.data
       
         
      }

    } catch (error) {
      console.log(error, 'upload');
      return false
    }


  };


  
 
  const enviarValoracion = async () => {
    try {

      await dispatch(resetForm());
  
      await valueInputs.map( async(item,i) => {
        let formData = new FormData()

        item?.imgs?.map((img) => formData.append('imageFormData', {
          uri: img?.path,
          type: img?.mime,
          name: 'product.jpg',
        }));

        let result = await  uploadProductImg(formData);
       
        
        await dispatch(addImgs({
          ...item,
          imgs:result
        }));
        // if (result) {
         
        //   setValueInputs([
        //     ...valueInputs,
        //     {
        //       ...item,
        //       imgs: result
        //     }
        //   ])
        //   return {
        //     ...item,
        //     imgs: result
        //   }
        
        // }else{
         
        //   return {
        //     ...item,
        //     imgs: []
        //   }
          
        // }

      })



     
      
      console.log(form.feedback,'imgs');
    
     
     
      
      const apiCall = await axios.post(`${customer_api_urls.create_feedback}/${order._id}`,
        {data:form.feedback}
      );

      console.log(apiCall.data);

    } catch (error) {
      console.log(error);
    }

  }


  // console.log(valueInput[0]);

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
  body: {
    flex: 1,
    backgroundColor: Colors.bgColor
  }
})