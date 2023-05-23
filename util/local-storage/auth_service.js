import AsyncStorage from "@react-native-async-storage/async-storage";
import { ASYNC_STORAGE_NAMES, USER_ROLES } from "../constants";

export const saveUserId = async(userId) => {
  await AsyncStorage.setItem(ASYNC_STORAGE_NAMES.USER_ID,userId);
}
export const saveUserData = async(user) => {
    await AsyncStorage.setItem(ASYNC_STORAGE_NAMES.USER,JSON.stringify(user));
    await saveUserId(user?._id);
    await saveUserType(user);
    
};

export const saveNotification = async(notifications) => {
    await AsyncStorage.setItem(ASYNC_STORAGE_NAMES.NOTIFICATION_STORAGE,JSON.stringify(notifications)); 
};
export const getNotification = async() => {
    const notification = await AsyncStorage.getItem(ASYNC_STORAGE_NAMES.NOTIFICATION_STORAGE);
    return JSON.parse(notification);
} 
export const saveCarActive = async(car) => {
    await AsyncStorage.setItem(ASYNC_STORAGE_NAMES.CAR_STORAGE,JSON.stringify(car)); 
};
export const getCarActive = async() => {
    const car = await AsyncStorage.getItem(ASYNC_STORAGE_NAMES.CAR_STORAGE);
    return JSON.parse(car);
} 

export const deleteNotification = async() => {
    await AsyncStorage.removeItem(ASYNC_STORAGE_NAMES.NOTIFICATION_STORAGE);
}
export const getUserId = async() => {
    const userId = await AsyncStorage.getItem(ASYNC_STORAGE_NAMES.USER_ID);
    return userId;
};
export const saveAdressCustomer = async(userAddress) => {
    const addressString = JSON.stringify(userAddress);
    await AsyncStorage.setItem(ASYNC_STORAGE_NAMES.CUSTOMER_ADDRESS,addressString);
 }
export const getUserAddress = async() => {
    const userAddress = await AsyncStorage.getItem(ASYNC_STORAGE_NAMES.CUSTOMER_ADDRESS);
    return JSON.parse(userAddress);
};
export const saveGarage = async(garage) => {
    const addressString = JSON.stringify(garage);
    await AsyncStorage.setItem(ASYNC_STORAGE_NAMES.GARAGE,addressString);
 }
export const getGarage = async() => {
    const userAddress = await AsyncStorage.getItem(ASYNC_STORAGE_NAMES.GARAGE);
    return JSON.parse(userAddress);
};



export const getUser = async() => {
    const user = await AsyncStorage.getItem(ASYNC_STORAGE_NAMES.USER);
    return JSON.parse(user);
} 
export const saveUserType = async(user) => {
    const userType = user?.isVendor ? USER_ROLES.vendor : user?.isCommonUser ? USER_ROLES.customer : USER_ROLES.rider;
    await AsyncStorage.setItem(ASYNC_STORAGE_NAMES.USER_TYPE,userType);
}
 
 export const getUserType = async() => {
     const userType = await AsyncStorage.getItem(ASYNC_STORAGE_NAMES.USER_TYPE);
     return userType;
 }
 export const logout = async() => {
 
     await AsyncStorage.removeItem(ASYNC_STORAGE_NAMES.USER_ID);
     await AsyncStorage.removeItem(ASYNC_STORAGE_NAMES.USER);
     await AsyncStorage.removeItem(ASYNC_STORAGE_NAMES.USER_TYPE);
     await AsyncStorage.removeItem(ASYNC_STORAGE_NAMES.BUSINESS_PROFILE);
     await AsyncStorage.removeItem(ASYNC_STORAGE_NAMES.CAR_STORAGE);
     await AsyncStorage.removeItem(ASYNC_STORAGE_NAMES.CUSTOMER_ADDRESS);
     return true;
 }







export const saveBusinessProfile = async(data) => {
    await AsyncStorage.setItem(ASYNC_STORAGE_NAMES.BUSINESS_PROFILE,JSON.stringify(data));
}
export const getBusinessProfile = async() => {
    const businessProfile = await AsyncStorage.getItem(ASYNC_STORAGE_NAMES.BUSINESS_PROFILE);
    return JSON.parse(businessProfile);
}
export const getBusinessId = async() => {
    const businessData = await getBusinessProfile();
    return businessData._id;
}

export const saveRiderProfile = async(data) => {
    await AsyncStorage.setItem(ASYNC_STORAGE_NAMES.RIDER_PROFILE,JSON.stringify(data));
}
export const getRiderProfile = async() => {
    const riderProfile = await AsyncStorage.getItem(ASYNC_STORAGE_NAMES.RIDER_PROFILE);
    const parsedProfile = JSON.parse(riderProfile)
    return parsedProfile[0]
}
export const getRiderId = async() => {
    const riderId = await getRiderProfile();
    return riderId._id;
}
export const saveBusinessStatus = async(isBlocked) => {
    await AsyncStorage.setItem(ASYNC_STORAGE_NAMES.BUSINESS_STATUS,JSON.stringify(isBlocked));
}
export const getBusinessStatus = async() => {
    const status = await AsyncStorage.getItem(ASYNC_STORAGE_NAMES.BUSINESS_STATUS);
    return JSON.parse(status);
}
