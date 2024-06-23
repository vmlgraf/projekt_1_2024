class Model {
    constructor() {
        this.notes = [];
        this.sortDirection = 1;
        this.currentSortKey = '';
        this.baseUrl = 'http://localhost:3000/notes';
        this.fetchNotes();
    }

    async fetchNotes() {
        const response = await fetch(this.baseUrl);
        this.notes = await response.json();
        this.onNoteListChanged(this.notes);
    }

    async addNote (note) {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(note)
        });
        const newNote = await response.json();
        this.notes.push(newNote);
        this.onNoteListChanged(this.notes);
    }

    async editNote (index, updatedNote) {
        await fetch(`${this.baseUrl}/${index}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedNote)
        });
        this.notes[index] = updatedNote;
        this.onNoteListChanged(this.notes);
    }

    async deleteNote (index) {
        await fetch(`${this.baseUrl}/${index}`, {
            method: 'DELETE'
        });
        this.notes.splice(index, 1);
        this.onNoteListChanged(this.notes);
    }

    async toggleNoteStatus (index) {
        const note = this.notes[index];
        note.status = note.status === 'done' ? 'not done' : 'done';
        await this.editNote(index, note);
    }

    sortNotes = (key) => {
        if (this.currentSortKey === key) {
            this.sortDirection *= -1;
        } else {
            this.sortDirection = 1;
            this.currentSortKey = key;
        }

        this.notes.sort((a, b) => {
            let aValue = a[key];
            let bValue = b[key];

            if (key === 'duedate') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            } else if (key === 'importance') {
                const importanceOrder = { 'low': 1, 'medium': 2, 'high': 3 };
                aValue = importanceOrder[aValue];
                bValue = importanceOrder[bValue];
            } else {
                aValue = aValue.toString().toLowerCase();
                bValue = bValue.toString().toLowerCase();
            }

            return (aValue < bValue ? -1 : 1) * this.sortDirection;
        });

        this.onNoteListChanged(this.notes);
        return { key: this.currentSortKey, direction: this.sortDirection };
    }

    filterNotes = (status) => {
        return status === 'all' ? this.notes : this.notes.filter(note => note.status === status);
    }

    bindNoteListChanged(callback) {
        this.onNoteListChanged = callback;
    }
}

export default Model;
