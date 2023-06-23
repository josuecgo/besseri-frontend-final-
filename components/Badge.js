import { View,  StyleSheet } from 'react-native'
import React from 'react'
import CommonStyles from '../util/styles/styles'
import Colors from '../util/styles/colors'
import { adjust } from '../util/Dimentions'
import { Badge as Ba,Text } from "native-base";

export const Badge = ({count}) => {
  

  return (
    <>
        {count > 0 ? (
            // <View style={styles.cartItemsLengthWrapper}>
            //     <Text style={styles.cartItemsLengthWrapperText}>
            //       {count}
            //     </Text>
            // </View>
            <Ba 
           
            colorScheme="danger" rounded="full" mb={-4} mr={-4} zIndex={1} variant="solid" 
         
            
            >
              <Text style={styles.txt} >{count}</Text>
            </Ba>
        ) : null}
    </>
  )
}

const styles = StyleSheet.create({
   
    txt: {
        fontSize: adjust(8),
        fontWeight: 'bold',
        color: 'white',
    }
})