const fs = require('fs');
const path = require('path');



const read_file_path = '../randcsv/test_data1.csv';
const last_n_line = 1;
let data = readLastNLineCSV(read_file_path, last_n_line);
console.log(data);



// 指定CSVファイル(1つ)の「行末からN行分」を読み込み、二次元配列として返す。
// string, int -> array
function readLastNLineCSV(file_path, last_n_line=1) {
    file_path = path.join(__dirname, file_path);
    console.log(`\n----readLastNLineCSV(): your inputs are below----\nfile_path: ${file_path}\nlast_n_line: ${last_n_line}\n`);
    checkExpectedError();

    let data;
    try {
        let content = fs.readFileSync(file_path, 'utf8');
        let lines = content.split('\n');
        if (lines[lines.length - 1].trim() === '') {
            lines = lines.slice(0, -1);
        }
        const line_length = lines.length;
        if (last_n_line <= line_length) { //実際の行数がN未満の場合を避ける。避けなくても問題ないが、無駄な処理を避けるため。
            lines = lines.splice(last_n_line * -1); // 行末からN行分を取得(行末の空白は削除されている)
        }
        data = lines.map(line => line.split(","));
        return data;
    } catch (err) {
        throw new Error("Failed to read file: " + err);
    }



    // 以下、関数内でのみ有効な関数定義
    function checkExpectedError() {
        if (!fs.existsSync(file_path)) {
            throw new Error("No such file: " + file_path);
        }
        if (last_n_line < 1 || !Number.isInteger(last_n_line)) {
            throw new Error("2nd argument (last_n_line) must be a integer and positive.");
        }
    }
}

