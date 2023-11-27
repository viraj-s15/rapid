import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function PdfViewerComponent(props) {
  const [numPages, setNumPages] = useState(0);

  function onDocumentLoadSuccess({ numPages: totalNumPages }) {
    setNumPages(totalNumPages);
  }

  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      pages.push(<Page key={`page_${i}`} pageNumber={i} renderTextLayer={false} />);
    }
    return pages;
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Document file={props.document} onLoadSuccess={onDocumentLoadSuccess}>
        {renderPages()}
      </Document>
      <div>
        <p>Page 1 of {numPages}</p>
      </div>
    </div>
  );
}
