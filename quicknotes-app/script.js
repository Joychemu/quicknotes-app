// ==============================
// Select Elements
// ==============================

const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const searchInput = document.querySelector("#search-input");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");


// ==============================
// Load Notes from localStorage
// ==============================

let notes = JSON.parse(localStorage.getItem("quickNotes")) || [];


// ==============================
// Save Notes
// ==============================

function saveNotes() {
    localStorage.setItem("quickNotes", JSON.stringify(notes));
}


// ==============================
// Render Notes
// ==============================

function render() {
    notesList.textContent = "";

    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredNotes = notes.filter(function (note) {
        return note.text.toLowerCase().includes(searchTerm);
    });

    // Display search message when nothing matches
    if (filteredNotes.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.className = "empty-message";

        if (searchTerm !== "") {
            emptyMessage.textContent = "No notes match your search.";
        } else {
            emptyMessage.textContent = "No notes yet. Add your first note.";
        }

        notesList.appendChild(emptyMessage);
    }

    // Create a card for every matching note
    filteredNotes.forEach(function (note) {
        const listItem = document.createElement("li");
        listItem.classList.add(
            "note-card",
            `category-${note.category}`
        );

        const noteText = document.createElement("p");
        noteText.className = "note-text";
        noteText.textContent = note.text;

        const categoryLabel = document.createElement("span");
        categoryLabel.className = "category-label";
        categoryLabel.textContent =
            note.category.charAt(0).toUpperCase() +
            note.category.slice(1);

        const date = document.createElement("p");
        date.className = "note-meta";
        date.textContent = `Created: ${note.createdAt}`;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            deleteNote(note.id);
        });

        listItem.appendChild(categoryLabel);
        listItem.appendChild(noteText);
        listItem.appendChild(date);
        listItem.appendChild(deleteButton);

        notesList.appendChild(listItem);
    });

    updateCount();
}


// ==============================
// Update Note Count
// ==============================

function updateCount() {
    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }
}


// ==============================
// Add Note
// ==============================

noteForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = noteInput.value.trim();
    const category = noteCategory.value;

    // Empty note validation
    if (text === "") {
        errorMessage.textContent = "Please type a note first.";
        return;
    }

    // Character limit validation
    if (text.length > 200) {
        errorMessage.textContent =
            "Notes must be 200 characters or fewer.";
        return;
    }

    // Clear any previous error
    errorMessage.textContent = "";

    const newNote = {
        id: Date.now(),
        text: text,
        category: category,
        createdAt: new Date().toLocaleString()
    };

    notes.push(newNote);

    saveNotes();
    render();

    noteInput.value = "";
    noteCategory.value = "personal";
    noteInput.focus();
});


// ==============================
// Delete Note
// ==============================

function deleteNote(id) {
    notes = notes.filter(function (note) {
        return note.id !== id;
    });

    saveNotes();
    render();
}


// ==============================
// Search Notes
// ==============================

searchInput.addEventListener("input", function () {
    render();
});


// ==============================
// Initial Render
// ==============================

render();