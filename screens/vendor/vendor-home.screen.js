import { TouchableOpacity, StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../util/styles/colors';

import { HeaderTitle } from '../../components/Customer/HeaderTitle';
import { useCompras } from '../../hooks/useCompras';
import { CuponCard } from '../../components/Vendor/CuponCard';
import { CUPON_ROUTES } from '../../util/constants';


export const HomeScreen = (props) => {
    const {cupones,deleteCupones} = useCompras()
   
    const createCupon = () => {
        props?.navigation.navigate(CUPON_ROUTES.EDIT_CREATE)
    }

    const editarCupon = (data) => {
    //   //console.log({editar:data});
    }

    const eliminarCupon = (data) => {
       
        deleteCupones(data?._id)
    }




   
    return (
        <View style={{flex:1}} >
      
            <HeaderTitle titulo={'Cupones'} />
 
            <FlatList
            data={cupones}
            keyExtractor={item => item?._id}
            renderItem={({item}) => (
                <CuponCard  key={item?._id} data={item} editarCupon={editarCupon} eliminarCupon={eliminarCupon} />
            )
            }
            ItemSeparatorComponent={ ({item}) => (
                <View key={item?._id} style={{borderWidth:0.5,marginHorizontal:10,borderColor:Colors.bgColor}} />
            ) }
            />
 

          
            <View style={styles.footer} >
                <TouchableOpacity onPress={ createCupon } style={styles.btn}>
                    <View style={styles.btnText} >
                        <AntDesign name='plus' color={Colors.white} size={24}/>
                        <Text style={{fontSize:18,color:Colors.white,marginLeft:10}} >Agregar cupón</Text>
                        
                    </View>
                    
                </TouchableOpacity>
            </View>

          
 
 
     </View>
   )
 }
 
 
 const styles = StyleSheet.create({
   
     footer:{
        position:'absolute',
        bottom:10,
       
         width:'100%'
     },
     btn:{
        padding:10,
        alignItems:'center',
        backgroundColor:Colors.terciarySolid,
        marginHorizontal:10,
        borderRadius:5
     },
     btnText:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
         width:'100%',
 
         
     }
 })