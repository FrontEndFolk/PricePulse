import sys
import json
import asyncio
from aiogram import Bot

async def main():
    try:
        args = json.loads(sys.argv[1])

        token = '8103651866:AAHZhprNudw2WwmLu7GrOUEkN6Hoy3MWz7Y'
        chat_id = args.get("chat_id")
        text = args.get("text", "")
        image_url = args.get("image_url")

        bot = Bot(token=token)

        if image_url:
            await bot.send_photo(chat_id=chat_id, photo=image_url, caption=text)
        else:
            await bot.send_message(chat_id=chat_id, text=text)

        await bot.session.close()
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

asyncio.run(main())