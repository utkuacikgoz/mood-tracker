import cron from 'node-cron'
import { Telegraf } from 'telegraf'
import { supabase } from '../db.js'

const token = process.env.TELEGRAM_BOT_TOKEN
if (!token) throw new Error('Missing TELEGRAM_BOT_TOKEN')

const bot = new Telegraf(token)

export function startDailyReminder() {
  // every day at 21:00 server time
  cron.schedule('0 21 * * *', async () => {
    const { data, error } = await supabase
      .from('telegram_users')
      .select('chat_id')

    if (error) {
      console.error('dailyReminder select error:', error.message)
      return
    }
    if (!data?.length) return

    for (const u of data) {
      try {
        await bot.telegram.sendMessage(
          u.chat_id,
          'How was your day? Send a mood score (1–10)'
        )
      } catch (e) {
        console.error('dailyReminder send error:', u.chat_id, e?.message || e)
      }
    }
  })
}
