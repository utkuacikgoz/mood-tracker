import 'dotenv/config'
import express from 'express'

import moodsRouter from './moods.js'
import telegramRouter from './telegram.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use('/telegram', telegramRouter)
app.use('/moods', moodsRouter)

app.get('/', (_, res) => res.send('OK'))

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API running on port ${PORT}`)
})
