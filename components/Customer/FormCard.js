import { StyleSheet, Text, View,ScrollView,TextInput } from 'react-native'
import React from 'react'
import Colors from '../../util/styles/colors'
import { deviceWidth } from '../../util/Dimentions'

export const FormCard = ({form,onChange}) => {
  return (
    <>
      <View style={styles.containerPage} >
            <View style={styles.formGroup}>
                <Text style={styles.formLabel}>NÚMERO DE TARJETA</Text>
                <TextInput
                selectTextOnFocus
                style={styles.formControl}
                keyboardType="number-pad"
                value={form.card_number}
                maxLength={16}
                onChangeText={text => onChange(text, 'card_number')}
                />
            </View>
            <View style={styles.formGroup}>
                <Text style={styles.formLabel}>NOMBRE DEL TITULAR</Text>
                <TextInput
                selectTextOnFocus
                style={styles.formControl}
                  value={form.holder_name}
                  onChangeText={text => onChange(text,'holder_name')}
                />
            </View>
            <View style={styles.rowForm}>
                <View style={[styles.formGroup, styles.middle]}>
                <Text style={styles.formLabel}>MES</Text>
                <TextInput
                    style={styles.formControl}
                    value={form.expiration_month}
                    keyboardType="number-pad"
                    maxLength={2}
                    onChangeText={text => onChange(text,'expiration_month')}
                />
                </View>
                <View style={[styles.formGroup, styles.middle]}>
                <Text style={styles.formLabel}>AÑO</Text>
                <TextInput
                    style={styles.formControl}
                    value={form.expiration_year}
                    keyboardType="number-pad"
                    maxLength={2}
                    onChangeText={text => onChange(text,'expiration_year')}
                />
                </View>
                <View style={[styles.formGroup, styles.middle]}>
                <Text style={styles.formLabel}>CVV</Text>
                <TextInput
                    style={styles.formControl}
                    value={form.cvv2}
                    keyboardType="number-pad"
                    onChangeText={text => onChange(text,'cvv2')}
                />
                </View>
            </View>

        </View>
       
        
    </>
  )
}

 

const styles = StyleSheet.create({
    body:{
        flex:1, 
        backgroundColor:Colors.bgColor
    },
    containerPage: {
        flex: 1,
        // paddingHorizontal: 10,
        backgroundColor:Colors.white,
        marginHorizontal:5,
        elevation:1
    },
    rowForm: {
        // width: '100%',
        flexDirection: 'row',
        // borderBottomWidth: 1,
        justifyContent: 'space-around',
        // borderBottomColor: Colors.terciarySolid,
        marginHorizontal:10,
        alignItems:'center',
       
    },
    middle: {
        width: deviceWidth / 3,
        alignItems:'center'
    },
    formGroup: {
        marginVertical: 15,
        marginHorizontal:10
    },
    formLabel: {
        fontSize: 10,
        color: Colors.textSecundary,
        // fontFamily: Colors.fontFamilyBold,
    },
    formControl: {
        fontSize: 17,
        // height: 37,
        color: Colors.tintColor         ,
        // fontFamily: Colors.fontFamilyBold,
        borderBottomWidth:1,
        borderBottomColor: Colors.light
    },
})