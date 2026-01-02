import express from 'express'
import { supabase } from '../db.js'

const router = express.Router()

// POST /moods
router.post('/', async (req, res) => {
  const { mood, note, telegramUserId } = req.body
  const parsedMood = Number(mood)
  const userId = Number(telegramUserId)

  if (
    !userId ||
    !Number.isInteger(parsedMood) ||
    parsedMood < 1 ||
    parsedMood > 10
  ) {
    return res.status(400).json({ error: 'invalid mood or telegramUserId' })
  }

  const { error } = await supabase
    .from('mood_entries')
    .insert({
      mood: parsedMood,
      note: note || null,
      telegram_user_id: userId
    })

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.status(201).json({ success: true })
})

// helper
async function summary(telegramUserId, days) {
  const userId = Number(telegramUserId)
  const from = new Date()
  from.setDate(from.getDate() - days)

  const { data, error } = await supabase
    .from('mood_entries')
    .select('mood')
    .eq('telegram_user_id', userId)
    .gte('created_at', from.toISOString())

  if (error) throw error
  if (!data?.length) return { count: 0 }

  const avg =
    data.reduce((sum, r) => sum + r.mood, 0) / data.length

  return {
    count: data.length,
    avg: Number(avg.toFixed(2))
  }
}

// GET /moods/summary/weekly
router.get('/summary/weekly', async (req, res) => {
  const { telegramUserId } = req.query
  if (!telegramUserId)
    return res.status(400).json({ error: 'telegramUserId required' })

  try {
    res.json(await summary(telegramUserId, 7))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// GET /moods/summary/monthly
router.get('/summary/monthly', async (req, res) => {
  const { telegramUserId } = req.query
  if (!telegramUserId)
    return res.status(400).json({ error: 'telegramUserId required' })

  try {
    res.json(await summary(telegramUserId, 30))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
