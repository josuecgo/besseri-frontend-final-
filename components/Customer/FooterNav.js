import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Box, HStack, Center, Image } from 'native-base';


import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BOTTOM_TAB_CUSTOMER_ROUTES, CUSTOMER_HOME_SCREEN_ROUTES } from '../../util/constants';
import Colors from '../../util/styles/colors';

import { Badge } from '../Badge';
import { useSelector } from 'react-redux';



export const FooterNav = ({ state, navigation }) => {
  const { bottom } = useSafeAreaInsets()
  const size = 33;
  const { count } = useSelector(state => state.user)





  const getIconName = (route) => {

    switch (route) {
      case BOTTOM_TAB_CUSTOMER_ROUTES.HOME_SCREEN:

        return 'home'
      case BOTTOM_TAB_CUSTOMER_ROUTES.ACCOUNT:

        return 'steering'
      case BOTTOM_TAB_CUSTOMER_ROUTES.NOTIFICATION_STACK:

        return 'bell'
      default:
        return 'home'
    }
  }

  const getRouteName = (route) => {

    switch (route) {
      case BOTTOM_TAB_CUSTOMER_ROUTES.HOME_SCREEN:

        return CUSTOMER_HOME_SCREEN_ROUTES.SHOW_AUTO_PARTS
      case BOTTOM_TAB_CUSTOMER_ROUTES.ACCOUNT:

        return CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_HOME
      case BOTTOM_TAB_CUSTOMER_ROUTES.NOTIFICATION_STACK:

        return BOTTOM_TAB_CUSTOMER_ROUTES.NOTIFICATION_STACK
      default:
        return CUSTOMER_HOME_SCREEN_ROUTES.SHOW_AUTO_PARTS
    }
  }

  return (
    <HStack style={[styles.footer, { paddingBottom: bottom }]}>
      {state.routes.map((route, index) => {


        if (route.name !== BOTTOM_TAB_CUSTOMER_ROUTES.ACCOUNT) {

          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(getRouteName(route?.name))

              }}
              key={index}
              style={styles.btn}
            >


              <Center>
                {
                  route.name === BOTTOM_TAB_CUSTOMER_ROUTES.NOTIFICATION_STACK && (
                    <Box zIndex={2} position={'absolute'} top={-9}>
                      <Badge count={count} />
                    </Box>
                  )
                }

                <MaterialCommunityIcons name={getIconName(route?.name)} size={size} />

              </Center>
            </TouchableOpacity>
          );
        }

        return (
          <View
            style={styles.containerButton}
            key={index} >
            <TouchableOpacity
              style={styles.btnAccount}
              onPress={() => {


                if (route?.state?.index == 0 || !route?.state) {
                  navigation.navigate('Cuenta Stack')
                } else {
                  navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_HOME)
                }


              }}
              activeOpacity={1}
            >
              <Image
                source={require('../../assets/images/footer/volante.png')}
                style={styles.icono}
                alt={'menu'}
              />

            </TouchableOpacity>
          </View>
        )

      })}
    </HStack>


  )
}


const styles = StyleSheet.create({
  footer: {
    backgroundColor: Colors.white,
    // flexDirection:'row',
    // width:deviceWidth,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10
    // bottom:0,
    // flex:1,

  },
  content: {
    backgroundColor: '#F7F7F7',
    height: 70

  },
  btn: {
    // marginHorizontal:deviceWidth / 7
  },
  containerButton: {
    top: -20,
    backgroundColor: 'transparent',
    borderRadius: 100
  },
  btnAccount: {
    height: 50,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center'
  }, icono: {

    height: 100,
    width: 100,
    resizeMode: 'contain'
  }
})