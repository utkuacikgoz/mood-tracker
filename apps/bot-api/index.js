import 'dotenv/config'
import express from 'express'
import moodsRouter from './src/routes/moods.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use('/moods', moodsRouter)

// health check (important)
app.get('/', (_, res) => res.send('OK'))

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API running on port ${PORT}`)
})

// 🔒 only start workers in production runtime
if (process.env.ENABLE_BOT === 'true') {
  await import('./telegramBot.js')
}

if (process.env.ENABLE_JOBS === 'true') {
  const { startDailyReminder } = await import('./src/jobs/dailyReminder.js')
  startDailyReminder()
}
