const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const pool = require("./db");
const app = express();

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const bodyParser = require('body-parser');

const usersVideo = {};

const socketToRoom = {};

app.use(cors());
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
}
});

io.on('connection', (socket) => {
  console.log("We have a new connection");

  socket.on("join", async ({user_id, room}, callback) =>{

    const profile =  await pool.query("SELECT * FROM profiles WHERE user_id = $1", [user_id]);

    const {error, user} = addUser({id: socket.id, user_id, room, profile:profile.rows[0]});

    if(error) return callback(error);

    socket.emit('message', {user: 'admin', text: `${user.user_id}, welcome to the room!`});
    socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.user_id}, has joined!`});

    socket.join(user.room);

    io.to(user.room).emit('roomData', { users: getUsersInRoom(user.room)});

    callback();

  })

  // example usersVideo =  array(
  //   'RoomTest' => [
  //     qwe123123edasdasd,
  //     asdasewqe213123ra,
  //     bvwereq3413221eda,
  //   ],
  //   'BestRoom' => [
  //     pytrkmer452341eda,
  //     vbkdmbn3nejqne341
  //    ]
  // )
  socket.on("join-video", async ({room:roomID, user_id}) => {

    const profile = await pool.query("SELECT * FROM profiles WHERE user_id = $1", [user_id]);

    if (usersVideo[roomID]) {
        usersVideo[roomID].push({socket:socket.id, user_id: user_id, profile:profile.rows[0]});
    } else {
        usersVideo[roomID] = [{socket:socket.id, user_id: user_id, profile:profile.rows[0]}];
    }
    socketToRoom[socket.id] = roomID;
    //  Gets all users in the specific room except current user
    const videoUsersInRoom = usersVideo[roomID].filter(elem => elem.socket !== socket.id);

    socket.emit("all users", videoUsersInRoom);
  });

  socket.on("sending signal", async payload => {
    const profile = await pool.query("SELECT * FROM profiles WHERE user_id = $1", [payload.user_id]);

    io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID, user:payload.user_id, profile:profile.rows[0] });
  });

  socket.on("returning signal", payload => {
      io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
  });

  //Send chat message
  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit('message', { user: user.user_id, text: message, profile: user.profile });

    callback();
  });

  socket.on('disconnect user', () => {
    const user = removeUser(socket.id);

    //video
    const roomID = socketToRoom[socket.id];
    let room = usersVideo[roomID];
    if (room) {
        room = room.filter(id => id.socket !== socket.id);
        usersVideo[roomID] = room;
    }

    socket.broadcast.emit('user left', socket.id);

    var usersInRoom = [];
    if(user) {
      usersInRoom = getUsersInRoom(user.room);

      io.to(user.room).emit('message', { user: 'admin', text: `${user.user_id} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: usersInRoom});
    }

    if(usersInRoom.length === 0){
       pool.query("DELETE FROM livestreams WHERE title = $1", [roomID]);
    }


  })
});

app.get("/", (req,res) => res.send('API RUNNING'));

//Init middleware

//Get data from req.body
app.use(express.json({extended: false}));

app.get('/', (req, res) => res.send('API RUNNING'));

// Define Routes
app.use("/api/users", require('./routes/api/users'));
app.use("/api/auth", require('./routes/api/auth'));
app.use("/api/profile", require('./routes/api/profile'));
app.use("/api/studio", require('./routes/api/studio'));
app.use("/api/catalog", require('./routes/api/catalog'));
app.use("/api/interact", require('./routes/api/interact'));


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`The server is up on a ${PORT}`));
