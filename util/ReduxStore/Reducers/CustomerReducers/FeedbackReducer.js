

const initialState = {
  feedback: [],
}
export default (state = initialState, action) => {
    switch (action.type) {
 

        case 'CHANGEFORM':
           
          return {
            feedback: action.data
          }

        case 'UPLOAD':
           
            return {
              feedback: state.feedback.concat(action.data),
            }
 
        case 'RESET':
           
          return {
            feedback: []
          }
 
           
        default:
            return state
    }
}