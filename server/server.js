import * as Path from 'node:path'
import express from 'express'
import hbs from 'express-handlebars'
import * as lib from './lib.js'
import multer from 'multer'

const server = express()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, Path.resolve('./public/images/'))
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

// Server configuration
const publicFolder = Path.resolve('public')
server.use(express.static(publicFolder))
server.use(express.urlencoded({ extended: false }))

// Handlebars configuration
server.engine('hbs', hbs.engine({ extname: 'hbs' }))
server.set('view engine', 'hbs')
server.set('views', Path.resolve('server/views'))

// Your routes/router(s) should go here

server.get('/', async (req, res) => {
  const shoppingItems = await lib.readData()
  res.render('shopping-list', shoppingItems)
})

server.get('/add-item', async (req, res) => {
  // const shoppingItems = await lib.readData()
  res.render('add-item')
})

server.post('/add-item', upload.single('image'), async (req, res) => {
  const shoppingItems = await lib.readData()
  const newItem = {
    id: shoppingItems.list.length + 1,
    product: req.body.product,
    quantity: req.body.quantity,
    image: `/images/${req.file.originalname}`,
  }

  shoppingItems.list.push(newItem)
  console.log(shoppingItems)

  await lib.writeData(shoppingItems)

  console.log(shoppingItems)

  res.redirect('/')
})

server.post('/delete-item/:id', async (req, res) => {
  const shoppingItems = await lib.readData()
  const unwantedItemId = req.params.id
  let unwantedItemIndex = shoppingItems.list.findIndex(
    (item) => item.id == unwantedItemId
  )

  shoppingItems.splice(unwantedItemIndex, 1)

  await lib.writeData(shoppingItems)

  res.redirect('/')
})

export default server
