const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ai_ping") // Command name with "ai_" prepended
        .setDescription("Ping!"),
    async execute(Bot, Interaction) {
        const Message = await Interaction.reply({
            content: "",
            embeds: [
                new EmbedBuilder().setTitle("Pinging").setColor("Orange"),
            ],
            fetchReply: true,
        });
        await Interaction.editReply({
            content: "",
            embeds: [
                new EmbedBuilder()
                    .setTitle("Pong!")
                    .addFields(
                        {
                            name: ":stopwatch: Uptime",
                            value: `${Math.round(Bot.uptime / 60000)} minutes`,
                            inline: false,
                        },
                        {
                            name: ":sparkling_heart: Websocket heartbeat",
                            value: `${Bot.ws.ping}ms`,
                            inline: false,
                        },
                        {
                            name: ":round_pushpin: Roundtrip Latency",
                            value: `${Message.createdTimestamp - Interaction.createdTimestamp}ms`,
                            inline: false,
                        }
                    )
                    .setColor("Green"),
            ],
        });
    },
};