import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { formData } from "./open-ticket-select-menu.event";
import { Database } from "@/infra/app/setup-database";
import { randomUUID } from "crypto";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { GetUserNameLowerCase } from "@/modules/@shared/utils/get-user-name-lowercase";
import { OpenTicketMessage } from "../../@shared/ticket-messages/open-ticket.message";

export const ticketData = {
    ownerId: "",
    email: "",
    reason: "",
    channelId: "",
    sessionId: randomUUID(),
    messageId: "",
    createdAt: new Date()
}

class ButtonClickedEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId !== "start_ticket") return;

        ticketData.ownerId = interaction.user.id
        ticketData.email = interaction.fields.getTextInputValue("email")
        ticketData.reason = interaction.fields.getTextInputValue("reason")

        await interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.loading} Seu ticket está sendo aberto, aguarde...`)
            ],
            ephemeral: true
        })

        const channel_created = await interaction.guild?.channels.create({
            name: `🎫・${GetUserNameLowerCase(interaction.user.username)}`,
            parent: (await new Database().db.get('ticket.config.category_id') as string),
            permissionOverwrites: [
                {
                    id: interaction.guildId!,
                    deny: ["ViewChannel"]
                },
                {
                    id: ticketData.ownerId,
                    allow: ["ViewChannel", "SendMessages", "ReadMessageHistory", "AddReactions", "AttachFiles"]
                }
            ]
        })

        ticketData.channelId = channel_created?.id!

        const message_created = await channel_created?.send({
            ...OpenTicketMessage({
                client,
                interaction,
                type: formData.typeTicket,
                reason: ticketData.reason,
                createdAt: ticketData.createdAt
            })
        })

        ticketData.messageId = message_created?.id!!

        new Database().set(`ticket.sessions.${ticketData.channelId}`, {
            ownerId: interaction.user.id,
            email: ticketData.email,
            reason: ticketData.reason,
            type: formData.typeTicket,
            channelId: ticketData.channelId,
            messageId: ticketData.messageId,
            sessionId: ticketData.sessionId,
            createdAt: ticketData.createdAt
        })
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new ButtonClickedEvent()
    buttonClickedEvent.setupConsumer(client)
}