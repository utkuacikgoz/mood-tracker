import { Telegraf } from 'telegraf'
import fetch from 'node-fetch'

const token = process.env.TELEGRAM_BOT_TOKEN
const API_URL = 'http://localhost:3000/moods' // change in prod

const bot = new Telegraf(token)

// Expect messages like: 1–5 or "/mood 4"
bot.on('text', async (ctx) => {
  const chatId = ctx.chat?.id
  const text = ctx.message?.text?.trim()

  const match = text?.match(/^\/?mood?\s*([1-5])$/)
  if (!match) {
    await ctx.reply('Send a mood score: 1–5')
    return
  }

  const mood = Number(match[1])

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mood,
        telegramUserId: ctx.from?.id
      })
    })

    if (!res.ok) throw new Error('API error')

    await ctx.reply(`Saved 👍 Mood: ${mood}`)
  } catch (e) {
    await ctx.reply('Failed to save mood. Try again.')
  }
})

bot.launch().catch(() => {})

// graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
