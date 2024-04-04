const fs = require('fs');
const path = require('path');


const file_path = '../randcsv/test_data1.csv';
rmLastLineOfCSV(file_path);


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



    // 以下、関数内でのみ有効な関数定義
    function checkExpectedError() {
        if (!fs.existsSync(file_path)) {
            throw new Error("No such file or directory:", file_path);
        }
    }
}
