import "dotenv/config";
import { Telegraf } from "telegraf";

const { TELEGRAM_BOT_TOKEN } = process.env;
if (!TELEGRAM_BOT_TOKEN) throw new Error("Missing TELEGRAM_BOT_TOKEN in .env");

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

bot.start(async (ctx) => {
  await ctx.reply(
    "Mood Tracker ✅\n\nReply with a number 1–10 anytime.\nExample: `7` or `7 felt anxious`",
    { parse_mode: "Markdown" }
  );
});

bot.on("text", async (ctx) => {
  const text = (ctx.message.text || "").trim();
  const m = text.match(/^([1-9]|10)\b(?:\s+(.+))?$/);
  if (!m) return ctx.reply("Send a number 1–10 (optional note). Example: `8 great day`", { parse_mode: "Markdown" });

  const score = Number(m[1]);
  const note = m[2]?.trim() || null;

  await ctx.reply(`Saved: ${score}${note ? ` — ${note}` : ""}`);
});

bot.launch();
console.log("Bot running.");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
