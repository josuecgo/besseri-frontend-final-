import { StyleSheet, Text, View,TextInput, ScrollView } from 'react-native'
import React,{ useState } from 'react'
import {  HeaderTitle } from '../../components/Customer/HeaderTitle'
import Colors from '../../util/styles/colors'
import { deviceWidth } from '../../util/Dimentions'

import moment from 'moment'

import { useForm } from '../../hooks/useForm'
import ButtonComponent from '../../components/button/button.component'
import axios from 'axios'
import { paymentApis } from '../../util/api/api_essentials'
import { getUser } from '../../util/local-storage/auth_service'
import { showToaster } from '../../util/constants'
import { useCompras } from '../../hooks/useCompras'
import { CreateBankCard } from '../../components/Customer/CreateBankCard'
import { FormCard } from '../../components/Customer/FormCard'


export const CreateCardScreen = (props) => {
    const {saveCards,isLoading} = useCompras()
    const card = props?.route?.params;
   
    const {form , onChange} = useForm({
        card_number: card ? card?.card_number : '',
        holder_name: card ? card?.holder_name : '',
        expiration_month: card ? card?.expiration_month : moment().format('MM'),
        expiration_year: card ? card?.expiration_year : moment().format('YY'),
        cvv2:''
    })
    
    
    

    const verifyInputs = async() => {
        
        if (form?.card_number.length <= 16 && form?.holder_name.length > 0 && form.cvv2.length > 0  ) {
            if (card) {
                // //console.log('editar');
            }else{
                const response = await saveCards(form)
               
                if (response) {
                    props?.navigation.pop()
                }
            }
            
        } else {
            showToaster('Campos incompletos')
        }
    }
   

    return (
    <View style={styles.body} >
        <HeaderTitle nav={()=> { }} titulo='Crear Tarjeta' />
        <ScrollView>
            <CreateBankCard
            item={{
                cardNumber:form.card_number,
                holderName:form.holder_name,
                expirationMonth:form.expiration_month,
                expirationYear: form.expiration_year,
            }}
            />

            <FormCard  form={form} onChange={onChange} />

            

        </ScrollView>

        {
            !isLoading && (
                <ButtonComponent
                handlePress={verifyInputs}
                borderRadius={0}
                buttonText={ card ? 'Editar' : 'Guardar'}
                colorB={Colors.terciarySolid}
        
                padding={5}
                />
            )
        }
        
    </View>
  )
}

 

const styles = StyleSheet.create({
    body:{
        flex:1, 
        backgroundColor:Colors.bgColor
    }
})