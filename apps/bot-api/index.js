import 'dotenv/config'
import express from 'express'
import moodsRouter from './src/routes/moods.js'
import './telegramBot.js'
import { startDailyReminder } from './src/jobs/dailyReminder.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use('/moods', moodsRouter)

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})

startDailyReminder()
