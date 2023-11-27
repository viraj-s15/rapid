import { open } from "@tauri-apps/api/dialog";
import { readBinaryFile, writeBinaryFile } from "@tauri-apps/api/fs";
import { listen } from "@tauri-apps/api/event";
import React, { useEffect, useCallback, useRef, useState } from "react";

import PdfViewerComponent from "./components/PDFViewer";
import "./App.css";

enum STATES {
  IDLE = "IDLE",
  OPENING_FILE = "OPENING_FILE",
  EDITING_FILE = "EDITING_FILE",
  SAVING_FILE = "SAVING_FILE",
}

interface AppProps {}

function App({}: AppProps): JSX.Element {
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const pspdfkitInstance = useRef<any>(null);
  const currentState = useRef<STATES>(STATES.IDLE);

  useEffect(() => {
    const openFile = async () => {
      try {
        const selectedPaths = await open({
          multiple: false,
        });
        const selectedPath = Array.isArray(selectedPaths) ? selectedPaths[0] : selectedPaths;

        if (!selectedPath) return;
        const content = await readBinaryFile(selectedPath);
        setFileBuffer(content.buffer);
        setFilePath(selectedPath);
        currentState.current = STATES.EDITING_FILE;
      } catch (err) {
        console.error(err);
        currentState.current = STATES.IDLE;
      }
    };

    const saveFile = async () => {
      console.log("Save file activated: ", filePath, " ", pspdfkitInstance.current);
      if (!filePath || !pspdfkitInstance.current) {
        currentState.current = STATES.EDITING_FILE;
        return;
      }

      try {
        const buffer = await pspdfkitInstance.current.exportPDF();
        await writeBinaryFile(filePath, buffer);
        currentState.current = STATES.EDITING_FILE;
      } catch (error) {
        currentState.current = STATES.EDITING_FILE;
      }
    };

    listen("menu-event", (e) => {
      if (
        e.payload === "open-event" &&
        [STATES.IDLE, STATES.EDITING_FILE].includes(currentState.current)
      ) {
        currentState.current = STATES.OPENING_FILE;
        openFile();
      } else if (e.payload === "save-event" && currentState.current === STATES.EDITING_FILE) {
        currentState.current = STATES.SAVING_FILE;
        saveFile();
      }
    });
  }, [currentState, filePath]);

  return (
    <div className="App">
      <div className="PDF-viewer">
        {fileBuffer ? <PdfViewerComponent document={fileBuffer} /> : null}
      </div>
    </div>
  );
}

export default App;
