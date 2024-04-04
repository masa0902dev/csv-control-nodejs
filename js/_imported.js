const { read } = require('fs');
const path = require('path');
const current_dir_path = __dirname;
const module_path = path.join(current_dir_path, '_module.js');
const exported = require(module_path);




// ----ランダムCSV作成----
// 指定した相対パスのディレクトリ内に、乱数によるCSVファイルを作成する。
// 注意）同名のファイルがある場合は上書きされる。
// 引数：CSVを作成するディレクトリの相対パス、1行あたりの要素数、作成するファイル数、ヘッダー行数、最大行数、データ最大値.
// string, int, int, int, int, int -> void
// function makeRandCSV(dir_path, length_per_line, number_of_csvs=1, skip_row=1, max_column=400, max_value=100) {
const makeRandCSV = exported.makeRandCSV;



// ----読み込み----
// 指定した相対パスのCSVファイル(1つ)のヘッダを除く全行を読み込み、二次元配列として返す。
// string, int -> array
// function readAllLineCSV(file_path, skip_row) {
const readAllLineCSV = exported.readAllLineCSV;

// 指定した相対パスのCSVファイル(1つ)の「行末からN行分」を読み込み、二次元配列として返す。
// string, int -> array
// function readLastNLineCSV(file_path, last_n_line=1) {
const readLastNLineCSV = exported.readLastNLineCSV;



// ----削除----
// 指定した相対パスのディレクトリ直下の全CSVファイルの(書き込みがある)行末を削除する。(注：行末に空白が２行あると書き込みのある行を削除できない)
// string -> void
// function rmAllLastLineOfCSV(dir_path) {
const rmAllLastLineOfCSV = exported.rmAllLastLineOfCSV;

// 指定した相対パスのCSVファイル(1つ)の(書き込みのある)行末を削除する。(注：行末に空白が２行あると書き込みのある行を削除できない)
// function rmLastLineOfCSV(file_path) {
const rmLastLineOfCSV = exported.rmLastLineOfCSV;



// ----作成・追記----
// 相対ファイルパスを指定して、二次元配列(一次も可能)をCSVファイルに書き込む。ヘッダは1行目のみ(指定なしならヘッダ行なし)。
// string, array, string -> void
// function writeCSV(file_path, record, header = "") {
const writeCSV = exported.writeCSV;

// 相対ファイルパスを指定して、二次元配列(一次も可能)をCSVファイルに追記する。
// string, array -> void
// function appendInCSV(file_path, record)
const appendInCSV = exported.appendInCSV;





// 注：このファイルは_module.jsと同階層なので、相対パスはこのファイルからの相対パスである。
makeRandCSV("../randcsv/", 4, 10, 1, 100, 1000);
readAllLineCSV("../randcsv/test_data1.csv", 1);
readLastNLineCSV("../randcsv/test_data1.csv", 3);    
rmAllLastLineOfCSV("../randcsv/");
rmLastLineOfCSV("../randcsv/test_data1.csv");
writeCSV("../randcsv/test_data1.csv", [[1,2,3,4], [5,6,7,8]], "a,b,c,d");
appendInCSV("../randcsv/test_data1.csv", [[9,9,9,9], [10,10,10,10], [11,11,11,11]]);
