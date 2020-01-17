let initialState = {
    token: ''
};

export default (state=initialState,action)=>{
    switch(action.type){
        case 'TOKEN':
        {
            return {
                ...state,
                token: action.payload
            }
        }
        default:
        return state
    }
}