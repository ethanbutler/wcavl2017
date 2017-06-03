const express          = require('express')
const app              = express()
const http             = require('http').Server(app)
const io               = require('socket.io')(http)
const bodyparser       = require('body-parser')
const cors             = require('cors')

app.use(bodyparser.json()) // allow express app to understand JSON data
app.use(cors())            // allow CORS – don't use this on production

io.on('connection', socket => {
  console.log('User')

  socket.on('disconnect', () => console.log('User left'))

  socket.on('COMMENT_FOCUS', data => {
    console.log(`${data.user} is typing`)
    io.emit('COMMENT_FOCUS', data)
  })

  socket.on('COMMENT_BLUR', data => {
    console.log(`${data.user} stopped typing`)
    io.emit('COMMENT_BLUR', data)
  })

})

app.get('/', (req, res) => {
  res.status(200).send('Hello')
})

app.post('/post/new', (req, res) => {
  let data = req.body
  console.log(`New post: ${data.id}`)
  io.emit('POST_NEW', data)
  res.status(200).send(req.body)
})

app.post('/post/update', (req, res) => {
  let data = req.body
  console.log(`Updated post: ${data.content}`)
  io.emit('POST_UPDATE', data)
  res.status(200).send(req.body)
})

app.post('/post/alert', (req, res) => {
  let data = req.body
  console.log(`Post is being edited: ${data.id}`)
  io.emit('POST_ALERT', data)
  res.status(200).send(req.body)
})

app.post('/comment/new', (req, res) => {
  console.log(req.body)
  let data = req.body
  console.log(`${data.user} left a comment on post ${data.post_id}`)
  io.emit('COMMENT_NEW', data)
  res.status(200).send(req.body)
})

http.listen(3000, () => console.log('Server running'))
