import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PdfViewerProps {
  document: ArrayBuffer;
  onInstance?: (instance: any) => void;
}

export default function PdfViewerComponent(props: PdfViewerProps): JSX.Element {
  const [numPages, setNumPages] = useState(0);
  const documentRef = useRef<any>(null);

  useEffect(() => {
    if (props.onInstance && documentRef.current) {
      props.onInstance(documentRef.current);
    }
  }, [props.onInstance]);

  function onDocumentLoadSuccess({ numPages: totalNumPages }: { numPages: number }) {
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
      <Document
        file={props.document}
        onLoadSuccess={onDocumentLoadSuccess}
        inputRef={(ref) => {
          documentRef.current = ref;
        }}
      >
        {renderPages()}
      </Document>
      <div>
        <p>Page 1 of {numPages}</p>
      </div>
    </div>
  );
}
