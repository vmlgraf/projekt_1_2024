document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("taskModal");
    const btnOpenPopup = document.getElementById("openPopup");
    const spanClose = document.getElementsByClassName("close")[0];
    const form = document.getElementById("form");
    const status = document.getElementById("status");
    const title = document.getElementById("title");
    const description = document.getElementById("description");
    const importance = document.getElementById("importance");
    const duedate = document.getElementById("duedate");
    const filter = document.getElementById('filter');
    const noteList = document.getElementById('noteList');
    const darkModeButton = document.getElementById("darkmode");
    let notes = JSON.parse(localStorage.getItem("todos")) || [];
    let sortDirection = 1;  // 1 for ascending, -1 for descending
    let currentSortKey = ''; // Current key being sorted

    function openModal() {
        modal.style.display = "flex";
    }

    function closeModal() {
        modal.style.display = "none";
    }

    btnOpenPopup.addEventListener('click', function() {
        form.reset();
        form.dataset.index = '';
        openModal();
    });

    filter.addEventListener('change', function() {
        renderNotes();
    });

    spanClose?.addEventListener('click', closeModal);

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const index = form.dataset.index;
        const noteData = {
            status: status.value,
            title: title.value,
            description: description.value,
            importance: importance.value,
            duedate: duedate.value
        };

        if (index === '') {
            notes.push(noteData);
        } else {
            notes[index] = noteData;
        }

        localStorage.setItem("todos", JSON.stringify(notes));
        renderNotes();
        closeModal();
    });

    noteList.addEventListener('click', function(event) {
        if (event.target.classList.contains('edit-button')) {
            const index = event.target.dataset.index;
            const note = notes[index];
            status.value = note.status;
            title.value = note.title;
            description.value = note.description;
            importance.value = note.importance;
            duedate.value = note.duedate;
            form.dataset.index = index;
            openModal();
        } else if (event.target.classList.contains('delete-button')) {
            const index = event.target.dataset.index;
            notes.splice(index, 1);
            localStorage.setItem("todos", JSON.stringify(notes));
            renderNotes();
        } else if (event.target.classList.contains('status-button')) {
            const index = event.target.dataset.index;
            const note = notes[index];
            note.status = (note.status === 'done') ? 'not done' : 'done';
            notes[index] = note;
            localStorage.setItem("todos", JSON.stringify(notes));
            renderNotes();
        }
    });

    darkModeButton.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
    });

    function sortNotes(key) {
        if (currentSortKey === key) {
            sortDirection *= -1;
        } else {
            sortDirection = 1;
        }
        currentSortKey = key;

        notes.sort((a, b) => {
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

            if (aValue < bValue) return -1 * sortDirection;
            if (aValue > bValue) return sortDirection;
            return 0;
        });

        renderNotes();
        updateSortIcons(key);
    }

    function updateSortIcons(key) {
        document.querySelectorAll('th i').forEach(icon => {
            icon.classList.remove('fa-sort-up', 'fa-sort-down');
            icon.classList.add('fa-sort');
        });

        const header = document.querySelector(`th[data-key="${key}"] i`);
        if (sortDirection === 1) {
            header.classList.remove('fa-sort');
            header.classList.add('fa-sort-up');
        } else {
            header.classList.remove('fa-sort');
            header.classList.add('fa-sort-down');
        }
    }

    function renderNotes() {
        noteList.innerHTML = '';
        const selectedFilter = filter.value;
        notes.forEach((note, index) => {
            if (selectedFilter === 'all' || note.status === selectedFilter) {
                const noteElement = document.createElement('tr');
                noteElement.className = note.status === 'done' ? 'done' : '';
                const displayStatus = note.status === 'done' ? 'Erledigt' : 'Offen';
                const displayImportance = translateImportance(note.importance);
                noteElement.innerHTML = `
                    <td>${displayStatus}</td>
                    <td>${note.title}</td>
                    <td>${note.description}</td>
                    <td>${displayImportance}</td>
                    <td>${formatDate(note.duedate)}</td>
                    <td>
                        <button class="button edit-button" data-index="${index}">Bearbeiten</button>
                        <button class="button status-button" data-index="${index}">Status ändern</button>
                        <button class="button delete-button" data-index="${index}">Löschen</button>
                    </td>
                `;
                noteList.appendChild(noteElement);
            }
        });
    }

    function translateImportance(importance) {
        const importanceMap = {
            'low': 'Tief',
            'medium': 'Mittel',
            'high': 'Hoch'
        };
        return importanceMap[importance] || importance;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    renderNotes();

    // Bind the sortNotes function to clickable table headers
    document.querySelectorAll('th').forEach(header => {
        const key = header.dataset.key;
        header.addEventListener('click', () => sortNotes(key));
    });

    function getKey(headerText) {
        const keyMap = {
            'status': 'status',
            'titel': 'title',
            'beschreibung': 'description',
            'wichtigkeit': 'importance',
            'faelligkeitsdatum': 'duedate'
        };
        return keyMap[headerText] || headerText;
    }
});
