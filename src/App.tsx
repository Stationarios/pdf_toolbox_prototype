import { useEffect, useRef, useState } from "react";
import {
  GlobalWorkerOptions,
  getDocument,
  type PDFDocumentLoadingTask,
} from "pdfjs-dist";
import "./App.css";
import messages from "./i18n/en";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type ViewState =
  | { kind: "empty" }
  | { kind: "loading"; fileName: string }
  | { kind: "ready"; fileName: string; pageCount: number; fileSize: number }
  | { kind: "password"; fileName: string }
  | { kind: "error"; fileName: string; message: string };

const formatBytes = (bytes: number) => {
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;

  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }

  return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
};

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadingTaskRef = useRef<PDFDocumentLoadingTask | null>(null);
  const operationRef = useRef(0);
  const [view, setView] = useState<ViewState>({ kind: "empty" });

  useEffect(() => {
    return () => {
      void loadingTaskRef.current?.destroy();
    };
  }, []);

  const openFile = async (file: File) => {
    const operation = operationRef.current + 1;
    operationRef.current = operation;
    setView({ kind: "loading", fileName: file.name });

    await loadingTaskRef.current?.destroy();
    loadingTaskRef.current = null;

    const canvas = canvasRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);

    let passwordRequested = false;

    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const loadingTask = getDocument({
        data: bytes,
        enableXfa: false,
      });
      loadingTaskRef.current = loadingTask;

      loadingTask.onPassword = () => {
        if (operation !== operationRef.current) {
          void loadingTask.destroy();
          return;
        }

        passwordRequested = true;
        setView({ kind: "password", fileName: file.name });
        void loadingTask.destroy();
      };

      const pdf = await loadingTask.promise;
      if (operation !== operationRef.current) {
        await loadingTask.destroy();
        return;
      }

      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.25 });
      const target = canvasRef.current;
      const context = target?.getContext("2d", { alpha: false });

      if (!target || !context) {
        throw new Error(messages.canvasUnavailable);
      }

      const pixelRatio = window.devicePixelRatio || 1;
      target.width = Math.floor(viewport.width * pixelRatio);
      target.height = Math.floor(viewport.height * pixelRatio);
      target.style.width = `${Math.floor(viewport.width)}px`;
      target.style.height = `${Math.floor(viewport.height)}px`;

      await page.render({
        canvas: target,
        canvasContext: context,
        viewport,
        transform: pixelRatio === 1 ? undefined : [pixelRatio, 0, 0, pixelRatio, 0, 0],
      }).promise;

      if (operation === operationRef.current) {
        setView({
          kind: "ready",
          fileName: file.name,
          pageCount: pdf.numPages,
          fileSize: file.size,
        });
      }
    } catch (error) {
      if (operation !== operationRef.current || passwordRequested) {
        return;
      }

      const message = error instanceof Error ? error.message : messages.unknownError;
      setView({ kind: "error", fileName: file.name, message });
    }
  };

  const statusText = (() => {
    switch (view.kind) {
      case "empty":
        return messages.emptyStatus;
      case "loading":
        return messages.loadingStatus(view.fileName);
      case "ready":
        return messages.readyStatus(
          view.fileName,
          view.pageCount,
          formatBytes(view.fileSize),
        );
      case "password":
        return messages.passwordStatus(view.fileName);
      case "error":
        return messages.errorStatus(view.fileName, view.message);
    }
  })();

  return (
    <main className="app-shell">
      <header className="toolbar">
        <div>
          <p className="eyebrow">{messages.prototypeLabel}</p>
          <h1>{messages.appName}</h1>
        </div>
        <button type="button" onClick={() => inputRef.current?.click()}>
          {messages.selectPdf}
        </button>
        <input
          ref={inputRef}
          className="file-input"
          type="file"
          accept="application/pdf,.pdf"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            event.currentTarget.value = "";
            if (file) void openFile(file);
          }}
        />
      </header>

      <section className={`status status-${view.kind}`} aria-live="polite">
        {statusText}
      </section>

      <section className="viewer" aria-label={messages.viewerLabel}>
        {view.kind === "empty" && (
          <div className="empty-state">
            <strong>{messages.emptyTitle}</strong>
            <span>{messages.emptyDescription}</span>
          </div>
        )}
        <canvas ref={canvasRef} className={view.kind === "ready" ? "page-canvas" : "page-canvas hidden"} />
      </section>
    </main>
  );
}

export default App;
