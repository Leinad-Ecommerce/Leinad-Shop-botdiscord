import client from "./app/app";
import Discord from 'discord.js'

client.on("ready", () => {
    console.log("✅ Bot is ready!")
    client.user?.setActivity({
        name: "leinadshop.com.br",
        type: Discord.ActivityType.Playing,
    })
})