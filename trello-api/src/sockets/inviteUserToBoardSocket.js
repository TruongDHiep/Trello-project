//param socket se duoc lay tu thu vien socketio
export const inviteUserToBoardSocket = (socket) => {
  // lang nghe su kien client gui len
  socket.on('FE_USER_INVITED_TO_BOARD', (invitation) => {
    socket.broadcast.emit('BE_USER_INVITED_TO_BOARD', invitation)
  })
}