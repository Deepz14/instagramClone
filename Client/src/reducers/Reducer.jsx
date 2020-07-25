export const Reducer = (state, action) => {
    switch(action.type){
        case "USER":
            return action.payload
        case "CLEAR":
            return null
        case "UPDATE":
            return {
                ...state,
                followers : action.payload.follower,
                following : action.payload.following
            }
        case "UPDATEPIC":
            return {
                ...state,
                pic : action.payload
            }            
    }
    return state
}