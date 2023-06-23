import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { colors } from "@/modules/@shared/utils/colors";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"

class PingCommand extends BaseSlashCommand {

    constructor() {
        super({
            name: "ping",
            description: "Veja o meu ping em tempo real",
            type: Discord.ApplicationCommandType.ChatInput
        })
    }

    async exec(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {
        interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setTitle('Pong 🏓')
                    .setDescription([
                        `> 🛅 Meu ping atual é de: \`${client.ws.ping}MS\``,
                        `> 🛰️ Shards: \`20\``,
                        `> 📦 Container: \`Online\``
                    ].join("\n"))
                    .setFooter({ text: "Comando consultado hoje às", iconURL: interaction.guild?.iconURL()! })
                    .setTimestamp()
            ]
        })
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new PingCommand()
    commandContainer.addCommand(command)
}