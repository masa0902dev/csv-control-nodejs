const fs = require('fs');
const path = require('path');



const read_file_path = 'randcsv/test_data1.csv';
const skip_row = 2;
let data = readAllLineCSV(read_file_path, skip_row);
console.log(data);



// 指定CSVファイル(1つ)のヘッダを除く全行を読み込み、二次元配列として返す。
// string, int -> array
function readAllLineCSV(file_path, skip_row) {
    file_path = path.join(__dirname, file_path);
    console.log(`\n----readAllLineCSV(): your inputs are below----\nfile_path: ${file_path}\nskip_row: ${skip_row}\n`);
    checkExpectedError();

    let data;
    try {
        let content = fs.readFileSync(file_path, 'utf8');
        let lines = content.split('\n');
        lines = lines.slice(skip_row);
        if (lines[lines.length - 1].trim() === '') {
            lines = lines.slice(0, -1);
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
        if (skip_row < 0 || !Number.isInteger(skip_row)) {
            throw new Error("2nd argument (skip_row) must be a integer and 0 or over.");
        }
    }
}

