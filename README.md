# Digital catalog of metrical books in Ukrainian archives

Table-formatted catalog based on the book series ["Зведений каталог метричних книг, що зберігаються в державних архівах України"](http://resource.history.org.ua/cgi-bin/eiu/history.exe?&I21DBN=ELIB&P21DBN=ELIB&S21STN=1&S21REF=10&S21FMT=brief_elib&C21COM=S&S21CNR=20&S21P01=0&S21SRW=nz&S21P02=0&S21P03=T=&S21COLORTERMS=0&S21STR=%D0%97%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%BC%D0%B5%D1%82%D1%80%D0%B8%D1%87%D0%BD%D0%B8%D1%85%20%D0%BA%D0%BD%D0%B8%D0%B3,%20%D1%89%D0%BE%20%D0%B7%D0%B1%D0%B5%D1%80%D1%96%D0%B3%D0%B0%D1%8E%D1%82%D1%8C%D1%81%D1%8F%20%D0%B2%20%D0%B4%D0%B5%D1%80%D0%B6%D0%B0%D0%B2%D0%BD%D0%B8%D1%85%20%D0%B0%D1%80%D1%85%D1%96%D0%B2%D0%B0%D1%85%20%D0%A3%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D0%B8). Check `assets` folder for PDF copies.

You can download already processed data in CSV format from the [latest release](https://github.com/duckarchive/catalog/releases/latest).

## How to use

1. Open `catalog` folder.
2. Download the CSV file with archive you are interested in.
3. Open the file with any spreadsheet software (e.g. Microsoft Excel, Google Sheets).
4. Use filters to search for specific records.

## Found a mistake?

If you found a mistake in the CSV files catalog, please create an issue with required information or create a pull request with the correct data.

## Development

> Note: This project is not in development stage, because the data is already extracted and formatted.

This repo contain the source code that used to extract and format data from the PDF files. If you want to contribute or modify the code, follow the steps below:

1. Clone the repository.
2. Install dependencies with `pnpm install`.
3. Scripts:
  - `parse:pdf-to-text` - extract data from PDF files to text files.
  - `parse:text-to-catalog` - parse text files to CSV files.
  - `dev` - run `parse:text-to-catalog` with `nodemon` and `tsx` for debugging.
  - `build` - build the project.

