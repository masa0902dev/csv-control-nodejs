const fs = require('fs');
const path = require('path');




// 相対ファイルパスを指定して、二次元配列(一次も可能)をCSVファイルに追記する。
// string, array -> void
function appendInCSV(file_path, record) {
    const raw_file_path = file_path; //checkExpectedError()でrecordの長さチェックに使用
    file_path = path.join(__dirname, file_path);
    console.log(`\n----appendInCSV(): your inputs are below----\nfile_path: ${file_path}\nrecord: `);
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
                        throw new Error("The length of each array in 2nd argument (record) is dirrerent from the length of the last line in the CSV file.\n" + "Correct length: " + correct_line_length + "\nYour length: " + arr.length);
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



// 指定ディレクトリ内に乱数によるCSVファイルを作成する。
// 注意）同名のファイルがある場合は上書きされる。
// 引数；CSVを作成するディレクトリの相対パス、1行あたりの要素数、作成するファイル数、ヘッダー行数、最大行数、データ最大値.
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
            console.log("[" + success_count + "/" + number_of_csvs + "]");
        } catch (error) {
            console.error("[" + (i+1) + "/" + number_of_csvs + "] FAILED to make CSV file.\n" + error);
        }
    }

    if (success_count == number_of_csvs) {
        console.log("\nALL SUCCEEDED in making CSV files. [" + success_count + "/" + number_of_csvs + "]\n");
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



    // ---内部で使用している関数たち
    function checkExpectedError() {
        if (!fs.existsSync(file_path)) {
            throw new Error("No such file: " + file_path);
        }
        if (skip_row < 0 || !Number.isInteger(skip_row)) {
            throw new Error("2nd argument (skip_row) must be a integer and 0 or over.");
        }
    }
}



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



    // ---内部で使用している関数たち
    function checkExpectedError() {
        if (!fs.existsSync(file_path)) {
            throw new Error("No such file: " + file_path);
        }
        if (last_n_line < 1 || !Number.isInteger(last_n_line)) {
            throw new Error("2nd argument (last_n_line) must be a integer and positive.");
        }
    }
}



// 指定ディレクトリ直下の全CSVファイルの(書き込みがある)行末を削除する。(注：行末に空白が２行あると書き込みのある行を削除できない)
// string -> void
function rmAllLastLineOfCSV(dir_path) {
    dir_path = path.join(__dirname, dir_path);
    console.log(`\n----rmAllLastLineOfCSV(): your inputs are below----\ndir_path: ${dir_path}\n`);
    checkExpectedError();

    // csvファイルのみを抽出
    const files_and_dirs = fs.readdirSync(dir_path);
    const file_names = files_and_dirs.filter(file_name => {
        const extension = path.extname(file_name).toLowerCase();
        return extension == '.csv';
    });
    
    let file_path;
    let number_of_files = file_names.length;
    let success_count = 0;
    file_names.forEach((file_name,i) => {
        try {
            file_path = path.join(dir_path, file_name);
            let data = fs.readFileSync(file_path, 'utf8');
            let lines = data.split('\n');
            // 行末が空ならば、最後から2行目を削除。そうでなければ行末を削除。
            if (lines[lines.length - 1].trim() == '') {
                lines.splice(-2, 1);
            } else {
                lines.pop();
            }
            // 改行文字で連結して新しいデータを作成
            let new_data = lines.join('\n');
            // 最後の行を削除した内容で上書き
            fs.writeFile(file_path, new_data, err => {
                if (err) { throw new Error("Failed to write file: " + err) }
            });
            success_count++;
            // console.log("[" + (i+1) + "/" + number_of_files + "] SUCCEEDED in removing last line from: " + file_path);
            console.log("[" + success_count + "/" + number_of_files + "]");
        } catch (error) {
            console.error('\nFAILED to remove last line: ' + error + '\n');
        }
    });

    if (success_count == number_of_files) {
        console.log("\nALL SUCCEEDED in removing last line. [" + success_count + "/" + number_of_files + "]\n");
    } else {
        console.log("\nSOME FAILED to remove last line. [" + success_count + "/" + number_of_files + "]\n");
    }



    // ---内部で使用している関数たち
    function checkExpectedError() {
        if (!fs.existsSync(dir_path)) {
            throw new Error("No such directory:", dir_path);
        }
    }
}



// 指定CSVファイル(1つ)の(書き込みのある)行末を削除する。(注：行末に空白が２行あると書き込みのある行を削除できない)
function rmLastLineOfCSV(file_path) {
    file_path = path.join(__dirname, file_path);
    console.log(`\n----rmLastLineOfCSV(): your inputs are below----\file_path: ${file_path}\n`);
    checkExpectedError();
    
    try {
        let data = fs.readFileSync(file_path, 'utf8');
        let lines = data.split('\n');
        // 行末が空ならば、最後の2行目を削除。そうでなければ、最後の行を削除。
        if (lines[lines.length - 1].trim() === '') {
            lines.splice(-2, 1);
        } else {
            lines.pop();
        }
        // 改行文字で連結して新しいデータを作成
        let new_data = lines.join('\n');
        // 最後の行を削除した内容で上書き
        fs.writeFileSync(file_path, new_data);
        console.log('\nSUCCEEDED in removing last line from: ' + file_path + '\n');
    } catch (error) {
        console.error('\nFAILED to remove last line: ' + error + '\n');
    }



    // ---内部で使用している関数たち
    function checkExpectedError() {
        if (!fs.existsSync(file_path)) {
            throw new Error("No such file or directory:", file_path);
        }
    }
}



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
        console.log("SUCCESS: wrote in " + file_path);
    } catch (error) {
        throw new Error("FAILED to write: " + error);
    }



    // ---内部で使用している関数たち
    function checkExpectedError() {
        const dir_path = path.dirname(file_path);
        if (!fs.existsSync(dir_path)) {
            throw new Error("No sudh directory " + dir_path);
        }
        if (fs.existsSync(file_path)) {
            throw new Error("File already exists: " + file_path + "\nIf you want to append some data on a existing csv file, please use appendInCSV().");
        }
        if (!Array.isArray(record)) {
            throw new Error("2nd argument (record) must be an array.");
        }
        if (typeof header !== "string") {
            throw new Error("3rd argument (header) must be a string.");
        }
    }
}





module.exports = {
    appendInCSV: appendInCSV,
    makeRandCSV: makeRandCSV,
    readAllLineCSV: readAllLineCSV,
    readLastNLineCSV: readLastNLineCSV,
    rmAllLastLineOfCSV: rmAllLastLineOfCSV,
    rmLastLineOfCSV: rmLastLineOfCSV,
    writeCSV: writeCSV
}
