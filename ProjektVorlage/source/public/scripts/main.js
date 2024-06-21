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
    const noteList = document.getElementById('noteList');
    let notes = JSON.parse(localStorage.getItem("todos")) || [];
    let sortDirection = 1;  // 1 für aufsteigend, -1 für absteigend

    function openModal() {
        modal.style.display = "block";
    }

    function closeModal() {
        modal.style.display = "none";
    }

    btnOpenPopup.addEventListener('click', function() {
        form.reset();
        form.dataset.index = '';
        openModal();
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
        }else if (event.target.classList.contains('status-button')) {
            const index = event.target.dataset.index;
            const note = notes[index];
            note.status = (note.status === 'done') ? 'not done' : 'done';
            notes[index] = note;
            localStorage.setItem("todos", JSON.stringify(notes));
            renderNotes();
        }
    });

    function sortNotes(key) {
        notes.sort((a, b) => {
            if (a[key] < b[key]) return -1 * sortDirection;
            if (a[key] > b[key]) return sortDirection;
            return 0;
        });
        sortDirection *= -1;  // Wechselt die Richtung für den nächsten Sortiervorgang
        renderNotes();
    }

    function renderNotes() {
        noteList.innerHTML = '';
        notes.forEach((note, index) => {
            const noteElement = document.createElement('tr');
            noteElement.innerHTML = `
                <td>${note.status}</td>
                <td>${note.title}</td>
                <td>${note.description}</td>
                <td>${note.importance}</td>
                <td>${note.duedate}</td>
                <td>
                    <button class="button edit-button" data-index="${index}">Bearbeiten</button>
                    <button class="button status-button" data-index="${index}">Fertig</button>
                    <button class="button delete-button" data-index="${index}">Löschen</button>
                </td>
            `;
            noteList.appendChild(noteElement);
        });
    }

    renderNotes();

    // Bind the sortTable function to clickable table headers
    document.querySelectorAll('th').forEach(header => {
        const key = header.textContent.trim().toLowerCase().replace('ä', 'a').replace('ü', 'u').replace('ö', 'o').replace('ß', 'ss').replace(/[^a-z]/gi, '');
        header.addEventListener('click', () => sortNotes(getKey(key)));
    });

    function getKey(headerText) {
        const keyMap = {
            'status': 'status',
            'titel': 'title',
            'beschreibung': 'description',
            'wichtigkeit': 'importance',
            'fälligkeitsdatum': 'duedate'
        };
        return keyMap[headerText] || headerText;
    }

});
