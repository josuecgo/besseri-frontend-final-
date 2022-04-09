import React, { useEffect, useState } from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {CUSTOMER_HOME_SCREEN_ROUTES} from '../../util/constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getUser, logout } from '../../util/local-storage/auth_service';
import Ionicons from 'react-native-vector-icons/Ionicons'
import LoaderComponent from '../Loader/Loader.component';
import { useSelector } from 'react-redux';
const getIcons = ({focused, color, size, name}) => {
  const ICONS = {
    [CUSTOMER_HOME_SCREEN_ROUTES.SERVICE]: (
      <FontAwesome size={size} color={color} name="gears" />
    ),
    [CUSTOMER_HOME_SCREEN_ROUTES.SHOW_AUTO_PARTS]: (
      <FontAwesome size={size} color={color} name="car" />
    ),
    [CUSTOMER_HOME_SCREEN_ROUTES.ORDERS]: (
      <FontAwesome size={size} color={color} name="th-list" />
    ),
    [CUSTOMER_HOME_SCREEN_ROUTES.APPOINTMENTS]: (
      <SimpleLineIcons size={size} color={color} name="notebook" />
    ),
    [CUSTOMER_HOME_SCREEN_ROUTES.ADDRESSES_SCREEN]: (
      <Ionicons name='location-sharp' color={color} size={size}/>
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
    console.log(user)
    setUser(user)
    // setUser(user);
  }
  useEffect(() => {
    getUserData()
  },[]);
  // const getUserDetails = async() => {
  //   const userData = await getUser();
  //   setUser(userData);
  // }
  // useEffect(() => {
  //   getUserDetails();
  // },[]);

  return (
    <DrawerContentScrollView>
     
      <View style={[CommonStyles.flexDirectionColumn, {padding: 20}]}>
        <View style={styles.topDataHeader}>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
      </View>
      <View style={{paddingHorizontal: 10}}>
        {props.state.routeNames.map(name => {
          return (
            <DrawerItem
              key={name}
              activeTintColor={Colors.primaryColor}
              activeBackgroundColor={Colors.primaryColorShade}
              icon={({focused, color, size}) =>
                getIcons({focused, color, size, name})
              }
              label={name}
              onPress={() => {
                navigation.navigate(name);
              }}
              focused={focusedRoute === name}
            />
          );
        })}
        <DrawerItem
          onPress={async() => {
            
            await logout();
            props.navigation.replace('AuthStack');
          }}
          label="Logout"
          activeTintColor={Colors.primaryColor}
          activeBackgroundColor={Colors.primaryColorShade}
          icon={({focused, size, color}) => (
            <MaterialIcons size={size} color={color} name="logout" />
          )}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  topDataHeader: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.gray,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryColor,
  },
  email: {
    fontSize: 15,
    color: Colors.dark,
    fontStyle: 'italic',
  },
});

export default CustomDrawerComponent;
