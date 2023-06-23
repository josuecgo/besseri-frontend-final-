import { Image, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { Box, FlatList, Avatar, HStack, VStack, Text, Spacer } from "native-base";
import { HeaderTitle } from '../../components/Customer/HeaderTitle'
import { ChatContext } from '../../util/context/Chat/ChatContext'
import { base_url } from '../../util/api/api_essentials';
import Colors from '../../util/styles/colors';
import { getBusinessProfile } from '../../util/local-storage/auth_service';
import Loading from '../../components/Loader/Loading';
import { ThinlineSeparator } from '../../components/CommonComponents';
import { fechaMensaje, horaMes } from '../../util/helpers/horaMes';
import { NotificationContext } from '../../util/context/NotificationContext';
import AllEmptyComponent from '../../components/vendor-shared/all-empty.component';
import { deviceHeight } from '../../util/Dimentions';

export const ChatsScreen = ({ navigation }) => {
    const { chats,  activarChat, newsChats } = useContext(ChatContext);


    const goChatPv = async (data) => {
       
        await activarChat({
            de: data.de,
            para: data.para._id,
            room: data.product._id
        })
        navigation.navigate('PRIVATE', { data });
    }

    // const allChats = async () => {


    //     getChats(uid)
    // }

    const renderItem = ({ item }) => {
        const { product, para } = item;
        // //console.log(item?.updatedAt);
        let img = `${base_url}/${product?.productImg}`
        return (
            <Box
               
                borderColor={Colors.textSecundary} bg={item?.isView ? Colors.lightGreen  : Colors.white}
               
            >
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => goChatPv(item)}
                >
                    <HStack
                        space={[2, 3]}
                        justifyContent="space-between"
                        style={{ marginHorizontal: 8, alignItems: 'center' }}
                        // borderBottomWidth="0.5"
                        // marginY={1}
                        padding={2}
                    >
                        <Avatar size="48px" source={{
                            uri: img
                        }}
                        />
                        <VStack width={'1/2'} >
                            <Text _dark={{
                                color: "warmGray.50"
                            }} color="coolGray.800" bold>
                                {para.name} {product.name} 
                            </Text>
                           
                            <Text
                                color="coolGray.600" _dark={{
                                    color: "warmGray.200"
                                }}
                                numberOfLines={1} ellipsizeMode='tail'
                            >
                                {item.last_message}

                            </Text>
                            

                        </VStack>
                        <Spacer />
                        <Text>
                        { fechaMensaje( item?.updatedAt ) }
                        
                        </Text>
                        {
                            item?.isView && (
                                <View 
                                style={{backgroundColor:Colors.brightBlue,width:10,height:10,borderRadius:100}} 
                                />
                            )
                        }
                       
                    </HStack>
                </TouchableOpacity>

                <ThinlineSeparator borderColor={'#EBEBEB'}  />
            </Box>

        )
    }


    


    return (
        <View  style={{flex:1,backgroundColor:Colors.bgColor}} >
            <HeaderTitle
                titulo={'CHATS'}
                iconName='keyboard-backspace'
                nav={() => navigation.goBack()}
            />
            {/* {
               loadingChats ? (
                <View style={{flex:1}} >
                    <Loading/>
                </View>
                
               ):(
                <FlatList
                data={chats}
                renderItem={renderItem}
                />  
               ) 
            } */}
            <FlatList
            data={chats}
            renderItem={renderItem}
            ListEmptyComponent={()=><View style={{
                flex:1,
                justifyContent:'center',
                alignItems:'center',
                // backgroundColor:'red',
                height:deviceHeight / 2
                }} >
                    <AllEmptyComponent customText='Aun no cuentas con mensajes' />
                </View>}
            />  

        </View>
    )
}

