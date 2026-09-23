const en = {
  appName: "PDF Toolbox",
  prototypeLabel: "P1 architecture probe",
  selectPdf: "Select PDF",
  viewerLabel: "PDF first-page preview",
  canvasUnavailable: "Could not create the page canvas.",
  unknownError: "An unknown error occurred.",
  emptyStatus: "No file open",
  loadingStatus: (fileName: string) => `Opening ${fileName}`,
  readyStatus: (fileName: string, pageCount: number, fileSize: string) =>
    `${fileName} · ${pageCount} ${pageCount === 1 ? "page" : "pages"} · ${fileSize}`,
  passwordStatus: (fileName: string) =>
    `${fileName} requires a password. This architecture prototype will not attempt to decrypt it.`,
  errorStatus: (fileName: string, message: string) => `${fileName}: ${message}`,
  emptyTitle: "Read-only prototype",
  emptyDescription:
    "Choose a test copy. This version cannot save, overwrite, or modify the PDF.",
} as const;

export default en;
