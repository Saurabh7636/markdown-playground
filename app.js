// Elements
const markdownInput = document.getElementById("markdownInput");
const previewContent = document.getElementById("previewContent");
const downloadBtn = document.getElementById("downloadBtn");
const previewBtn = document.getElementById("previewBtn");
const activityLogContent = document.getElementById("activityLogContent");

let logEntries = JSON.parse(localStorage.getItem("logEntries")) || [];

// Convert Markdown to HTML and update preview
function updatePreview() {
    const markdownText = markdownInput.value;
    const htmlContent = marked.parse(markdownText); // Convert markdown to HTML using marked.js
    previewContent.innerHTML = htmlContent
        .replace(/<h1>/g, '<h1 class="font-bold text-2xl mb-2">')
        .replace(/<h2>/g, '<h2 class="font-semibold text-xl mb-1">')
        .replace(/<p>/g, '<p class="mb-2 leading-relaxed">')
        .replace(/<ul>/g, '<ul class="list-disc ml-6 my-2">')
        .replace(/<ol>/g, '<ol class="list-decimal ml-6 my-2">') // For ordered lists
        .replace(/<li>/g, '<li class="mb-1">')
        .replace(/<a/g, '<a class="text-blue-600 underline hover:text-blue-800"');

    adjustPreviewHeight(); // Adjust the height of the preview dynamically
}

// Adjust the height of the preview section based on content
function adjustPreviewHeight() {
    const previewHeight = previewContent.scrollHeight;
    previewContent.style.height = `${previewHeight}px`; // Set the height of the preview content
}

// Log changes to activity log
function logActivity() {
    const markdownText = markdownInput.value;
    const timestamp = new Date().toLocaleString();
    
    // Add new log entry
    logEntries.push({ text: markdownText, timestamp });
    localStorage.setItem("logEntries", JSON.stringify(logEntries)); // Save to local storage
    updateActivityLog();
}

// Update activity log display
function updateActivityLog() {
    activityLogContent.innerHTML = logEntries
        .map((entry, index) => `
            <div class="flex justify-between items-center py-2 border-b">
                <div class="flex-1 cursor-pointer" onclick="editLog(${index})">
                    <strong>${entry.timestamp}:</strong> ${entry.text.slice(0, 30)}...
                </div>
                <button class="text-blue-500 hover:text-blue-700" onclick="previewLog(${index})">Preview</button>
                <button class="text-red-500 hover:text-red-700" onclick="deleteLog(${index})">Delete</button>
            </div>
        `).join('');
}

// Edit log entry
function editLog(index) {
    const entry = logEntries[index];
    markdownInput.value = entry.text;
    updatePreview();
}

// Preview log entry
function previewLog(index) {
    const entry = logEntries[index];
    markdownInput.value = entry.text; // Load log text into the editor
    updatePreview(); // Update the preview section
}

// Delete log entry
function deleteLog(index) {
    logEntries.splice(index, 1); // Remove the log entry
    localStorage.setItem("logEntries", JSON.stringify(logEntries)); // Update local storage
    updateActivityLog(); // Update log display
}

// Listen for input changes in the editor
markdownInput.addEventListener("input", updatePreview);

// Initial Preview Update
updatePreview();

// Load logs from local storage on page load
window.addEventListener("load", () => {
    updateActivityLog(); // Display stored logs
});

// Preview the current input and log it
previewBtn.addEventListener("click", () => {
    logActivity(); // Log the current content
    updatePreview(); // Update the preview section
});

// Download Resume as PDF
downloadBtn.addEventListener("click", () => {
    const { jsPDF } = window.jspdf; // Access jsPDF from window object
    const pdf = new jsPDF();

    pdf.html(previewContent, {
        callback: function (doc) {
            doc.save("markdown.pdf"); // Save the PDF
        },
        x: 10,
        y: 10,
        width: 190, // You can adjust width and height
        windowWidth: 650 // Use windowWidth for rendering
    });
});
