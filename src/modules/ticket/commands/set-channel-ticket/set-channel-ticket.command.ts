import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { CategoryChannel, ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"

class SetChannelTicketCommand extends BaseSlashCommand {

    constructor() {
        super({
            name: "setchannelticket",
            description: "Setar este canal como o canal para abertura de ticket's",
            type: Discord.ApplicationCommandType.ChatInput,
            options: [
                {
                    name: "category",
                    description: "Categoria de onde vai ser aberto o ticket",
                    type: 7,
                    required: true
                }
            ]
        })
    }

    async exec(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {
        if (!interaction.appPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: "Administrador" }) })
        }

        const category_channel = interaction.options.getChannel("category");

        if (category_channel?.type !== 4) {
            interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(colors.error!)
                        .setDescription(`> ${emojis.error} A categoria informada não é do tipo \`Categoria\`, verifique e tente novamente!`)
                ]
            })
            return;
        }

        await interaction.channel?.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setAuthor({ name: interaction.guild?.name!, iconURL: interaction.guild?.iconURL()! })
                    .addFields(
                        {
                            name: `${emojis.info} | Informações`,
                            value: "Se você estiver precisando de ajuda selecione uma opção abaixo"
                        },
                        {
                            name: `${emojis.annoucement} | Horário de atendimento:`,
                            value: "Segunda a Sabado (14:00 até as 23:00 Horas)"
                        }
                    )
                    .setImage("https://cdn.discordapp.com/attachments/1121239621267882084/1121244376656519188/a.png")
            ],
            components: [
                new Discord.ActionRowBuilder<any>()
                    .addComponents(
                        new Discord.StringSelectMenuBuilder()
                            .setCustomId("open_ticket")
                            .setPlaceholder('➡️ Escolha uma opção de ticket')
                            .addOptions(
                                {
                                    emoji: `${emojis.support}`,
                                    label: "Ajuda",
                                    description: "Peça ajuda a um suporte técnico",
                                    value: "help",
                                },
                                {
                                    emoji: `💡`,
                                    label: "Sugestão",
                                    description: "Envie sua sugestão para a plataforma",
                                    value: "suggestion",
                                },
                                {
                                    emoji: `${emojis.bug}`,
                                    label: "BUG",
                                    description: "Reportar um bug sobre a plataforma",
                                    value: "repport",
                                }
                            )
                    )
            ]
        })

        interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.success} O canal ${interaction.channel} foi setado com sucesso!`)
            ],
            ephemeral: true
        })
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new SetChannelTicketCommand()
    commandContainer.addCommand(command)
}