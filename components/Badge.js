import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import CommonStyles from '../util/styles/styles'
import Colors from '../util/styles/colors'
import { adjust } from '../util/Dimentions'
import { Badge as Ba } from "native-base";

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
            colorScheme="danger" 
            rounded="full"  zIndex={1} variant="solid" alignSelf="flex-end"
             _text={{
              fontSize: adjust(10)
            }} 
            >{count}
            </Ba>
        ) : null}
    </>
  )
}

const styles = StyleSheet.create({
    cartItemsLengthWrapper: {
        position: 'absolute',
        width: 18,
        height: 18,
        // borderWidth: 1,
        borderRadius: 100,
        borderColor: Colors.red,
        backgroundColor: 'red',
        ...CommonStyles.flexCenter,
        top: -8,
        right:-5,
        justifyContent:'center',
        alignItems:'center',
    },
    cartItemsLengthWrapperText: {
        fontSize: adjust(8),
        fontWeight: 'bold',
        color: 'white',
    }
})