document.addEventListener("DOMContentLoaded", function () {
  // Existing dataset download button
  const datasetBtn = document.getElementById("downloadBtn");
  if (datasetBtn) {
    datasetBtn.addEventListener("click", function () {
      window.location.href = "/download_csv";  // Already in your backend
    });
  }

  // New PDF download button
  const pdfBtn = document.getElementById("downloadPdfBtn");
  if (pdfBtn) {
    pdfBtn.addEventListener("click", function () {
      window.location.href = "/download_pdf";  // Backend route to serve PDF
    });
  }
});
