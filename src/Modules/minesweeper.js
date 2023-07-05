const { Queue } = require("./obj")

function random_12(){
    return Math.floor(Math.random() * 12);
}

function map_init(){
    map = [].fill([].fill(0, 0, 11), 0, 11);
    for (let i = 0; i < 11; i++){
        let x = random_12(), y = random_12();
        if (map[x][y] != -1) map[x][y] = -1;
        else i--;
    }
    return map;
}

function convert(table) {
    table.array.forEach(col => {
        col.forEach(
            cell => {
                if (cell === -1) cell = ":bomb:";
                else if (cell === 0) cell = ":black_large_square:";
                else if (cell === 1) cell = ":one:";
                else if (cell === 2) cell = ":two:";
                else if (cell === 3) cell = ":three:";
                else if (cell === 4) cell = ":four:";
                else if (cell === 5) cell = ":five";
                else if (cell === 6) cell = ":six:";
                else if (cell === 7) cell = ":seven:";
                else if (cell === 8) cell = ":eight";
                else if (cell === '?') cell = ":blue_square:";
                else cell = ":triangular_flag_on_post:";
            }
        )
    });
    return table;
}

function touch(true_table, player_table, x, y){
    let dx = [0, 0, 1, -1, 1, 1, -1, -1],
        dy = [1, -1, 0, 0, 1, -1, 1, -1];
        // 保證不會戳到地雷和已標記的格子
    player_table[x][y] = true_table[x][y];
    if (player_table[x][y] != 0){
        return player_table;
    }
    let q = new Queue();
    q.push([x, y]);
    while (!q.empty()){
        let pos = q.pop();
        let x = pos[0], y = pos[1];
        for (let i = 0; i < 8; i++){
            let tx = x + dx[i], ty = y + dy[i];
            if (tx < 0 || tx >= 12 || ty < 0 || ty >= 12) continue;
            player_table[tx][ty] = true_table[tx][ty];
            if (player_table[tx][ty] != 0) continue;
            q.push([tx, ty]);
        }
    }
    return player_table;
}

module.exports = {
    init: map_init,
    convert: convert,
    touch: touch
};