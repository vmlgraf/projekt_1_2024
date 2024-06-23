class View {
    constructor() {
        this.noteForm = document.getElementById('form');
        this.statusInput = document.getElementById('status');
        this.titleInput = document.getElementById('title');
        this.descriptionInput = document.getElementById('description');
        this.importanceSelect = document.getElementById('importance');
        this.duedateInput = document.getElementById('duedate');
        this.noteList = document.getElementById('noteList');
        this.taskModal = document.getElementById('taskModal');
        this.closeModalButton = document.querySelector('.close');
        this.addNoteButton = document.getElementById('openPopup');
        this.filterSelect = document.getElementById('filter');
        this.darkModeButton = document.getElementById('darkmode');

        this.addNoteButton.onclick = () => {
            this.resetForm();
            this.openModal();
        };
        this.closeModalButton.onclick = () => this.closeModal();
        window.onclick = (event) => {
            if (event.target === this.taskModal) {
                this.closeModal();
            }
        };

        this.filterSelect.addEventListener('change', (event) => {
            this.onFilterChange(event.target.value);
        });

        this.darkModeButton.onclick = () => this.toggleDarkMode();
    }

    bindAddNote = (handler) => {
        this.noteForm.addEventListener('submit', event => {
            event.preventDefault();
            const index = this.noteForm.dataset.index;
            const noteData = {
                status: this.statusInput.value,
                title: this.titleInput.value,
                description: this.descriptionInput.value,
                importance: this.importanceSelect.value,
                duedate: this.duedateInput.value
            };

            if (index === '') {
                handler(noteData);
            } else {
                handler(noteData, index);
            }
            this.resetForm();
            this.closeModal();
        });
    }

    bindEditNote = (handler) => {
        this.noteList.addEventListener('click', event => {
            if (event.target.classList.contains('edit-button')) {
                const index = event.target.dataset.index;
                handler(index);
            }
        });
    }

    bindDeleteNote = (handler) => {
        this.noteList.addEventListener('click', event => {
            if (event.target.classList.contains('delete-button')) {
                const index = event.target.dataset.index;
                handler(index);
            }
        });
    }

    bindToggleNoteStatus = (handler) => {
        this.noteList.addEventListener('click', event => {
            if (event.target.classList.contains('status-button')) {
                const index = event.target.dataset.index;
                handler(index);
            }
        });
    }

    bindSortNotes = (handler) => {
        document.querySelectorAll('th[data-key]').forEach(header => {
            header.addEventListener('click', () => {
                const key = header.getAttribute('data-key');
                this.clearSortIcons();
                const { key: sortedKey, direction } = handler(key);
                if (sortedKey === key) {
                    header.classList.add(direction === 1 ? 'sort-asc' : 'sort-desc');
                }
            });
        });
    }

    clearSortIcons = () => {
        document.querySelectorAll('th[data-key]').forEach(header => {
            header.classList.remove('sort-asc', 'sort-desc');
        });
    }

    bindFilterNotes = (handler) => {
        this.onFilterChange = handler;
    }

    toggleDarkMode = () => {
        document.body.classList.toggle('dark-mode');
    }

    displayNotes = (notes) => {
        this.noteList.innerHTML = notes.map((note, index) => `
            <tr class="${note.status === 'done' ? 'done' : ''}">
                <td>${this.translateStatus(note.status)}</td>
                <td>${note.title}</td>
                <td>${note.description}</td>
                <td>${this.translateImportance(note.importance)}</td>
                <td>${this.formatDate(note.duedate)}</td>
                <td>
                    <button class="button edit-button" data-index="${index}">Bearbeiten</button>
                    <button class="button status-button" data-index="${index}">Status ändern</button>
                    <button class="button delete-button" data-index="${index}">Löschen</button>
                </td>
            </tr>
        `).join('');
    }

    translateStatus = (status) => status === 'done' ? 'Erledigt' : 'Offen';

    translateImportance = (importance) => {
        const importanceMap = {
            'low': 'Niedrig',
            'medium': 'Mittel',
            'high': 'Hoch'
        };
        return importanceMap[importance] || importance;
    }

    formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
    }

    resetForm = () => {
        this.noteForm.reset();
        this.noteForm.dataset.index = '';
    }

    openModal = () => {
        this.taskModal.style.display = 'flex';
    }

    closeModal = () => {
        this.taskModal.style.display = 'none';
    }

    setFormData = (note, index) => {
        this.statusInput.value = note.status;
        this.titleInput.value = note.title;
        this.descriptionInput.value = note.description;
        this.importanceSelect.value = note.importance;
        this.duedateInput.value = note.duedate;
        this.noteForm.dataset.index = index;
        this.openModal();
    }
}

export default View;
