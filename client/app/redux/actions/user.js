export function setToken (token) {
    return (dispatch)=>{
        dispatch({type:'TOKEN',payload:token})
    }
}