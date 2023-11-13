import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function PdfViewerComponent(props) {
  const containerRef = useRef(null);
  const [numPages, setNumPages] = useState(1);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100vh" }}>
      <Document
        file={props.document}
        options={{
          cMapUrl: "/cmaps/",
          cMapPacked: true,
        }}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
      <div>
        <p>Page 1 of {numPages}</p>
      </div>
    </div>
  );
}
