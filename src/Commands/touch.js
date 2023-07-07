
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { read_map, player_convert, touch, map2str, write_map, true_map_init, player_map_init, check_win } = require("../Modules/minesweeper.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('click')
        .setDescription('Click the minesweeper cell')
        .addNumberOption((option) => option.setName('x').setDescription('The x coordinate of the cell').setRequired(true))
        .addNumberOption((option) => option.setName('y').setDescription('The y coordinate of the cell').setRequired(true)),
    async execute(client, interaction) {
        let y = interaction.options.getNumber('x') -1,
            x = interaction.options.getNumber('y') -1;
        let data = read_map();
        let player_table = data.player_table;
        let true_table = data.true_table;
        let embed = new EmbedBuilder()
            .setTitle("Minesweeper Map");
        if (player_table[x][y] != 9){
            await interaction.reply({ content: `Cell(${y+1}, ${x+1}) is not clickable.` });
            return;
        }
        if (true_table[x][y] === -1){
            for (let i = 0; i < 12; i++){
                for (let j = 0; j < 12; j++){
                    if (true_table[i][j] === -1)
                    player_table[i][j] = true_table[i][j];
                }
            }
            embed.setDescription(map2str(player_convert(player_table)));
            embed.setFields([
                { name: "Click Count", value: data.click_count.toString(), inline: true },
                {
                    name: "Players", value: toString(data.players.map((id) => `<@${id}>`)), inline: true
                }
            ]);
            embed.setColor("Red");
            // await interaction.reply({ embeds: [embed] });
            await interaction.reply({ content: "You lose!", embeds: [embed] });
            // await interaction.followUp({ content: "You lose!" });
            // generate new game
            true_table = true_map_init();
            player_table = player_map_init();
            let obj = {
                true_table,
                player_table,
                players: [],
                click_count: 0
            }
            // console.log(obj);
            write_map(obj)
            await interaction.followUp({ content: "New game started!" , embeds: [new EmbedBuilder().setTitle("Minesweeper Map").setDescription(map2str(player_convert(player_table))).setColor("Blue")]});
            return;
        }
        player_table = touch(true_table, player_table, x, y);
        // console.log(`data:`);
        // console.log(data);
        if (data.players.indexOf(interaction.user.id) === -1)
            data.players.push(interaction.user.id)
        let obj = {
            true_table,
            player_table,
            players: data.players,
            click_count: data.click_count + 1
        }
        // console.log(`obj:`);
        // console.log(obj);
        write_map(obj);

        if (check_win(true_table, player_table)){
            // console.log(data)
            // console.log("win");
            embed.setDescription(map2str(player_convert(player_table)));
            embed.addFields([
                { name: "Click Count", value: data.click_count.toString(), inline: true },
                { name: "Players", value: String(data.players.map((id) => `<@${id}>`)), inline: true}
            ]);
            embed.setColor("Green");
            await interaction.reply({ content: "You win!", embeds: [embed] });
            // generate new game
            true_table = true_map_init();
            player_table = player_map_init();
            let obj = {
                true_table,
                player_table,
                players: [],
                click_count: 0
            }
            // console.log(obj);
            write_map(obj)
            await interaction.followUp({ content: "New game started!" , embeds: [new EmbedBuilder().setTitle("Minesweeper Map").setDescription(map2str(player_convert(player_table)))]});
            return;
        }

        embed.setDescription(map2str(player_convert(player_table)));
        await interaction.reply({
            content: `You clicked the cell(${y+1}, ${x+1})!`,
            embeds: [embed] });
        
    }
}
