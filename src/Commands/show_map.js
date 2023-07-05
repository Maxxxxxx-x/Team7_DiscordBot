const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { read_map, player_convert } = require("../Modules/minesweeper.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('show_map')
        .setDescription('Show the map of the minesweeper game'),
    async execute(client, interaction) {
        let map = read_map().player_table;
        console.log(map);
        let embed = new EmbedBuilder()
            .setTitle("Minesweeper Map");
        description = "";
        map = player_convert(map);
        for (let i = 0; i < 12; i++) {
            for (let j = 0; j < 12; j++) {
                description += map[i][j];
            }
            description += "\n";
        }
        embed.setDescription(description);
        await interaction.reply({ embeds: [embed] });
    }
};