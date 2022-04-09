import { ToastAndroid } from "react-native";

export const SCREEN_HORIZONTAL_MARGIN = 30;
export const INCREMENT_CONSTANT = 20;

export const LOGIN_SIGNUP_FORGOT_ROUTES = {
  LOGIN: 'LOGIN',
  SIGN_UP: 'SIGN_UP',
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
  RIDER_STACK:'RiderStack'
}

export const ROLES = {
  BUSINESS: 'Business',
  CUSTOMER: 'Customer',
  RIDER: 'Rider',
  UNSET: 'Unset',
};

export const BOTTOM_TAB_VENDOR_ROUTES = {
  PRODUCTS: 'Products',
  ORDERS: 'Orders',
  DASHBOARD: 'Dashboard',
  NOTIFICATION: 'Notification',
  PROFILE: 'Profile',
  SERVICES:'Services'
};

export const VENDOR_DETAILS_ROUTES = {
  PRODUCT_LISTING: 'Product Listing',
  PRODUCT_DETAILS: 'Product Details',
  ORDER_LISTING: 'Order Listing',
  ORDER_DETAILS: 'Order Details',
  VENDOR_PROFILE:'Vendor Profile',
  VENDOR_PROFILE_DETAIL:'Vendor Profile Detail',
  VENDOR_SETTINGS:'Vendor Setting',
  CREATE_PRODUCT:'Create Product',
  CREATE_SERVICE:'Create Service',
  BUSINESS_LOCATION:'Business Location'
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
  PARCEL_DELIVERED:'PARCEL_DELIVERED'
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
  SERVICE: 'Services',
  APPOINTMENTS: 'Appointments',
  ORDERS: 'Orders',
  DRAWER: 'Drawer',
  CART:'Cart',
  ORDER_SUMMARY:'Order Summary',
  MAP_STORES:'Map Stores',
  ADDRESSES_SCREEN:'Addresses',
  ORDER_DETAIL:'Order Detail',
  MORE_PRODUCTS:'More Products',
  STORE_SCREEN:'Store Screen',
  BOOK_SERVICE:'Book Service',
  BOOKING_DETAIL:'Booking detail',
  SEARCH:'Search',
  PRODUCT_DETAIL:'Product detail',
  ORDER_STACK:'ORDER_STACK'
};

export const BOTTOM_TAB_RIDER_ROUTES = {
  DUMMY_SCREEN: 'Dummy Screen',
  RIDER_EXPLORE:'Rider Explore',
  RIDER_ORDERS:'Rider Orders',
  RIDER_PROFILE:'Rider Profile',  
};
export const RIDER_STACK_ROUTES = {
  RIDER_ORDER_DETAIL:'Rider Order Detail'
}


export const ASYNC_STORAGE_NAMES = {
  USER_ID:'UserId',
  USER:'User',
  BUSINESS_PROFILE:'BusinessProfile',
  USER_TYPE:'UserType',
  BUSINESS_STATUS:'BusinessStatus',
  RIDER_PROFILE:'Rider Profile'
}
export const USER_ROLES = {
  customer:'customer',
  vendor:'vendor',
  rider:'rider'
}

export const showToaster = (message) => {
  ToastAndroid.showWithGravity(message,ToastAndroid.LONG,ToastAndroid.CENTER)
}