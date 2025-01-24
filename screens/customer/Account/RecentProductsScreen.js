import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useInfoUser } from '../../../hooks/useInfoUsers'
import ProductListing from '../../../components/customer-components/ProductsListing.component'
import { ProductContext } from '../../../util/context/Product/ProductContext'
import { useDispatch, useSelector } from 'react-redux'
import { useCart } from '../../../hooks/useCart'
import { deviceHeight, deviceWidth } from '../../../util/Dimentions'
import Colors from '../../../util/styles/colors'
import { FlatList } from 'native-base'

export const RecentProductsScreen = (props) => {
    const { getRecentProduct } = useInfoUser()
    const [recentProducts, setRecentProducts] = useState([])
    const {comision,carCompatible} = useContext(ProductContext);
    const dispatch = useDispatch()
    const cartProductIds = useSelector(state => state.cart.cart_items_ids);
    const { addItemToCart } = useCart()


    const fetchRecentProducts = async () => {
        try {
            const response = await  getRecentProduct()
            setRecentProducts(response?.recentProducts || [])
        } catch (error) {
            console.log(error)  
        }
    }

    useEffect(() => {
        fetchRecentProducts()
    }, [])
    
 
    
    
    return (
        <View style={styles.container}> 
       
        <FlatList
        data={recentProducts}
        keyExtractor={item => item._id}
        renderItem={({item}) => {
            return (
                 <View  style={{ padding:5,width:deviceWidth * 0.5}}>
                <ProductListing
                navigation={props.navigation}
                category={item}
                products={item}
                comision={comision}
                carCompatible={carCompatible}
                dispatch={dispatch}
                cartProductIds={cartProductIds}
                addItemToCart={addItemToCart}
                // w={deviceWidth }
                />
                </View>
            )
        }}
        numColumns={2}
        // columnWrapperStyle={{ justifyContent: 'center' }}
        showsVerticalScrollIndicator={false}
        />

         {/* <View style={{ height: deviceWidth * 0.05, width: deviceWidth, marginVertical: 30 }} /> */}
        </View>
    )
}

 

const styles = StyleSheet.create({
    container: {
        
        backgroundColor: Colors.white,
        flex: 1,
        justifyContent:'center',
        alignItems: 'center',
        marginHorizontal:3
        // paddingHorizontal:
    }
})