//add pdf js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = "lib/pdf/dist/pdf.worker.js";

//Get first page of pdf
window.pdfService = {
    renderFirstPage: async function (pdfUrl, canvasId) {
        console.log("pdf service file work!");
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const page = await pdf.getPage(1);

        const scale = 1.5;
        const viewport = page.getViewport({ scale: scale });

        const canvas = document.getElementById(canvasId);
        const context = canvas.getContext('2d');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        await page.render(renderContext).promise;

        return canvas.toDataURL("image/png"); // PNG data वापस देगा
    },

     renderFirstPageImage: async function (pdfUrl) {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const page = await pdf.getPage(1);

        const scale = 1.5;
        const viewport = page.getViewport({ scale: scale });

        // Offscreen canvas (DOM में नहीं दिखेगा)
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        await page.render(renderContext).promise;

        // सिर्फ़ image data वापस करेगा
        return canvas.toDataURL("image/png");
    }

};
