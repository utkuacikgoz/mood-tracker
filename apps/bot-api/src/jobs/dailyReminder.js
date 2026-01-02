import cron from 'node-cron'
import TelegramBot from 'node-telegram-bot-api'
import { supabase } from '../db.js'

const token = process.env.TELEGRAM_BOT_TOKEN
if (!token) throw new Error('Missing TELEGRAM_BOT_TOKEN')

const bot = new TelegramBot(token, { polling: false })

export function startDailyReminder() {
  // Every day at 21:00 SERVER TIME
  cron.schedule('0 21 * * *', async () => {
    try {
      const { data, error } = await supabase
        .from('telegram_users')
        .select('chat_id')

      if (error || !data?.length) return

      await Promise.all(
        data.map((u) =>
          bot.sendMessage(
            u.chat_id,
            'How was your day? Send a mood score (1–10)'
          )
        )
      )
    } catch (err) {
      console.error('Daily reminder failed:', err.message)
    }
  })
}
