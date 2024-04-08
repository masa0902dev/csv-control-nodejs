const fs = require("fs");
const path = require("path");



const append_file_path = "../forwrite/test_write.csv";
const record = [
    [1,2,3,4],
    [5,6,7,8],
    [99,99,99,99],
    [100,100,100,100],
    [101,101,101,101],
];
// const record = [
//     [1,2],
//     [3,4],
// ]
appendCSV(append_file_path, record);



// 相対ファイルパスを指定して、二次元配列(一次も可能)をCSVファイルに追記する。
// string, array -> void
function appendCSV(file_path, record) {
    const raw_file_path = file_path; //checkExpectedError()でrecordの長さチェックに使用
    file_path = path.join(__dirname, file_path);
    console.log(`\n----appendCSV(): your inputs are below----\nfile_path: ${file_path}\nrecord: `);
    console.log(record);
    const file_exists = fs.existsSync(file_path);
    checkExpectedError();

    try {
        let csv_content = "";
        record.forEach((value) => {
            csv_content += value + "\n";
        });
        if (file_exists) {
            fs.appendFileSync(file_path, csv_content);
            console.log("SUCCESS: appended in " + file_path);
        } else {
            fs.writeFileSync(file_path, csv_content);
            console.log("SUCCESS: created a new file and wrote in " + file_path);
        }
    } catch (error) {
        throw new Error("FAILED to append or create or write: " + error);
    }



    // ---内部で使用している関数たち
    function checkExpectedError() {
        const dir_path = path.dirname(file_path);
        if (!fs.existsSync(dir_path)) {
            throw new Error("No sudh directory " + dir_path);
        }
        if (!Array.isArray(record)) {
            throw new Error("2nd argument (record) must be an array.");
        }
        if (file_exists) {
            const existing_line = readLastNLineCSV(raw_file_path)[0];
            if (existing_line != undefined) { //「ファイルは存在するが中身が空」の場合はthrow new Errorしない。
                const correct_line_length = existing_line.length;
                record.forEach(arr => {
                    if (arr.length != correct_line_length) {
                        throw new Error("The length of each array in 2nd argument (record) is dirrerent from the length of the lines in the CSV file.\n" + "Correct length: " + correct_line_length + "\nYour Input length: " + arr.length);
                    }
                });
            }
        }
    }
    // 指定CSVファイル(1つ)の「行末からN行分」を読み込み、二次元配列として返す。
    // string, int -> array
    function readLastNLineCSV(file_path, last_n_line=1) {
        file_path = path.join(__dirname, file_path);
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


}
