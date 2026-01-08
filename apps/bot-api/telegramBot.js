import { Telegraf } from 'telegraf'
import { supabase } from './src/db.js'

// Node 18+ (Railway) has global fetch → DO NOT import node-fetch
const token = process.env.TELEGRAM_BOT_TOKEN

if (!token) {
  console.error('TELEGRAM_BOT_TOKEN missing')
  // do NOT throw at import time
}

const API = process.env.API_BASE_URL || 'http://localhost:3000'
export const bot = new Telegraf(token)

/* ---------- handlers ---------- */

bot.start(ctx =>
  ctx.reply(
    'Mood Tracker ✅\n\nSend a number 1–10\nExample: `7 felt anxious`',
    { parse_mode: 'Markdown' }
  )
)

async function safeJson(res) {
  if (!res.ok) throw new Error(`API ${res.status}`)
  return res.json()
}

// /week
bot.command('week', async ctx => {
  try {
    const res = await fetch(
      `${API}/moods/summary/weekly?telegramUserId=${ctx.from.id}`
    )
    const { avg, count } = await safeJson(res)

    if (!count) return ctx.reply('No moods logged this week.')
    ctx.reply(`📊 This week\nEntries: ${count}\nAvg mood: ${avg}`)
  } catch {
    ctx.reply('Could not fetch weekly summary.')
  }
})

// /month
bot.command('month', async ctx => {
  try {
    const res = await fetch(
      `${API}/moods/summary/monthly?telegramUserId=${ctx.from.id}`
    )
    const { avg, count } = await safeJson(res)

    if (!count) return ctx.reply('No moods logged this month.')
    ctx.reply(`📈 This month\nEntries: ${count}\nAvg mood: ${avg}`)
  } catch {
    ctx.reply('Could not fetch monthly summary.')
  }
})

// mood input
bot.on('text', async ctx => {
  const text = ctx.message.text.trim()
  const telegramUserId = ctx.from.id
  const chatId = ctx.chat.id

  // store user (non-fatal)
  try {
    await supabase
      .from('telegram_users')
      .upsert({ telegram_user_id: telegramUserId, chat_id: chatId })
  } catch {}

  const m = text.match(/^([1-9]|10)\b(?:\s+(.+))?$/)
  if (!m) {
    return ctx.reply(
      'Send a number 1–10\nExample: `8 great day`',
      { parse_mode: 'Markdown' }
    )
  }

  const mood = Number(m[1])
  const note = m[2]?.trim() || null

  try {
    const res = await fetch(`${API}/moods`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood, note, telegramUserId })
    })

    if (!res.ok) throw new Error()
    ctx.reply(`Saved 👍 ${mood}${note ? ` — ${note}` : ''}`)
  } catch {
    ctx.reply('Failed to save mood.')
  }
})
