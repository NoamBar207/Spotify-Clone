import io from 'socket.io-client'

export const SOCKET_EMIT_STATION_UPDATE='station-updated'
// export const SOCKET_ON_CHANGE_STATION='update-station'
export const SOCKET_EMIT_ACTIVITY_ADDED='activity-added'
export const SOCKET_EMIT_UPDATED_STATION='updated-station'
export const SOCKET_EMIT_UPDATE_STATION='update-station'


export const SOCKET_EMIT_UPDATE_USER = 'user-updated'
export const SOCKET_ON_UPDATE_USER = 'update-user'

const baseUrl = (process.env.NODE_ENV === 'production') ? '' : '//localhost:3030'
export const socketService = createSocketService()

socketService.setup()

function createSocketService() {
  var socket = null;
  const socketService = {
    setup() {
      socket = io(baseUrl)
    },
    on(eventName, cb) {
      socket.on(eventName, cb)
    },
    off(eventName, cb = null) {
      if (!socket) return;
      if (!cb) socket.removeAllListeners(eventName)
      else socket.off(eventName, cb)
    },
    emit(eventName, data) {
      socket.emit(eventName, data)
    },
    terminate() {
      socket = null
    },

  }
  return socketService
}


// Basic Tests
// function cb(x) {console.log('Socket Test - Expected Puk, Actual:', x)}
// socketService.on('baba', cb)
// socketService.on('baba', cb)
// socketService.on('baba', cb)
// socketService.on('mama', cb)
// socketService.emit('baba', 'Puk')
// socketService.off('baba', cb)
