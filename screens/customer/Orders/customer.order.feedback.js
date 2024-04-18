import { FlatList, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { HeaderTitle } from '../../../components/Customer/HeaderTitle'
import { FormFeedback } from '../../../components/Feedback/FormFeedback';
import Colors from '../../../util/styles/colors';
import ButtonComponent from '../../../components/button/button.component';
import { showToaster } from '../../../util/constants';
import LoaderComponent from '../../../components/Loader/Loader.component';
import { customer_api_urls } from '../../../util/api/api_essentials';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { resetForm } from '../../../util/ReduxStore/Actions/FeedbackActions';

import { getUserId } from '../../../util/local-storage/auth_service';
import { useInfoUser } from '../../../hooks/useInfoUsers';


export const CustomerFormFeedback = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const { order,id } = route.params;
  

  const [valueInputs, setValueInputs] = useState(order.map((item, i) => {
   
   
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

  const {getPedidosUser} = useInfoUser();
  
  


  const uploadProductImg = async () => {
    
    try {
      const user = await getUserId()
      let result = ''

      setIsLoading(true)
      valueInputs.map( async(item,i) => {
        let formData = new FormData()
        
        
        if (item?.imgs.length === 0) {
         
         
          result =  await enviarValoracion({
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

           
             result =  await enviarValoracion(response)
            
        }


      })

      
      await dispatch(resetForm());
      await getPedidosUser();
     
      navigation.goBack();
      navigation.goBack();
     
    } catch (error) {
      console.log(error, 'upload');
      setIsLoading(false)
      return false
    }


  };

  

  const enviarValoracion = async (data) => {
    try {
      
     
      
      const result  = await axios.post(`${customer_api_urls.create_feedback}/${id}`,
        {data:[data]}
      );

    
      // await dispatch(resetForm());
      // await getPedidosUser()
      // setIsLoading(false)
      
      
      return result.data
    } catch (error) {
      //console.log(error);
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
        data={order}
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