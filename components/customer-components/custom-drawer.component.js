import React, { useContext, useEffect, useState } from 'react';
import {StyleSheet, Text, View} from 'react-native';

import Colors from '../../util/styles/colors';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {CUSTOMER_HOME_SCREEN_ROUTES , showToaster} from '../../util/constants';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getUser, logout } from '../../util/local-storage/auth_service';

import { HeaderBackground } from '../Background/HeaderBackground';
import { adjust, deviceHeight, deviceWidth } from '../../util/Dimentions';
import { Badge } from '../Badge';
import { ProductContext } from '../../util/context/Product/ProductContext';
import { ChatContext } from '../../util/context/Chat/ChatContext';


const getIcons = ({focused, color, size, name,count}) => {
  const ICONS = {
    'Autopartes': (
      // <ImgIcon url={require('../../assets/images/iconos/autopartes.png')} />
      <MaterialIcons name='drive-eta'  size={28} color={color} />
    ),
    'Pedidos': (
      <MaterialIcons name='assignment-turned-in'  size={28} color={color} />
    ),
    'Chats': (
      <>
      <View style={{position:'absolute',right:10}} > 
        <Badge count={count} />
      </View>
      <MaterialIcons name='chat'  size={28} color={color} />
      </>
      
    ),
    'Reservaciones': (
      <MaterialIcons name='event'  size={28} color={color} />
    ),
    'Mis Tarjetas': (
      <MaterialIcons name='credit-card'  size={28} color={color} />
    ),
    'Garage': (
      <MaterialIcons name='directions-car'  size={28} color={color} />
    ),
    'Mi dirección': (
      <MaterialIcons name='location-on'  size={28} color={color} />
    ),
    'Notificaciones' : (
      <>
      <View style={{position:'absolute',right:10}} > 
        <Badge count={count} />
      </View>
       
        <MaterialIcons name='notifications'  size={28} color={color} />
      </>
    ),
    'Términos y condiciones': (
      <MaterialIcons name='info'  size={28} color={color} />
    ),
    'Perfil': (
      <MaterialIcons name='account-circle'  size={28} color={color} />
    ),

  };
  return ICONS[name];
};

const CustomDrawerComponent = React.memo((props) => {
  const [user,setUser] = useState(null);
  const {state, navigation} = props;
  const {routes, index} = state;
  const counter = props.countCustomer;
  const getNotificaciones = props.getNotificaciones;
  const {deleteNotificaciones} = props;
  const focusedRoute = routes[index].name;
  const {
    getActiveCar
} = useContext(ProductContext);
  const {newsChats} = useContext(ChatContext);

  

  const getUserData = async() => {
    const user = await getUser();

    setUser(user)
   
  }
  useEffect(() => {
    getUserData()
  },[user]);

  const goDrawer = (name) => {
    if (user) {
      navigation.navigate(name);
    } else {
      switch (name) {
      case 'Pedidos':
        return navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.INICIAR);
       
      case 'Reservaciones' :
        return navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.INICIAR);
      default:
        return navigation.navigate(name);
        
    }
    }
    
  }
  
  return (
    <DrawerContentScrollView >
      <HeaderBackground />
      <View style={[styles.header]}>
        {/* <View style={[CommonStyles.flexDirectionColumn]}> */}
          <View style={styles.topDataHeader}>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        {/* </View> */}
      </View>



      <View style={{paddingHorizontal:  0}}>
        {props.state.routeNames.map(name => {
          if (name === 'Perfil' && !user) {
            return 
          }
          let count = name === 'Chats' ? newsChats : counter
          return (
            <DrawerItem

              key={name}
              activeTintColor={Colors.white}
              activeBackgroundColor={Colors.primarySolid}
              icon={({focused, color, size}) =>
                getIcons({focused, color, size, name,count})
              }
              label={name}
              onPress={() => {
                goDrawer(name);
              }}
              focused={focusedRoute === name}
              labelStyle={{fontSize:adjust(10)}}
            />
          );
        })}
        {
          user ? (
            <>
        
          
              <DrawerItem
              onPress={async() => {
                deleteNotificaciones()
                
                await logout();
                await getActiveCar();
                props.navigation.replace(CUSTOMER_HOME_SCREEN_ROUTES.SHOW_AUTO_PARTS,{reload:true});
                showToaster('Cerraste sesión')
              }}
              label="Logout"
              activeTintColor={Colors.red}
              activeBackgroundColor={Colors.primaryColorShade}
              inactiveTintColor={Colors.red}
              icon={({focused, size, color}) => (
                <MaterialIcons size={size} color={color} name="logout" />
              )}
              />
            </>
        ):(
          <DrawerItem
          onPress={async() => {
           
            await logout();
            getNotificaciones()
            props.navigation.replace('AuthStack');
          }}
          label="Iniciar sesión"
          activeTintColor={Colors.terciarySolid}
          activeBackgroundColor={Colors.primaryColorShade}
          inactiveTintColor={Colors.terciarySolid}
          icon={({focused, size, color}) => (
            <MaterialIcons size={size} color={color} name="login" />
          )}
        />
        
        )
        }
      </View>
    </DrawerContentScrollView>
  );
})

const styles = StyleSheet.create({
  header: { 
    width: deviceWidth,
    height:Platform.OS == 'ios' ? deviceHeight * 0.13 : deviceHeight * 0.10,
   
    // paddingHorizontal: 10,
    justifyContent:'center',
    
    // backgroundColor:'red',
    marginHorizontal:10,
    alignItems:'flex-start'
    
 

    
  },
  name: {
    fontSize: adjust(13),
    fontWeight: 'bold',
    color: Colors.white,
  },
  email: {
    fontSize: adjust(11),
    color: Colors.lightGreen,
    fontStyle: 'italic',
  },

});

export default CustomDrawerComponent;


