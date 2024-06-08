const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require('crypto');

const User = require('./models/user.js');
const Message = require('./models/message.js');

dotenv.config();
const app = express();
port = process.env.PORT;

app.use(cors());

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.log('Error connecting to MongoDB');
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.send(
    '<html><head><title>Signal App API</title></head><body><p style="text-align: center;">Hello World</p></body></html>',
  );
});

app.post('/register', async (req, res) => {
  const {name, email, image, password} = req.body;
  const user = new User({name, email, image, password});
  await user
    .save()
    .then(() => {
      res
        .status(200)
        .json({success: true, message: 'User registered successfully'});
    })
    .catch(err => {
      res.status(500).json({success: false, message: 'Error registering user'});
    });
});

app.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
    }

    const secretKey = crypto.randomBytes(32).toString('hex');

    const token = jwt.sign({userId: user._id}, secretKey);

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      token,
    });
  } catch (err) {
    console.log('Error login user', err);
    res.status(500).json({
      success: false,
      message: 'Error logging in user',
    });
  }
});

app.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await User.find({_id: {$ne: userId}});

    res.json(users);
  } catch (err) {
    console.log('Error getting user', err);
  }
});

app.post('/send-request', async (req, res) => {
  const {senderId, receiverId, message} = req.body;

  console.log(senderId);
  console.log(receiverId);
  console.log(message);

  const receiver = await User.findById(receiverId);

  if (!receiver) {
    return res
      .status(404)
      .json({success: false, message: 'Receiver not found'});
  }

  receiver.requests.push({from: senderId, message});
  await receiver.save();

  res.status(200).json({success: true, message: 'Request sent successfully'});
});

app.get('/get-requests/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate(
      'requests.from',
      'name email image',
    );

    if (user) {
      res.json(user.requests);
    } else {
      res.status(404).json({message: 'User not found'});
    }
  } catch (err) {
    console.log('Error getting user', err);
  }
});

app.post('/accept-request', async (req, res) => {
  try {
    const {userId, requestId} = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({success: false, message: 'User not found'});
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {$pull: {requests: {from: requestId}}},
      {new: true},
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({success: false, message: 'Request not found'});
    }

    await User.findByIdAndUpdate(userId, {
      $push: {friends: requestId},
    });

    const friendUser = await User.findByIdAndUpdate(requestId, {
      $push: {friends: userId},
    });

    if (!friendUser) {
      return res
        .status(404)
        .json({success: false, message: 'Friend not found'});
    }

    res
      .status(200)
      .json({success: true, message: 'Request accepted successfully'});
  } catch (err) {
    console.log('Error accepting request', err);
    res.status(500).json({success: false, message: 'Internal server error'});
  }
});

app.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const users = await User.findById(userId).populate(
      'friends',
      'name email image',
    );

    res.json(users.friends);
  } catch (error) {
    console.log('Error fetching user !', error);
  }
});

const http = require('http').createServer(app);

const io = require('socket.io')(http);

// {"userId":"socket ID"}

const userSocketMap = {};

io.on('connection', socket => {
  console.log('a user connected', socket.id);
  
  const userId = socket.handshake.query.userId;
  console.log('user id : ', userId);

  if (userId !== 'undefined') {
    userSocketMap[userId] = socket.id;
  }

  console.log('user socket data : ', userSocketMap);

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
    delete userSocketMap[userId];
  });

  socket.on('sendMessage', ({senderId, receiverId, message}) => {
    const receiverSocketId = userSocketMap[receiverId];

    console.log('receiver id : ', receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', {
        senderId,
        message
      });
    }
  });
});

http.listen(6000, () => {
  console.log('Socket.io server running on port 6000');
});

app.post('/sendMessage', async (req, res) => {
  try {
    const {senderId, receiverId, message} = req.body;

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    await newMessage.save();

    const receiverSocketId = userSocketMap[receiverId];

    if (receiverSocketId) {
      console.log('emiting receiveMessage event to the receiver : ',receiverId);

      io.to(receiverSocketId).emit('newMessage', newMessage);
    } else {
      console.log('receiver socket id not found : ', receiverId);
    }

    res.status(201).json(newMessage);
  } catch (err) {
    console.log(err);
  }
});

app.get('/messages', async (req, res) => {
  try {
    const {senderId, receiverId} = req.query;

    const messages = await Message.find({
      $or: [
        {senderId: senderId, receiverId: receiverId},
        {senderId: receiverId, receiverId: senderId},
      ],
    }).populate('senderId', "_id name");

    res.status(200).json(messages);
    
  } catch (error) {
    console.log("Error : ",error);
  }
});
