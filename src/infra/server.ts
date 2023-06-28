import client from "./app/app";
import Discord from 'discord.js'

type ActivitiesProps = {
    content: string,
    type: Exclude<Discord.ActivityType, Discord.ActivityType.Custom>,
    time: number
}

const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

client.on("ready", async () => {

    const activities: ActivitiesProps[] = [
        {
            content: 'Jogando Minecraft',
            type: Discord.ActivityType.Playing,
            time: 3000
        },
        {
            content: 'Assistindo X videos in youtube',
            type: Discord.ActivityType.Playing,
            time: 5000
        },
        {
            content: 'Motivando a não desistir',
            type: Discord.ActivityType.Playing,
            time: 5000
        }
    ]

    while (true) {
        for (const activity of activities) {
            client.user?.setActivity({
                name: activity.content,
                type: activity.type
            })

            await sleep(activity.time);
        }
    }

    console.log("✅ Bot is ready!")
})