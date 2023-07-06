const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bday!')
        .setDescription('為頻道裡的用戶慶祝生日'),
    async execute(Bot, Interaction) {
        const Message = await Interaction.reply({ content: '壽星在哪裡?!', fetchReply: true });
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