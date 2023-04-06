import { ToastAndroid,Platform,Alert } from "react-native";

export const SCREEN_HORIZONTAL_MARGIN = 30;
export const SCREEN_HORIZONTAL_MARGIN_FORM = 10;
export const INCREMENT_CONSTANT = 20;

export const LOGIN_SIGNUP_FORGOT_ROUTES = {
  HOMEPAGE: 'HomePageScreen',
  LOGIN: 'LOGIN',
  SIGN_UP: 'SIGN_UP',
  SIGN_UP_CUSTOMER: 'SIGN_UP_CUSTOMER',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  VENDOR_SIGN_UP: 'Business',
  SERVICE_PROVIDER_SIGN_UP: 'Service Provider',
  CUSTOMER_SIGN_UP: 'Customer',
  OTP_PASSWORD: 'OTP_PASSWORD',
  RIDER_SIGN_UP:'Rider Signup',
  CHANGE_PASSWORD:'Change Password',
  PRIVACY_POLICY:'Privacy policy'
};

export const MAIN_ROUTES = {
  AUTH_STACK:'AuthStack',
  VENDOR_STACK:'VendorStack',
  CUSTOMER_STACK:'CustomerStack',
  RIDER_STACK:'RiderStack',
  CHATSCREEN : 'Chats'
}

export const ROLES = {
  BUSINESS: 'Business',
  CUSTOMER: 'Customer',
  RIDER: 'Rider',
  UNSET: 'Unset',
};

export const BOTTOM_TAB_VENDOR_ROUTES = {
  PRODUCTS: 'Products',
  ORDERS2: 'Orders2',
  DASHBOARD: 'Dashboard',
  NOTIFICATION: 'Notification',
  PROFILE: 'Profile',
  SERVICES:'Services',
  SERVICES2:'Services2',
  CUPON:'Cupon',
  VER_MAS:'Ver Mas',
};

export const VENDOR_DETAILS_ROUTES = {
  PRODUCT_LISTING: 'Product Listing',
  PRODUCT_DETAILS: 'Product Details',
  ORDER_LISTING: 'Order Listing',
  ORDER_DETAILS: 'Order Details',
  VENDOR_PROFILE:'Vendor Profile',
  VENDOR_PROFILE_DETAIL:'Vendor Profile Detail',
  VENDOR_SETTINGS:'Vendor Setting',
  VENDOR_EDIT_PROFILE:'Vendor Edit Profile',
  CREATE_PRODUCT:'Create Product',
  CREATE_SERVICE:'Create Service',
  BUSINESS_LOCATION:'Business Location',
  DESCRIPTION:'Description',
  SUBCATEGORIA:'Subcategoria',
  ALL_PRODUCT:'All Product',
  
};

export const CUPON_ROUTES = {
  HOME_CUPON:'Home Cupon',
  EDIT_CREATE: 'Craer/Editar Cupon'
};

export const SHARED_ROUTES = {
  SERVICE_DETAIL:'Service Detail'
}

export const ORDER_STATUSES = {
  PENDING:'PENDING',
  PROCESSING: 'PROCESSING',
  PACKED: 'PACKED',
  DELIVERY: 'OUT_FOR_DELIVERY',
  CANCELLED: 'CANCELLED',
  COMPLETED:'PARCEL_DELIVERED',
  ON_GOING:'ON_GOING',
  PARCEL_DELIVERED:'PARCEL DELIVERED'
};
export const STATUS_LABELS = {
  PROCESSING:'Processing',
  PACKED:'Packed',
  CANCELLED:'Cancelled',
  PARCEL_DELIVERED:'Parcel Delivered'
}
export const USER_ORDER_STATUSES = {
  PROCESSING: 'PROCESSING',
  PACKEd: 'PACKED',
  ORDER_OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  CANCELLED: 'CANCELLED',
  PARCEL_DELIVERED:'PARCEL_DELIVERED',
  
};
export const STATUSES_COLORS = {
  [ORDER_STATUSES.PENDING]: '#0bda51',
  [ORDER_STATUSES.PROCESSING]: '#007bff',
  [ORDER_STATUSES.PACKED]: '#6c757d',
  [ORDER_STATUSES.CANCELLED]: '#dc3545',
  [ORDER_STATUSES.COMPLETED]: 'green',
  [ORDER_STATUSES.ON_GOING]:'orange',
  [ORDER_STATUSES.PARCEL_DELIVERED]:'green'
};
export const PRODUCT_STATUS = {
  IN_STOCK: ' In Stock',
  OUT_OF_STOCK: 'Out Of Stock',
};

export const CUSTOMER_HOME_SCREEN_ROUTES = {
  HOME: 'Home',
  SHOW_AUTO_PARTS: 'Auto Parts',
  SERVICIO: 'SERVICIO',
  SERVICE: 'Services',
  APPOINTMENTS: 'Appointments',
  ORDERS: 'Orders',
  ORDERS_ALL: 'Orders All',
  ORDERS_PENDING: 'Orders Pending',
  ORDERS_SENDING: 'Orders Sending',
  ORDERS_FEEDBACK: 'Orders Feedback',
  ORDERS_DELIVERED: 'Orders Delivered',
  
  DRAWER: 'Drawer',
  CART:'Cart',
  ORDER_SUMMARY:'Order Summary',
  ORDER_SUMMARY_FREE:'Order Summary Free',
  MAP_STORES:'Map Stores',
  ADDRESSES_SCREEN:'Addresses',
  ORDER_DETAIL:'Order Detail',
  MORE_PRODUCTS:'More Products',
  STORE_SCREEN:'Store Screen',
  BOOK_SERVICE:'Book Service',
  BOOKING_DETAIL:'Booking detail',
  SEARCH:'Search',
  PRODUCT_DETAIL:'Product detail',
  PRODUCT_REVIEWS: 'PRODUCT Reviews',
  ORDER_STACK:'ORDER_STACK',
  INICIAR:'AuthStack',
  ENVIO: 'Envio',
  METODO: 'Metodo de pago',
  CARDS: 'Tarjetas',
  CREATE_CARD: 'Guardar Tarjeta',
  CHAT_SCREEN: 'Chat Screen',
  PERFIL: 'Perfil'
};

export const BOTTOM_TAB_RIDER_ROUTES = {
  DUMMY_SCREEN: 'Dummy Screen',
  RIDER_EXPLORE:'Rider Explore',
  RIDER_ORDERS:'Rider Orders',
  RIDER_ORDERS2:'Rider Orders2', 
  RIDER_PROFILE:'Rider Profile', 
  RIDER_NOTIFICATION:'Rider Notification',   
};
export const RIDER_STACK_ROUTES = {
  RIDER_ORDER_DETAIL:'Rider Order Detail',
  DESCRIPTION:'Description',
}


export const ASYNC_STORAGE_NAMES = {
  USER_ID:'UserId',
  USER:'User',
  BUSINESS_PROFILE:'BusinessProfile',
  USER_TYPE:'UserType',
  BUSINESS_STATUS:'BusinessStatus',
  RIDER_PROFILE:'Rider Profile',
  CUSTOMER_ADDRESS:'addressCustomer',
  NOTIFICATION_STORAGE:'notificationStorage',
  CAR_STORAGE:'carStorage'
}
export const USER_ROLES = {
  customer:'customer',
  vendor:'vendor',
  rider:'rider'
}

export const OrderStatusCode = {
  OUT_FOR_DELIVERY:'Fuera para entrega',
  PARCEL_PICKED:'Pedido recogido',
  PARCEL_DELIVERED:'Paquete entregado',
  RIDER_ASSIGNED:'Repartidor asignado',
  PROCESSING:'Procesando',
  PACKED:'Paquete listo'
}

export const KeysStripe = {
  LIVE_KEY:'pk_live_51K6fAwEZl12SIefHa7w6LJCVzATHV5n253Xlw2TcAxFrOkwEElIHpoWM9gilgxRey62ACrQMLir0SY6C7Uwdgx1M00ukntyd5k',
  TEST_KEY:'pk_test_51K6fAwEZl12SIefHDB3dMygU6FJQ79Q81wCsNeaIbYlP3jqmOAUi7b9XdRkfOqrAK7Na8EgjEp6gJuacFtP4oMRa00lcje6la4',
 
}

export const showToaster = (message) => {
  if (Platform.OS === 'ios') {
    Alert.alert(message)
  }else{
    ToastAndroid.showWithGravity(message,ToastAndroid.SHORT,ToastAndroid.CENTER)

  }
}

export const showAlertMsg = (message) => {
 
  Alert.alert('Alert Title', 'My Alert Msg', [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    {text: 'OK', onPress: () => console.log('OK Pressed')},
  ]);
 
}