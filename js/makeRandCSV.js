const fs = require('fs');
const path = require('path');



const write_dir_path = '../randcsv/';
const length_per_line = 4;
const number_of_csvs = 100;
const skip_row = 1;
const max_column = 1000;
const max_value = 100;
makeRandCSV(write_dir_path, length_per_line, number_of_csvs, skip_row, max_column, max_value);

// 注意）同名のファイルがある場合は上書きされる。
// CSVを作成するディレクトリの相対パス、1行あたりの要素数、作成するファイル数、ヘッダー行数、最大行数、データ最大値.
// string, int, int, int, int, int -> void
function makeRandCSV(dir_path, length_per_line, number_of_csvs=1, skip_row=1, max_column=400, max_value=100) {
    dir_path = path.join(__dirname, dir_path);
    console.log(`\n----makeRandCSV(): your inputs are below----\ndir_path: ${dir_path}\nlength_per_line: ${length_per_line}\nnumber_of_csvs: ${number_of_csvs}\nskip_row: ${skip_row}\nmax_column: ${max_column}\nmax_value: ${max_value}\n`);
    checkExpectedError();

    let success_count = 0;
    for (let i = 0; i < number_of_csvs; i++) {
        let file_name = "test" + (i+1) + ".csv";
        let file_path = path.join(dir_path, file_name);
        let data = [];
        let column_number = randInt(max_column);
        for (let j = 0; j < column_number; j++) {
            let line = [];
            for (let k = 0; k < length_per_line; k++) {
                line.push(randFloat(max_value));
            }
            data.push(line);
        }
    
        try {
            let csv_content = "";
            for (let j = 0; j < skip_row; j++) {
                for (let k = 0; k < length_per_line; k++) {
                    if (k < length_per_line - 1) {
                        csv_content += "header" + (k+1) + ',';
                    } else {
                        csv_content += "header" + (k+1) + '\n';
                    }
                }
            }
            data.forEach(arr => {
                csv_content += arr.join(',') + '\n';
            });
            fs.writeFile(file_path, csv_content, err => {
                if (err) { throw new Error("Failed to write file: " + err) }
            });
            success_count++;
            // console.log("[" + (i+1) + "/" + number_of_csvs + "] SUCCEEDED in making CSV file: " + file_path);
            // console.log("[" + success_count + "/" + number_of_csvs + "]");
        } catch (error) {
            console.error("[" + (i+1) + "/" + number_of_csvs + "] FAILED to make CSV file.\n" + error);
        }
    }

    if (success_count == number_of_csvs) {
        console.log("ALL SUCCEEDED in making CSV files. [" + success_count + "/" + number_of_csvs + "]\n");
    } else {
        console.log("\nSOME FAILED to make CSV files. [" + success_count + "/" + number_of_csvs + "]\n");
    }



    // ---内部で使用している関数たち
    function checkExpectedError() {
        if (!fs.existsSync(dir_path)) {
            throw new Error("1st argument (dir_path) is not a directory or does not exist: " + dir_path);
        }
        if (length_per_line < 1 || !Number.isInteger(length_per_line)) {
            throw new Error("2nd argument (length_per_line) must be a integer and positive.");
        }
        if (number_of_csvs < 1 || !Number.isInteger(number_of_csvs)) {
            throw new Error("3rd argument (number_of_csvs) must be a integer and positive.");
        }
        if (skip_row < 0 || !Number.isInteger(skip_row)) {
            throw new Error("4th argument (skip_row) must be a integer and 0 or over.");
        }
        if (max_column < 0) {
            throw new Error("5th argument (max_column) must be 0 or over.");
        }
        if (max_value < 0) {
            throw new Error("6th argument (max_value) must be 0 or over.");
        }
    }

    function randFloat(max, min=0) {
        let rand = Math.round( Math.random() * (max - min) * 10 ) / 10 + min;
        return rand;
    }

    function randInt(max, min=0) {
        let rand = Math.round( Math.random() * (max - min) ) + min;
        return rand;
    }
}
