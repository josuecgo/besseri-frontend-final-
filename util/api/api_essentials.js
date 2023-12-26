export const env = 'prod';

export const base_url = env === 'prod' ? 'https://api.besseri.mx' : env === 'dev' ?  'http://192.168.1.18:3005' : 'http://192.168.100.4:3005';
// export const base_url = false ? 'http://192.168.100.72:3005' : 'http://192.168.1.17:3005'

export const api_urls = {
    registration:`${base_url}/user/signup`,
    login:`${base_url}/user/login`,
    delete_user:`${base_url}/user/delete-account`,
    generate_otp:`${base_url}/user/generate-otp`,
    get_order_details:`${base_url}/orders/get-order-details`,
    forget_password:`${base_url}/forgot-password/generatecode`,
    reset_password:`${base_url}/forgot-password/resetpassword`,
    save_fcm_token:`${base_url}/fcm/save-fcm-token`,
    delete_fcm_token:`${base_url}/fcm/delete-fcm-token`,
    getNotification:`${base_url}/user/getNotification`,
    viewNotification:`${base_url}/user/viewNotification`,
    createAccountOpenpay:`${base_url}/openpay/create-openpay`,
    getMessage: `${base_url}/chat/get-msg`,
    create_message:`${base_url}/chat/create-msg`,
    get_chats:`${base_url}/chat/get-chats`,
    update_isView_room:`${base_url}/chat/is-view-room`,
    check_version:`${base_url}/user/check-version`,
}
export const paymentApis = {
    refundPayment:`${base_url}/payments/refund-amount`,
    getCardsOpenpay:`${base_url}/openpay/get-cards-openpay`,
    saveCardsOpenpay:`${base_url}/openpay/create-card-openpay`,

}
export const vendor_api_urls = {
    business_profile:`${base_url}/business/get-mystore`,
    edit_business_profile:`${base_url}/business/edit-mystore`,
    business_profile_detail:`${base_url}/business/get-business-details`,
    get_products:`${base_url}/products/get-my-products`,
    create_product:`${base_url}/products/create-product`,
    get_models:`${base_url}/modals/get-models`,
    get_aplication:`${base_url}/match/get-aplication`,
    get_makers:`${base_url}/maker/get-makers`,
    get_makers_vendor:`${base_url}/maker/get-makers-vendor`,
    upload_product_image:`${base_url}/products/upload-product-images`,
    upload_service_image:`${base_url}/services/upload-service-image`,
    out_of_stock:`${base_url}/products/out-of-stock`,
    delete_product:`${base_url}/products/delete-product`,
    inStock:`${base_url}/products/in-stock`,
    get_orders:`${base_url}/business/business-orders`,
    update_order:`${base_url}/business/update-order-status`,
    update_order_pickup:`${base_url}/business//update-order-status-pickup`,
    get_earnings:`${base_url}/business/get-earnings`,
    get_categories:`${base_url}/categories/get-categories`,
    get_services:`${base_url}/services/get-my-services`,
    change_service_availability:`${base_url}/services/change-service-availiability`,
   
    create_service:`${base_url}/services/create-service`,
    delete_service:`${base_url}/services/delete-service`,
    get_store_bookings:`${base_url}/appointment/get-store-bookings`,
    change_booking_status:`${base_url}/appointment/change-booking-status`,
    setup_address:`${base_url}/business/set-mystore-location`,
    upload_business_logo:`${base_url}/business/upload-logo`,
    create_stripe_account:`${base_url}/payments/create-account`,
    get_stripe_account_details:`${base_url}/payments/get-account`,
    get_ride_requests:`${base_url}/orders/get-order-ride-requests`,
    accept_ride:`${base_url}/rider/accept-ride-request`,
    edit_product:`${base_url}/products/edit-product`,
    get_sub_categories:`${base_url}/categories/get-subcategories`,
    get_products_sub_categories:`${base_url}/products/get-subcategory-products`,
    get_multiple_stores:`${base_url}/business/get-multiple-stores`,
    create_brand:`${base_url}/brands/create-brand`,
    get_brands:`${base_url}/brands/get-brands`,
    get_cupones:`${base_url}/cupon/get-cupon`,
    delete_cupones:`${base_url}/cupon/delete-cupon`,
    create_cupones:`${base_url}/cupon/create-cupon`,
    search_cupones:`${base_url}/cupon/search-cupon`
}
export const customer_api_urls = {
    get_products:`${base_url}/products/get-products`,
    inStock_product:`${base_url}/products/inStock-product`,
    get_business_details:`${base_url}/business/get-business-details`,

    create_address:`${base_url}/addresses/create-address`,
    get_addresses:`${base_url}/addresses/get-my-address`,
    search_addresses:`${base_url}/addresses/search-address`,
    geocode_addresses:`${base_url}/addresses/geocode-address`,
    delete_address:`${base_url}/addresses/delete-my-address`,

    place_order:`${base_url}/orders/place-order`,
    get_my_orders:`${base_url}/orders/get-my-orders`,
    get_my_orders_pending:`${base_url}/orders/get-my-orders-pending`,
    
    get_category_products:`${base_url}/products/get-category-products`,

    get_stores:`${base_url}/business/get-stores`,
    get_store_data:`${base_url}/business/get-store`,
    get_stores_type_services:`${base_url}/business/get-stores`,

    get_carwash:`${base_url}/carwash/get-services`,

    get_services:`${base_url}/services/get-services`,
    get_type_services_customer:`${base_url}/services/get-type-services-customer`,
    get_categories_services:`${base_url}/services/get-categories-services`,
    get_availability_services:`${base_url}/services/availability-services`,
   
    update_additional_service:`${base_url}/appointment/update-service-additional`,
    
    book_service:`${base_url}/appointment/book-service`,
    get_my_bookings:`${base_url}/appointment/get-my-bookings`,
    cancel_booking:`${base_url}/appointment/cancel-appointment`,
    search_api:`${base_url}/products/search-api`,
    create_payment_sheet:`${base_url}/payments/payment-sheet`,
    
    get_fees:`${base_url}/admin/get-fee`,
    cancel_order:`${base_url}/orders/cancel-user-order`,
    create_payment_sheet_services:`${base_url}/payments/payment-sheet-services`,
    service_search:`${base_url}/services/search-api`,
    
    create_car:`${base_url}/info-user/create-garage`,
    get_garage:`${base_url}/info-user/get-garage`,
    get_type_car:`${base_url}/info-user/get-types-cars`,
    delete_garage:`${base_url}/info-user/delete-garage`,
    active_car:`${base_url}/info-user/active-car`,
    get_active_car:`${base_url}/info-user/get-active-car`,
    get_info_user:`${base_url}/info-user/user`,
    get_pedidos_user:`${base_url}/info-user/pedidos`,
    create_feedback: `${base_url}/feedback/create-feedback`,
    get_feedback: `${base_url}/feedback/get-feedback`,
    upload_imgs_feedback: `${base_url}/feedback/upload-feedback-images`,
}
export const rider_api_urls = {
    get_details:`${base_url}/rider/get-riderinfo`,
    get_nearby_orders:`${base_url}/rider/get-nearbyorders`,
    request_ride:`${base_url}/rider/create-ride-request`,
    get_myorders:`${base_url}/rider/get-my-orders`,
    change_order_status:`${base_url}/rider/change-order-status`,
    get_earnings:`${base_url}/rider/get-rider-earnings`,
    create_stripe_account:`${base_url}/payments/create-rider-account`,
    update_coords:`${base_url}/rider/update-coords`,
    

}
export const api_statuses = {
    success:200
}


