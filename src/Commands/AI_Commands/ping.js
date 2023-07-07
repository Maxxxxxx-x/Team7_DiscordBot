const code = `
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the websocket and roundtrip latency.'),
    async execute(interaction) {
        await interaction.reply('Pinging...');
        const message = await interaction.fetchReply();
        const embed = new EmbedBuilder()
            .setTitle('Pong!')
            .addFields(
                {
                    name: ':sparkling_heart: Websocket heartbeat',
                    value: \`\${interaction.client.ws.ping}ms\`,
                    inline: false
                },
                {
                    name: ':round_pushpin: Roundtrip Latency',
                    value: \`\${message.createdTimestamp - interaction.createdTimestamp}ms\`,
                    inline: false
                }
            )
            .setColor('RANDOM');
        await interaction.editReply({ content: '', embeds: [embed] });
    }
};`;

module.exports = code;