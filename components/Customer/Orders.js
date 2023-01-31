import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text, AspectRatio, Box, Center, Heading, HStack, Stack, Image, VStack } from 'native-base';
import Colors from '../../util/styles/colors';
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../util/constants';
import { ListStatusOrder } from '../ListStatusOrder';
import { getUserId } from '../../util/local-storage/auth_service';
import axios from 'axios';
import { api_statuses, customer_api_urls } from '../../util/api/api_essentials';
import { useEffect } from 'react';
import { useState } from 'react';
import LoaderComponent from '../Loader/Loader.component';
import Loading from '../Loader/Loading';


export const Orders = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comision, setComision] = useState(0);
  const [delivery, setDelivery] = useState(0);

  const getMyOrders = async () => {
    const userId = await getUserId();
    if (userId) {
      try {
        setLoading(true);
        
        const apiCall = await axios.get(`${customer_api_urls.get_my_orders}/${userId}`);

        
        
        setLoading(false);
        if (apiCall.status == api_statuses.success) {
          setOrders(apiCall.data.data)
        } else {
          showToaster('Algo salió mal. Por favor, vuelva a intentarlo ');
        }
      } catch (e) {
        // console.log(e)
        setLoading(false);
        showToaster('Algo salió mal. Por favor, vuelva a intentarlo')
      }
    } 
  }
  useEffect(() => {
    getMyOrders()
  }, []);


 console.log({
  // cancelled: orders.filter((order) => order?.status == "Cancelled"),
  // pending: orders.filter((order) => order?.status == "Pending"),
  completed: orders.filter((order) => order?.status == "Completed"),
  // ongoing: orders.filter((order) => order?.status == "Ongoing"),
 });

  const orderStatusItem = [
    {
      icon:'package-variant-closed',
      text:'Pendientes de envio',
      onPress:() => navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDERS_PENDING)
    },
    {
      icon:'cube-send',
      text:'Enviado',
      onPress:() => navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDERS_PENDING)
    },
    {
      icon:'package-down',
      text:'Pendientes de valoración',
      onPress:() => navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDERS_ALL)
    },
  ]

  return (
    <View style={styles.body} >
      <Text></Text>
      <Box>
        <Box
          rounded="lg"
          overflow="hidden"
          borderColor="coolGray.200"
          borderWidth="1"
          backgroundColor={Colors.white}
        >
          <Stack p="4" space={3}>
            <HStack space={3} justifyContent="space-between" alignItems='center' >
              <Heading size="md" ml="-1">
                Pedidos
              </Heading>
              <TouchableWithoutFeedback
              onPress={()=>navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDERS_ALL)}
              >
                <HStack alignItems='center' justifyContent="center" >
                  <Text
                  fontWeight="700" 
                  >
                    Ver todo
                  </Text>
                  <MaterialCommunityIcons
                    name={'chevron-right'}
                    size={25}
                    color={Colors.primarySolid}
                  />
                </HStack>
              </TouchableWithoutFeedback>
              

            </HStack>

            <Box
              rounded="lg"
              borderColor="coolGray.100"
              borderWidth="1"
              overflow="hidden"
            >
              <Stack p="3" space={'sm'}>
                {
                  orderStatusItem.map((item,index) => <ListStatusOrder 
                  item={item} key={index} 
                  onPress={item.onPress}
                  />)
                }
                
          



              </Stack>


            </Box>


          </Stack>
        </Box>
      </Box>
    </View>
  )
}



const styles = StyleSheet.create({
  body: {
    marginHorizontal: 10,
    backgroundColor: Colors.bgColor,
    flex: 1
  }
})