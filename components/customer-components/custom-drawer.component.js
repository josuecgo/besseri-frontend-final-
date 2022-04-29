import React, { useEffect, useState } from 'react';
import {StyleSheet, Text, View} from 'react-native';

import Colors from '../../util/styles/colors';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {CUSTOMER_HOME_SCREEN_ROUTES , showToaster} from '../../util/constants';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getUser, logout } from '../../util/local-storage/auth_service';

import { HeaderBackground } from '../Background/HeaderBackground';
import { adjust, deviceHeight, deviceWidth } from '../../util/Dimentions';

const getIcons = ({focused, color, size, name}) => {
  const ICONS = {
    'Servicios': (
      <MaterialIcons name='build'  size={28} color={color} />
      // <MaterialIcons name='home-repair-service'  size={28} color={color} />
    
      // <MaterialCommunityIcons name='car-cruise-control' size={28} color={color}  />
   
      // <MaterialCommunityIcons name='car-brake-alert' size={28} color={color}  />
    ),
    'Autopartes': (
      // <ImgIcon url={require('../../assets/images/iconos/autopartes.png')} />
      <MaterialIcons name='drive-eta'  size={28} color={color} />
    ),
    'Pedidos': (
      <MaterialIcons name='assignment-turned-in'  size={28} color={color} />
    ),
    'Reservaciones': (
      <MaterialIcons name='event'  size={28} color={color} />
    ),
    'Mi dirección': (
      <MaterialIcons name='location-on'  size={28} color={color} />
    )
  };
  return ICONS[name];
};

const CustomDrawerComponent = (props) => {
  const [user,setUser] = useState(null);
  const {state, navigation} = props;
  const {routes, index} = state;
  // const [user,setUser] = useState(null);
  const focusedRoute = routes[index].name;

  
  const getUserData = async() => {
    const user = await getUser();

    setUser(user)
    // setUser(user);
  }
  useEffect(() => {
    getUserData()
  },[user]);
  // const getUserDetails = async() => {
  //   const userData = await getUser();
  //   setUser(userData);
  // }
  // useEffect(() => {
  //   getUserDetails();
  // },[]);

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
    <DrawerContentScrollView>
      <HeaderBackground/>
      <View style={[styles.header]}>
        {/* <View style={[CommonStyles.flexDirectionColumn]}> */}
          <View style={styles.topDataHeader}>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        {/* </View> */}
      </View>



      <View style={{paddingHorizontal: 10}}>
        {props.state.routeNames.map(name => {
          return (
            <DrawerItem
              key={name}
              activeTintColor={Colors.white}
              activeBackgroundColor={Colors.primarySolid}
              icon={({focused, color, size}) =>
                getIcons({focused, color, size, name})
              }
              label={name}
              onPress={() => {
                goDrawer(name);
              }}
              focused={focusedRoute === name}
            />
          );
        })}
        {
          user ? (
            <DrawerItem
          onPress={async() => {
            
            await logout();
            props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.SHOW_AUTO_PARTS,{reload:true});
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
        ):(
          <DrawerItem
          onPress={async() => {
            
            await logout();
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
};

const styles = StyleSheet.create({
  header: { 
    width: deviceWidth,
    height:Platform.OS == 'ios' ? deviceHeight * 0.10 : deviceHeight * 0.10,
   
     paddingHorizontal: 10,
    // borderWidth: 1,
    // borderColor: Colors.primaryColor,
     //backgroundColor: Colors.primaryColor,
    // ...CommonStyles.horizontalCenter,
 

    
  },
  name: {
    fontSize: adjust(13),
    fontWeight: 'bold',
    color: Colors.white,
  },
  email: {
    fontSize: adjust(12),
    color: Colors.lightGreen,
    fontStyle: 'italic',
  },

});

export default CustomDrawerComponent;
