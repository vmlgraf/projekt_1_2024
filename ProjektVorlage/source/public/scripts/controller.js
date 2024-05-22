class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.model.onNoteListChanged = notes => this.view.displayNotes(notes);
        this.view.onAddNote = this.handleAddNote;
        this.view.displayNotes(this.model.notes);
    }

    handleAddNote = note => {
        this.model.addNote(note);
    }
}
