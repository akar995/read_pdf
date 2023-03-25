import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import * as XLSX from 'xlsx';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function App() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const extractTableFromPdf = async (pdfData) => {
    try {
      // Get the first page of the PDF
      const pdf = await pdfjs.getDocument({ data: pdfData }).promise;
      const page = await pdf.getPage(1);

      // Get the text content of the page
      const textContent = await page.getTextContent();

      // Find the table in the text content
      const table = textContent.items.find((item) => item.str.includes('Route'));
console.log('====================================');
console.log(textContent);
console.log('====================================');
      // Convert the table to an array of arrays
      const tableRows = table.str.split('\n').map((row) => row.split('\t'));

      // Convert the table to an Excel workbook
      const worksheet = XLSX.utils.aoa_to_sheet(tableRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Table Sheet');

      // Save the Excel workbook as a file
      // XLSX.writeFile(workbook, 'table.xlsx');
    } catch (error) {
      console.error(error);
    }
  };

  const handlePdfUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsArrayBuffer(file);

    reader.onload = () => {
      const pdfData = new Uint8Array(reader.result);
      extractTableFromPdf(pdfData);
    };
  };

  const handlePageChange = ({ pageNumber }) => {
    setPageNumber(pageNumber);
  };

  const renderPdf = () => {
    return (
      <>
        <Document file="example.pdf" onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
          <Page pageNumber={pageNumber} onLoadSuccess={handlePageChange} />
        </Document>
        <p>
          Page {pageNumber} of {numPages}
        </p>
      </>
    );
  };

  return (
    <div className="App">
      <div className="App-header">
      <input type="file" onChange={handlePdfUpload} />
      {numPages && renderPdf()}
      </div>
    </div>
  );
}

export default App;
