const fs = require("fs");
const path = require("path");



const write_file_path = "./forwrite/test_write.csv";
const record = readAllLineCSV("./randcsv/test_data1.csv", 1);
console.log(record);
const header = "name,email,address,phone_number";
writeCSV(write_file_path, record, header);



// 相対ファイルパスを指定して、二次元配列(一次も可能)をCSVファイルに書き込む。ヘッダは1行目のみ(指定なしならヘッダ行なし)。
// string, array, string -> void
function writeCSV(file_path, record, header = "") {
    file_path = path.join(__dirname, file_path);
    console.log(`\n----readAllLineCSV(): your inputs are below----\nfile_path: ${file_path}\nrecord: ${record}\nheader: ${header}\n`);
    checkExpectedError();

    try {
        let csv_content = "";
        if (header !== "") {
            csv_content += header + "\n";
        }
        record.forEach((value) => {
            csv_content += value + "\n";
        });
        fs.writeFileSync(file_path, csv_content);
    } catch (error) {
        throw new Error("No such directory: " + error);
    }

    // 以下、関数内でのみ有効な関数定義
    function checkExpectedError() {
        const dir_path = path.dirname(file_path);
        if (!fs.existsSync(dir_path)) {
            throw new Error("No sudh directory " + dir_path);
        }
        if (!Array.isArray(record)) {
            throw new Error("2nd argument (record) must be an array.");
        }
        if (typeof header !== "string") {
            throw new Error("3rd argument (header) must be a string.");
        }
    }
}




// 指定CSVファイル(1つ)のヘッダを除く全行を読み込み、二次元配列として返す。
// string, int -> array
function readAllLineCSV(file_path, skip_row) {
    file_path = path.join(__dirname, file_path);
    console.log(`\n----readAllLineCSV(): your inputs are below----\nfile_path: ${file_path}\nskip_row: ${skip_row}\n`);
    checkExpectedError();

    let data;
    try {
        let content = fs.readFileSync(file_path, "utf8");
        let lines = content.split("\n");
        lines = lines.slice(skip_row);
        if (lines[lines.length - 1].trim() === "") {
            lines = lines.slice(0, -1);
        }
        data = lines.map((line) => line.split(","));
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
