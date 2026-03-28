let db;

// DB open
const request = window.indexedDB.open("pdfList", 3);

// ❌ Error
request.onerror = event => {
    console.error("Database error:", request.error);
};

// 🔥 DB READY HERE
request.onsuccess = event => {
    db = event.target.result;
    console.log("Database opened successfully");
};

// DB first time create / version change
request.onupgradeneeded = event => {
    db = event.target.result;

    if (!db.objectStoreNames.contains("users")) {
        db.createObjectStore("users", { keyPath: "id" });
    }

    console.log("Object store created!");
};

let item = 0;

window.AddPdf = (id) => {
    console.log("Calling AddPdf");

    const input = document.getElementById(id);

    input.addEventListener("change", function (event) {

        // 🔴 SAFETY CHECK (very important)
        if (!db) {
            alert("Database अभी ready नहीं हुई. 1 sec बाद try करो.");
            return;
        }

        let file = event.target.files[0];

        if (file) {
            let transaction = db.transaction("users", "readwrite");
            let store = transaction.objectStore("users");

            store.put({
                id: item++,
                name: file.name,
                file: file
            });

            transaction.oncomplete = () => {
                console.log("PDF stored successfully!");
            };

            transaction.onerror = () => {
                console.error("Transaction failed");
            };
        }
    });
};

window.GetAllPdfs = async () => {

    return new Promise((resolve, reject) => {

        if (!db) {
            reject("DB not ready");
            return;
        }

        let transaction = db.transaction("users", "readonly");
        let store = transaction.objectStore("users");
        let request = store.getAll();

        request.onsuccess = async (event) => {

            let records = event.target.result;
            let resultList = [];

            for (let record of records) {

                let base64 = await blobToBase64(record.file);

                resultList.push({
                    id: record.id,
                    name: record.name,
                    base64: base64
                });
            }

            resolve(resultList);
        };

        request.onerror = () => reject("Read failed");
    });
};

// Blob → Base64 converter
function blobToBase64(blob) {
    return new Promise((resolve) => {
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result);
    });
}