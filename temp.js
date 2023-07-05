const { init } = require('./src/Modules/minesweeper.js');
const fs = require('fs');


let true_table = init();
let player_table = true_table.map((row) => row.map((col) => 9));
console.log(player_table);
fs.writeFileSync('./data/map.json', JSON.stringify({
    true_table: true_table,
    player_table: player_table,
    players: [],
    touch_times: 0
}));