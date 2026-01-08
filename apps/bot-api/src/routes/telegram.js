import express from 'express'
import { bot } from '../../telegramBot.js'

const router = express.Router()

router.post('/webhook', async (req, res) => {
  try {
    await bot.handleUpdate(req.body)
    res.sendStatus(200)
  } catch (err) {
    console.error('Telegram webhook error:', err)
    res.sendStatus(500)
  }
})

export default router
