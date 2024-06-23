import Model from './model.js';
import View from './view.js';

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.model.bindNoteListChanged(this.onNoteListChanged);
        this.view.bindAddNote(this.handleAddNote);
        this.view.bindEditNote(this.handleEditNote);
        this.view.bindDeleteNote(this.handleDeleteNote);
        this.view.bindToggleNoteStatus(this.handleToggleNoteStatus);
        this.view.bindSortNotes(this.handleSortNotes);
        this.view.bindFilterNotes(this.handleFilterNotes);

        this.currentFilter = 'all';
        this.model.fetchNotes();
    }

    onNoteListChanged = (notes) => {
        const filteredNotes = this.model.filterNotes(this.currentFilter);
        this.view.displayNotes(filteredNotes);
    }

    handleAddNote = (note, index) => {
        if (index !== undefined) {
            this.model.editNote(index, note);
        } else {
            this.model.addNote(note);
        }
    }

    handleEditNote = (index) => {
        const note = this.model.notes[index];
        this.view.setFormData(note, index);
    }

    handleDeleteNote = (index) => {
        this.model.deleteNote(index);
    }

    handleToggleNoteStatus = (index) => {
        this.model.toggleNoteStatus(index);
    }

    handleSortNotes = (key) => {
        return this.model.sortNotes(key);
    }

    handleFilterNotes = (status) => {
        this.currentFilter = status;
        this.onNoteListChanged(this.model.notes);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new Controller(new Model(), new View());
});
