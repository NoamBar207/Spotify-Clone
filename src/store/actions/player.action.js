


export function setPlayer(player) {
    return async (dispatch) => {
        try {
            dispatch({ type: 'SET_PLAYER', player })
        } catch (err) {
            console.log('cant set player', err);
        }
    }
}