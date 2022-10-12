import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React,{ useContext,useState }  from 'react'
import { HeaderTitle } from '../../../components/Customer/HeaderTitle'
import Colors from '../../../util/styles/colors'
import { ChatContext } from '../../../util/context/Chat/ChatContext'
import axios from 'axios'
import { showToaster } from '../../../util/constants'
import { vendor_api_urls } from '../../../util/api/api_essentials'
import { useEffect } from 'react'
import { getUserId } from '../../../util/local-storage/auth_service'
import { IncomingMessage } from '../../../components/Chat/IncomingMessage'
import { OutgoingMessage } from '../../../components/Chat/OutgoingMessage'
import { SendMessage } from '../../../components/Chat/SendMessage'


export const ChatScreen = (props) => {
    const product = props?.route?.params;
    const { mensajes, getMensajes} = useContext(ChatContext);
    const [uid, setUid] = useState(0);
    const [store, setStore] = useState(null);

    const getVendor = async() => {
        
        try {
            const url = `${vendor_api_urls.business_profile_detail}/${product?.business_id}`;
            const apiCall = await axios.get(url);
            setStore(apiCall?.data?.data?.store)
            
           
        } catch(e) {
            // console.log({getProducts:e})
            showToaster('No hay conexion con el servidor ');
           
        }
        const id = await getUserId()
        setUid(id)
    }



    useEffect(() => {
        getVendor();
    }, [])

    useEffect(() => {
      if (store) {
        
        getMensajes(store?.account_id,product?._id)
      }
    }, [store])
    
    
   

    return (
        <>
            <HeaderTitle 
            titulo={store?.storeName} 
            // iconName='keyboard-backspace'
            />
            <View style={styles.chatContent} >
                <SendMessage para={store?.account_id} idProduct={product?._id} />
            <ScrollView contentContainerStyle={{
                flexDirection:'column-reverse'
            }} >
            {
                mensajes.map( msg => (
                    ( msg.para === uid )
                    ? <IncomingMessage key={ msg._id } msg={ msg } />
                    : <OutgoingMessage key={ msg._id } msg={ msg } />
                ))
            }
            </ScrollView>
            

               

            </View>
        </>
     
    )
}


const styles = StyleSheet.create({
    chatContent:{
        color:Colors.bgColor,
        flex:1,
        flexDirection:'column-reverse'
    }
    
})