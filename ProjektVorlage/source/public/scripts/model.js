class Model {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem("todos")) || [];
    }

    addNote(note) {
        this.notes.push(note);
        this.commit();
    }

    commit() {
        localStorage.setItem("todos", JSON.stringify(this.notes));
        this.onNoteListChanged(this.notes);
    }

    set onNoteListChanged(callback) {
        this.onNoteListChanged = callback;
    }

    // Weiterer Code für Bearbeiten, Löschen, Filtern und Sortieren
}
