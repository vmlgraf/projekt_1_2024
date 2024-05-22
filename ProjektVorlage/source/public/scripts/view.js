class View {
    constructor() {
        this.app = document.getElementById('app');
        this.noteForm = document.getElementById('form');
        this.titleInput = document.getElementById('title');
        this.descriptionInput = document.getElementById('description');
        this.importanceSelect = document.getElementById('importance');
        this.duedateInput = document.getElementById('duedate');
        this.noteList = document.getElementById('noteList');
        this.taskModal = document.getElementById('taskModal');
        this.closeModalButton = document.querySelector('.close');
        this.addNoteButton = document.getElementById('openPopup');

        this.addNoteButton.onclick = () => this.taskModal.style.display = 'block';
        this.closeModalButton.onclick = () => this.taskModal.style.display = 'none';
        window.onclick = (event) => {
            if (event.target == this.taskModal) {
                this.taskModal.style.display = "none";
            }
        };
    }

    set onAddNote(handler) {
        this.noteForm.addEventListener('submit', event => {
            event.preventDefault();
            if (this.titleInput.value) {
                handler({
                    title: this.titleInput.value,
                    description: this.descriptionInput.value,
                    importance: this.importanceSelect.value,
                    duedate: this.duedateInput.value
                });
                this.titleInput.value = '';
                this.descriptionInput.value = '';
                this.importanceSelect.value = 'low';
                this.duedateInput.value = '';
                this.taskModal.style.display = 'none';
            }
        });
    }

    displayNotes(notes) {
        while (this.noteList.firstChild) {
            this.noteList.removeChild(this.noteList.firstChild);
        }

        notes.forEach(note => {
            const noteElement = document.createElement('tr');
            noteElement.innerHTML = `
                <td><input type="checkbox" ${note.completed ? 'checked' : ''}></td>
                <td>${note.title}</td>
                <td>${note.description}</td>
                <td>${note.importance}</td>
                <td>${note.duedate}</td>
                <td><button onclick="handleEdit(${note.id})">Bearbeiten</button></td>
            `;
            this.noteList.appendChild(noteElement);
        });
    }
}
