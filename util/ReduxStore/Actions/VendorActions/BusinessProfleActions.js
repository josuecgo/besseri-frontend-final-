export const SET_BUSINESS_ACTION_MESSAGE = 'SET_BUSINESS_ACTION_MESSAGE';
export const SET_BUSINESS_EARNINGS = 'SET_BUSINESS_EARNINGS';
export const SET_WALLET_DETAILS = 'SET_WALLET_DETAILS';
export const setActionMessage = (message) => {
    return({
        type:SET_BUSINESS_ACTION_MESSAGE,
        data:message
    })
}
export const setEarnings = (earnings) => {
    return({
        type:SET_BUSINESS_EARNINGS,
        data:earnings
    })
}
export const setWalletDetails = (wallet) => {
    return({
        type:SET_WALLET_DETAILS,
        data:wallet
    })
}