const { Queue } = require("./obj");
const fs = require("fs");

function read_map(){
    // read map in json format
    let rawdata = fs.readFileSync("./data/map.json");
    let map = JSON.parse(rawdata);
    return map;
}

function write_map(map){
    // write map in json format
    let data = JSON.stringify(map);
    fs.writeFileSync("./map.json", data);
}

function random_12(){
    return Math.floor(Math.random() * 12);
}

function map_init(){
    // 2d 12x12 array, init value is 0
    let map = [];
    for (let i = 0; i < 12; i++){
        let row = [];
        for (let j = 0; j < 12; j++){
            row.push(0);
        }
        map.push(row);
    }
    // print map
    // console.log(map);


    for (let i = 0; i < 12; i++){
        let x = random_12(), y = random_12();
        console.log(x, y, map[x][y]);
        if (map[x][y] != -1) map[x][y] = -1;
        else i--;
    }
    for (let i = 0; i < 12; i++){
        for (let j = 0; j < 12; j++){
            if (map[i][j] != -1){
                let x_move = [0, 0, 1, -1, 1, 1, -1, -1],
                    y_move = [1, -1, 0, 0, 1, -1, 1, -1];
                let count = 0;
                for (let k = 0; k < 8; k++){
                    let new_x = i + x_move[k], new_y = j + y_move[k];
                    if (new_x >= 0 && new_x < 12 && new_y >= 0 && new_y < 12){
                        if (map[new_x][new_y] === -1) count++;
                    }
                }
                map[i][j] = count;
            }
        }
    }
    return map;
}

function player_convert(player_table){
    for (let i=0; i<12; i++){
        for (let j=0; j<12; j++){
            if (player_table[i][j] === -1) player_table[i][j] = ":boom:";
            else if (player_table[i][j] === 0) player_table[i][j] = ":white_large_square:";
            else if (player_table[i][j] === 1) player_table[i][j] = ":one:";
            else if (player_table[i][j] === 2) player_table[i][j] = ":two:";
            else if (player_table[i][j] === 3) player_table[i][j] = ":three:";
            else if (player_table[i][j] === 4) player_table[i][j] = ":four:";
            else if (player_table[i][j] === 5) player_table[i][j] = ":five:";
            else if (player_table[i][j] === 6) player_table[i][j] = ":six:";
            else if (player_table[i][j] === 7) player_table[i][j] = ":seven:";
            else if (player_table[i][j] === 8) player_table[i][j] = ":eight:";
            else if (player_table[i][j] === 9) player_table[i][j] = ":blue_square:";
            else if (player_table[i][j] === -2) player_table[i][j] = ":triangular_flag_on_post:";
        }
    }
    return player_table;
}

// BFS to check the empty area around the touched area
function touch(true_table, player_table, x, y){
    // make sure the touched area is not checked
    if (player_table[x][y] != 9) return;
    let x_move = [0, 0, 1, -1, 1, 1, -1, -1],
        y_move = [1, -1, 0, 0, 1, -1, 1, -1];
    let q = new Queue();
    q.push([x, y]);
    while (!q.empty()){
        let pos = q.pop();
        let x = pos[0], y = pos[1];
        for (let i = 0; i < 8; i++){
            let new_x = x + x_move[i], new_y = y + y_move[i];
            if (new_x >= 0 && new_x < 12 && new_y >= 0 && new_y < 12){
                if (player_table[new_x][new_y] === 9){
                    player_table[new_x][new_y] = true_table[new_x][new_y];
                    if (true_table[new_x][new_y] >= 0) q.push([new_x, new_y]);
                }
            }
        }
    }
    return player_table;
}

function check_win(true_table, player_table){
    let check = true;
    for (let i = 0; i < 12; i++){
        for (let j = 0; j < 12; j++){
            if (true_table[i][j] === -1 && player_table[i][j] != -2) check = false;
            if (true_table[i][j] != -1 && player_table[i][j] === -2) check = false;
        }
    }
    return true;
}

module.exports = {
    init: map_init,
    player_convert: player_convert,
    touch: touch,
    check_win: check_win,
    read_map: read_map,
    write_map: write_map
};

/*
true map:
-1: mine
0: empty
1~8: mine around

player map:
-2: flag
-1: mine
0: check but empty
1~8: mine around
9: uncheck
*/