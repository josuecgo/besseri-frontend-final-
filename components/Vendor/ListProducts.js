import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { DescriptionOrder } from './DescriptionOrder'
import { ListItemProduct } from './ListItemProduct'

export const ListProducts = ({products}) => {



    const renderItem = (item) => {
       
        return(
            <View key={item._id} >
                
                <ListItemProduct 
                item={item}
                
                /> 
            </View>
        )
    }

    return (
        <>
            {
                products.map((item)=> renderItem(item) )
            }
            
        </>
    )
}

