const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { read_map, player_convert, map2str} = require("../Modules/minesweeper.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('show_map')
        .setDescription('Show the map of the minesweeper game'),
    async execute(client, interaction) {
        let data = read_map();
        // console.log(map);
        // format the players id to discord mention
        for (const id in data.players) {
            data.players[id] = `<@${id}>`;
        }
        let embed = new EmbedBuilder()
            .setTitle("Minesweeper Map")
            .setDescription(map2str(player_convert(data.player_table)))
        await interaction.reply({ embeds: [embed] });
    }
};