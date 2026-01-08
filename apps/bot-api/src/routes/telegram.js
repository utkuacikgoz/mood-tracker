// src/routes/telegram.js
import express from 'express'
import { bot } from '../../telegramBot.js'

const router = express.Router()

router.post('/webhook', async (req, res) => {
  await bot.handleUpdate(req.body)
  res.sendStatus(200)
})

export default router
