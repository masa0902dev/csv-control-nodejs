## makeRandCSV()
You can make random csv files with below parameters.  
It helps you check whether a system works correctly.  
Be Careful: If the same name files already exist, these are overwritten.

- dir_path: directory path for generating csv files.
- length_per_line: the number of data for 1 line.
- nember_of_csvs: the number of csv files you generate.
- skip_row: the number of lines of header.
- max_column: the max number of column.
- max_value: the max value of each data.


## readAllLineCSV()
You can read all lines of 1 csv file excluded a header.


## readLastNLineCSV()
You can read last N lines of 1 csv file.  
If the csv file has a blank line in a last line, it is ignored.


## rmAllLastLineOfCSV()
You can remove a last line of csv files that exist in a specified directory path.  
If the csv files has a blank line in a last line, it is ignored.


## rmLastLineOfCSV()
You can remove a last line of a csv file you specified.  
If the csv file has a blank line in a last line, it is ignored.


## writeNewCSV()
You can write some data on a specified new csv file.  
If the csv file does not exist, a new file is generated and write data in. If the csv file exists, this function throws an error.


## appendInCSV()
You can append some data on a specified csv file.  
If the csv file does not exist, a new file is generated and write data in. If the csv file exists, appends the data.  
If the length of data you want to append is different from the length of a line in existing csv file, this function throws an error.
