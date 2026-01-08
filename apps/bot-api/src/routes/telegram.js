import express from 'express'
import { bot } from '../../telegramBot.js'

const router = express.Router()

router.post('/webhook', async (req, res) => {
  try {
    await bot.handleUpdate(req.body)
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

export default router
router.get('/summary/weekly', async (req, res) => {
  const { telegramUserId } = req.query
  try {
    const data = await summary(telegramUserId, 7)
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }