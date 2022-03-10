const $notes = document.getElementById('notes')
const $form = document.getElementById('form')
const $add = document.getElementById('add')
const $clear = document.getElementById('clear')

let noteId = 0

function init() {
    if (localStorage.getItem('noteId') != null) {
        for (let i = 0; i <= localStorage.getItem('noteId'); i++) {
            let note = localStorage.getItem(i)
            if (note != null) displayNote(JSON.parse(note))
            noteId = i
        }
    } else localStorage.setItem('noteId', noteId)
}

// Add note
$form.addEventListener('submit', function (e) {
    e.preventDefault()
    
    if ($form.elements.title.value == '' && $form.elements.text.value == '') {
        $form.classList.add('required')
        return
    } else {
        $form.classList.remove('required')
    }

    noteId++
    let note = {
        id: noteId,
        title: $form.elements.title.value,
        text: $form.elements.text.value
    }

    displayNote(note)

    $form.elements.title.value = ''
    $form.elements.text.value = ''
    
    localStorage.setItem(noteId, JSON.stringify(note))
    localStorage.setItem('noteId', noteId)
})

// clear all notes
$clear.addEventListener('click', function (e) {
    if (confirm('Whoa! You sure you want to delete all your notes?')) {
        localStorage.clear()
        $notes.innerHTML = '<h1>Existing Notes</h1>'
        noteId = 0
        init()
    }
})

// delete a note
$notes.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete')) {
        const $parent = e.target.parentElement
        let id = $parent.querySelector('.id').textContent
        
        localStorage.removeItem(id)
        
        $parent.remove()
    }
})

function displayNote(note) {
    $notes.innerHTML += `
    <div class='note'>
        <h2>${note.title}</h2>
        <p>${note.text}</p>
        <span class=id>${note.id}</span>
        <button class='delete'>X</button>
    </div>`
}

init()

const $search = document.getElementById('search')

let timer = null

$search.addEventListener('keydown', function () {
    if (timer != null) clearTimeout(timer)
    
    timer = setTimeout(search, 500)
    
})

function search() {
    let query = $search.value.toLowerCase()

    init()
    
    if (query == '') return
    
    for (const key in localStorage) {
        if (parseInt(key)) {
            
        
            const note = JSON.parse(localStorage[key])

            const $note = document.getElementById('note=' + note.id)
            
            if ($note == null) continue
            
            if (note.title.includes(query) || note.text.includes(query)) {
                $note.classList.add('highlight') 
                //search result

            } else {
                //remove
                
                $note.remove()

            }
            let results = $notes.children.length
            if (results == 0) {
                $notes.innerHTML = '<span class="results>No results found</span>'
            } else {
                $notes.innerHTML = '<span class="results">Search results: ${results} </span>' +$notes.innerHTML
            }
            }
        }
    }
        
    

