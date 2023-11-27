// PdfViewerComponent.tsx
import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "../styles/PDFViewer.css"; // Ensure this points to your CSS file location

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PdfViewerProps {
  document: ArrayBuffer;
}

interface PageInfoProps {
  currentPage: number;
  numPages: number;
  handlePageChange: (page: number) => void;
}

const PageInfo: React.FC<PageInfoProps> = ({ currentPage, numPages, handlePageChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNumber = inputRef.current?.value;
    if (pageNumber) {
      const parsedPageNumber = parseInt(pageNumber, 10);
      if (!isNaN(parsedPageNumber) && parsedPageNumber >= 1 && parsedPageNumber <= numPages) {
        handlePageChange(parsedPageNumber);
      }
    }
  };

  return (
    <div className="page-info">
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          ref={inputRef}
          min="1"
          max={numPages}
          placeholder={`Page 1 - ${numPages}`}
        />
        <button type="submit">Go</button>
      </form>
      <div>
        Page {currentPage} of {numPages}
      </div>
    </div>
  );
};

const PdfViewerComponent: React.FC<PdfViewerProps> = ({ document }) => {
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const viewerRef = useRef<HTMLDivElement>(null);

  const handlePageLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (viewerRef.current) {
      viewerRef.current.scrollIntoView();
    }
  };

  return (
    <div className="pdf-viewer" ref={viewerRef}>
      <PageInfo currentPage={currentPage} numPages={numPages} handlePageChange={handlePageChange} />
      <Document file={document} onLoadSuccess={handlePageLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderTextLayer={false}
            onLoadSuccess={() => handlePageChange(index + 1)}
          />
        ))}
      </Document>
    </div>
  );
};

export default PdfViewerComponent;
