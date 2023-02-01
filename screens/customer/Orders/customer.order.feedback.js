import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { HeaderTitle } from '../../../components/Customer/HeaderTitle'
import { FormFeedback } from '../../../components/Feedback/FormFeedback';
import Colors from '../../../util/styles/colors';

export const CustomerOrderFeedback = ({navigation,route}) => {
  // console.log(route.params.order);
  const {order} = route.params;
  return (
    <View  style={styles.body} >
      <HeaderTitle
      nav={()=> navigation.goBack() }
      titulo={'Dejar comentarios'}
      />
      
      
      <FlatList
      data={order.products}
      renderItem={({item}) => <FormFeedback product={item} />  }
      keyExtractor={(item) => item._id}
      />
    </View>
  )
}



const styles = StyleSheet.create({
  body:{
    flex:1,
    backgroundColor:Colors.bgColor
  }
})