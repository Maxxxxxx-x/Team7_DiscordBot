const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('annoy')
        .setDescription('Annoy everyone in the channel!'),
    async execute(Bot, Interaction) {
        const Message = await Interaction.reply({ content: 'Ready to be annoyed?!', fetchReply: true });
        await Interaction.editReply({
            content: "",
            embeds: [
                new EmbedBuilder()
                    .setTitle("")
                    .addFields(
                        {
                            name: ":stopwatch: Uptime",
                            value: `${Math.round(Interaction.client.uptime / 60000)} minutes`,
                            inline: false
                        },
                        {
                            name: ":sparkling_heart: Websocket heartbeat",
                            value: `${Interaction.client.ws.ping}ms`,
                            inline: false
                        },
                        {
                            name: ":round_pushpin: Roundtrip Latency",
                            value: `${Message.createdTimestamp - Interaction.createdTimestamp}ms`,
                            inline: false
                        }
                    )
                    .setColor("Random")
            ]
        });
    }
};