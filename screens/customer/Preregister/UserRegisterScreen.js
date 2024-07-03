import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomSafeAreaViewComponent from '../../../components/custom-safe-area-view/custom-safe-area-view.component'
import { HeaderTitle } from '../../../components/Customer/HeaderTitle'

export const UserRegisterScreen = ({route}) => {
    const data = route.params

    console.log(data);
    return (
        <CustomSafeAreaViewComponent>
            <HeaderTitle titulo={'Termina tu registro'} />
        </CustomSafeAreaViewComponent>
    )
}

 

const styles = StyleSheet.create({})