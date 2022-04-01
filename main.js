const url = 'https://crudcrud.com/api/9c8077b60df749f6a8c911c80cf6143c/notes';

const form = document.getElementById('form');
const noteTitle = document.getElementById('note-title');
const note = document.getElementById('note');
const serverError = document.getElementById('server-error');
const allNotes = document.getElementById('all-notes');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log(noteTitle.value);
    console.log(note.value);
    const data = {
        title: noteTitle.value, 
        body: note.value
    };
    fetch(url, {
        method: 'POST', 
        body: JSON.stringify(data), 
        // mode: 'no-cors',
        cache: 'no-cache',  
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    }).then((response) => {
        if(!response.ok) {
            serverError.textContent = "Oh, something's wrong, your note was not saved on server :(";
            serverError.style.display = 'block';
        }
    }).then(() => {
        noteTitle.value = '';
        note.value = '';
        getFromServer()
    })
});

function getFromServer () {
    fetch(url).then((response) => {
        if(response.ok) {
            return response.json();
        } else {
            serverError.textContent = "Oh, something's wrong, your note was not fetched from server :(";
            serverError.style.display = 'block';
        }
    }).then((data) => {
        console.log(data);
        const arrOfElements = [];
        data.forEach((element) => {
            const noteElement = document.createElement('div');
            noteElement.id = 'note-element';
            //allNotes.append(noteElement);
            const noteElementTitle = document.createElement('div');
            noteElementTitle.id = 'note-element-title';
            const noteElementBody = document.createElement('div');
            noteElementBody.id = 'note-element-body';
            const noteElementButton = document.createElement('button');
            noteElementButton.id = 'note-remove-button';
            noteElementButton.textContent = 'Remove';
            noteElementButton.addEventListener('click', () => {
                removeNote(element._id)
            });
            noteElement.append(noteElementTitle, noteElementBody, noteElementButton);

            noteElementTitle.textContent = element.title;
            noteElementBody.textContent = element.body;

            arrOfElements.unshift(noteElement);
        })
        allNotes.style.display = 'grid';
        allNotes.replaceChildren(...arrOfElements);
    })
}

function removeNote (id) {
    const urlForDelete = `${url}/${id}`;
    fetch(urlForDelete, {
        method: 'DELETE'
    }).then((response) => {
        if (!response.ok) {
            serverError.textContent = "Oh, something's wrong, your note was not deleted from server :(";
            serverError.style.display = 'block';
        }
    }).then(getFromServer)
};

getFromServer();