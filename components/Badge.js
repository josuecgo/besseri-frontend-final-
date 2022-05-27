import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import CommonStyles from '../util/styles/styles'
import Colors from '../util/styles/colors'
import { adjust } from '../util/Dimentions'

export const Badge = ({count}) => {
  

  return (
    <>
        {count > 0 ? (
            <View style={styles.cartItemsLengthWrapper}>
                <Text style={styles.cartItemsLengthWrapperText}>
                  {count}
                </Text>
            </View>
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