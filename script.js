const $notes = document.getElementById('notes')
const $form = document.getElementById('form')
const $add = document.getElementById('add')
const $clear = document.getElementById('clear')

let noteId = 0

function init() {
    $notes.innerHTML = ''
    if (localStorage.getItem('noteId') != null) {
        for (let i = 0; i <= localStorage.getItem('noteId'); i++) {
            let note = localStorage.getItem(i)
            if (note != null) displayNote(JSON.parse(note))
            noteId = i
        }
    } else localStorage.setItem('noteId', noteId)

    if ($notes.innerHTML == '') {
        $notes.innerHTML = '<div class="empty">Nothing to see here</div>'
    }
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
    const now = new Date()
    const date = [now.getDay(), now.getMonth(), now.getFullYear()].join('/')
    const time = [now.getHours(), now.getMinutes()].join(':')
    let note = {
        id: noteId,
        title: $form.elements.title.value,
        text: $form.elements.text.value,
        timestamp: time + ' - ' + date
    }

    if (document.querySelector('.empty') != null) {
        document.querySelector('.empty').remove()
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
        search()
    }
})


function displayNote(note) {
    $notes.innerHTML += `
    <div class='note' id='note-${note.id}'>
        <h2>${note.title}</h2>
        <p>${note.text}</p>
        <span class='timestamp'>Created ${note.timestamp}</span>
        <span class=id>${note.id}</span>
        <button class='delete'>X</button>
    </div>`
}

init()


const $search = document.getElementById('search')
const $searchBtn = document.getElementById('searchBtn')

function search() {
    let query = $search.value.toLowerCase()
    init()

    if (query == '') return

    for (const entry in localStorage) {
        if (parseInt(entry)) {
            let note = JSON.parse(localStorage[entry])
            const $target = document.getElementById('note-' + note.id)
            if ($target == null) continue
            
            if (!note.title.toLowerCase().includes(query) && !note.text.toLowerCase().includes(query)) {
                $target.remove()
            } else {
                $target.classList.add('highlight')
            }
        }
    }

    if ($notes.children.length == 0) {
        $notes.innerHTML = '<span class="results">No results found</span>'
    } else {
        $notes.innerHTML = `<span class="results">Search results: ${$notes.children.length}</span>` + $notes.innerHTML
    }
}

let timer = null
$search.addEventListener('keydown', function () {
    timer = setTimeout(search, 500)
})
