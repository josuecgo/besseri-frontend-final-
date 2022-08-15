import { StyleSheet, ScrollView, View } from 'react-native'
import React from 'react'
import { FlatList, Image } from 'native-base'
import { base_url } from '../../util/api/api_essentials'
import { deviceWidth } from '../../util/Dimentions'

export const ProductImg = ({imgs}) => {
    
    return (
        <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        >
            {
                imgs.map((item) => (
                    <View key={item.path} 
                    style={styles.productImg}
                    >
                        <Image
                        source={{uri: `${base_url}/${item?.path}`}}
                        style={styles.productImg}
                        alt="Alternate Text"
                        resizeMode='contain'
                        />
                    </View>
                ))
            }
        </ScrollView>
    )
}



const styles = StyleSheet.create({

    productImg: {
        width: deviceWidth,
        height: deviceWidth * 0.53,
        
    },
})