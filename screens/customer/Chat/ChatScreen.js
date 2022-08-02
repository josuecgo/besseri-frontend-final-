import { StyleSheet, Text, View } from 'react-native'
import React,{ useContext,useState }  from 'react'
import { HeaderTitle } from '../../../components/Customer/HeaderTitle'
import Colors from '../../../util/styles/colors'
import { ChatContext } from '../../../util/context/Chat/ChatContext'
import axios from 'axios'
import { showToaster } from '../../../util/constants'
import { vendor_api_urls } from '../../../util/api/api_essentials'
import { useEffect } from 'react'


export const ChatScreen = (props) => {
    const product = props?.route?.params;
    const { chatState } = useContext(ChatContext);
    const [store, setStore] = useState(null);
    console.log(product?.business_id);


    const getVendor = async() => {
        
        try {
            const url = `${vendor_api_urls.business_profile_detail}/${product?.business_id}`;
            const apiCall = await axios.get(url);
            
           
            setStore(apiCall?.data?.data?.store)
            // dispatch({
            //     type:'getProductos',
            //     payload: {
            //         productos: apiCall.data.data.products,
            //         categorias: apiCall.data.data.categories
            //     }
            // });
            // dispatch({
            //     type:'getCategorias',
            //     payload: {
                   
            //         categorias: apiCall.data.data.categories
            //     }
            // });
          
          
           
          } catch(e) {
            // console.log({getProducts:e})
            showToaster('No hay conexion con el servidor ');
           
          }
    }

    useEffect(() => {
        getVendor();
    }, [])
    
    console.log(store);

    return (
        <View style={styles.chatContent} >
            <HeaderTitle 
            titulo={store?.storeName} 
            // iconName='keyboard-backspace'

            />
        </View>
    )
}


const styles = StyleSheet.create({
    chatContent:{
        color:Colors.bgColor,

    }
    
})