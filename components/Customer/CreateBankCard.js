import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '../../util/styles/colors';
import { adjust } from '../../util/Dimentions';

export const CreateBankCard = ({item}) => {

   
  return (
    <View style={styles.card}>
        <View style={[styles.textItem,{marginTop:15}]}>
            
            <Text style={styles.textCard}>NOMBRE DEL TITULAR</Text>
            <Text style={styles.textDataCard}>{item.holderName}</Text>
        </View>
        <View style={styles.textItem} >
            <Text style={styles.textCard}>NÚMERO DE TARJETA</Text>
            <View style={styles.cardNumber}>
            {formatCardNumber(item.cardNumber).map((cardNumber, index) => (
                <Text key={`00${index}`} style={styles.textCardNumber}>
                {cardNumber}
                </Text>
            ))}
            </View>
        </View>

        <View style={[styles.textItem]}>

            <View style={{alignItems:'flex-end'}} >
                <Text style={[styles.textCard,{fontSize:adjust(6)}]}>FECHA DE EXPIRACIÓN</Text>
                <Text style={[styles.textDataCard,{fontSize:adjust(9)}]}>
                    {item.expirationMonth}/{item.expirationYear}
                </Text>
            </View>
        </View>

    </View>
  )
}

function formatCardNumber(cardNumber) {
    const temporal = [];
    const arrayCreditCard = cardNumber.split('');
    for (var i = 0; i < arrayCreditCard.length; i += 4) {
      temporal.push(arrayCreditCard.slice(i, i + 4));
    }
  
    return temporal.map(splice => splice.join(''));
  }

const styles = StyleSheet.create({
    card: {
        borderRadius: 15,
        padding: 10,
        backgroundColor: Colors.primarySolid,
        margin:5,
        borderRadius:5,
        elevation:2
      },
      iconBrand: {
        width: 30,
        height: 20,
        tintColor: Colors.white,
      },
      titleItem: {
        color: Colors.white,
        // fontFamily: Colors.fontFamily,
        fontSize: 17,
      },
      infoItem: {
        color: Colors.white,
        // fontFamily: Colors.fontFamily,
        fontSize: 13,
      },
      textItem: {
        width: '100%',
        // flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom : 5,
        marginTop:10,
        // backgroundColor:Colors.primarySolid
      },
      textCard: {
        color: Colors.white,
        // fontFamily: Colors.fontFamilyBold,
        fontSize: adjust(9),
      },
      cardNumber: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        minHeight: 35,
      },
      textCardNumber: {
        color: Colors.white,
        // fontFamily: Colors.fontFamily,
        fontSize: adjust(15),
      },
      textDataCard: {
        color: 'rgba(255, 255, 255, .65)',
        // fontFamily: Colors.fontFamily,
        fontSize: adjust(15),
      },
      rowForm: {
        width: '100%',
        flexDirection: 'row',
        borderBottomWidth: 1,
        justifyContent: 'space-around',
        // borderBottomColor: Colors.whiteColor,
      },
      middle: {
        width: '30%',
      },
      formGroup: {
        marginVertical: 15,
      },
      formLabel: {
        fontSize: 10,
        // color: Colors.whiteColor50,
        // fontFamily: Colors.fontFamilyBold,
      },
      formControl: {
        fontSize: 17,
        height: 37,
        // color: Colors.whiteColor,
        // fontFamily: Colors.fontFamilyBold,
      },
     


})