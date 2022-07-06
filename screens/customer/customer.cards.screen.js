import { StyleSheet, Text, View,TouchableOpacity, Platform, FlatList } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { HeaderBackground } from '../../components/Background/HeaderBackground'
import Colors from '../../util/styles/colors';
import { deviceHeight } from '../../util/Dimentions';
import CommonStyles from '../../util/styles/styles';
import { useCompras } from '../../hooks/useCompras';
import { BankCard } from '../../components/Customer/BankCard';

export const CustomerCardsScreen = (props) => {
    const {cards} = useCompras()

    
    return (
    <View style={{flex:1}} >
       <HeaderBackground/>
        <View style={styles.header}>
            <TouchableOpacity
            onPress={() => props?.navigation?.goBack()}
            style={{alignSelf:'flex-start'}}>
                <MaterialCommunityIcons
                name='keyboard-backspace'
                color={Colors.white}
                size={25}
                />
            </TouchableOpacity>
            <Text style={styles.headerText}>Tarjetas</Text>
        </View>

        

        <FlatList
        data={cards}
        keyExtractor={item => item?.id}
        renderItem={({item}) => (
            <BankCard data={item} />
        )
        }
        />
         
        <View style={styles.footer} >
            <TouchableOpacity onPress={() => console.log('click') } style={styles.btn}>
                <View style={styles.btnText} >
                    <AntDesign name='plus' color={Colors.white} size={24}/>
                    <Text style={{fontSize:18,color:Colors.white}} >Agregar una nueva tarjeta</Text>
                </View>
                
            </TouchableOpacity>
        </View>


    </View>
  )
}


const styles = StyleSheet.create({
    header:{
        width: '100%',
        height: Platform.OS == 'ios' ? deviceHeight * 0.15 : deviceHeight * 0.10,
        paddingHorizontal:20,
        alignItems:'center',
        justifyContent:'center'
    },
    headerText:{...CommonStyles.fontFamily,color:Colors.white,fontSize:20,position:'absolute'},
    detailCard:{
        width:'100%',
        backgroundColor:'white',
        elevation:5,
        alignSelf:'center',
        padding:20,
    },
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
        justifyContent:'space-around',
        width:'100%',

        
    }
})