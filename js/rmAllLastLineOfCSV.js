const fs = require('fs');
const path = require('path');



const dir_path = '../randcsv/';
rmAllLastLineOfCSV(dir_path);



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
