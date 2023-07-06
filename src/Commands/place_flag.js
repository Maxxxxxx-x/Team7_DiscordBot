const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {
    read_map,
    write_map,
    map2str,
    player_convert,
    check_win,
    true_map_init,
    player_map_init
} = require("../Modules/minesweeper.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("flag")
        .setDescription("Place/Remove a flag on the minesweeper cell")
        .addNumberOption((option) =>
            option
                .setName("x")
                .setDescription("The x coordinate of the cell")
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName("y")
                .setDescription("The y coordinate of the cell")
                .setRequired(true)
        ),
    async execute(client, interaction) {
        let y = interaction.options.getNumber("x") - 1,
            x = interaction.options.getNumber("y") - 1;
        let data = read_map();
        let player_table = data.player_table;
        // place flag on the cell
        // flag = -2
        if (player_table[x][y] === 9) {
            player_table[x][y] = -2;
            let obj = {
                true_table: data.true_table,
                player_table,
                players: data.players,
                click_count: data.click_count,
            };
            write_map(obj);
            await interaction.reply({
                content: `Cell(${y + 1}, ${x + 1}) is flagged.`,
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Minesweeper Map")
                        .setDescription(map2str(player_convert(player_table))),
                ],
            });
            if (check_win(data.true_table, player_table)) {
                await interaction.followUp({
                    content: "You win!",
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Minesweeper Map")
                            .setColor("Green")
                            .setDescription(
                                map2str(player_convert(data.true_table))
                            )
                    ],
                });
                // generate new game
                let true_table = data.true_table;
                let player_table = data.player_table;
                true_table = true_map_init();
                player_table = player_map_init();
                let obj = {
                    true_table,
                    player_table,
                    players: [],
                    click_count: 0,
                };
                // console.log(obj);
                write_map(obj);
                await interaction.followUp({
                    content: "New game started!",
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Minesweeper Map")
                            .setDescription(
                                map2str(player_convert(player_table))
                            ),
                    ],
                });
            }
            return;
        } else if (player_table[x][y] === -2) {
            player_table[x][y] = 9;
            let obj = {
                true_table: data.true_table,
                player_table,
                players: data.players,
                click_count: data.click_count,
            };
            write_map(obj);
            await interaction.reply({
                content: `Cell(${y + 1}, ${x + 1}) is unflagged.`,
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Minesweeper Map")
                        .setDescription(map2str(player_convert(player_table))),
                ],
            });
            return;
        } else {
            await interaction.reply({
                content: `Cell(${y + 1}, ${x + 1}) can't place flag.`,
            });
            return;
        }
    },
};
