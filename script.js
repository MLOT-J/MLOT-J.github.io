function loadItems(){
    fetch('api.php')
    .then(res => res.json())
    .then(items => {
        const list = document.getElementById("list");
        list.innerHTML = "";
        items.forEach(item => {
            const li = document.createElement("li");
            li.className = "task-item";
            li.id = "item-" + item.Id;
            if (item.Wykreslone == 1) {
                li.classList.add("checked");
            }

            // Tworzymy osobny span na tekst
            const textSpan = document.createElement("span");
            textSpan.textContent = item.Nazwa;
            textSpan.className = "item-text";

            const btnDelete = document.createElement("button");
            btnDelete.textContent = "";
            btnDelete.onclick = () => deleteItemConfirmation(item.Id);
            btnDelete.className = "fas fa-xmark";
            btnDelete.id = "xmark";

            const btnEdit = document.createElement("button");
            btnEdit.textContent = "";
            btnEdit.onclick = () => editItem(item);
            btnEdit.className = "fas fa-edit";

            const btnCheck = document.createElement("button");
            btnCheck.textContent = "";
            btnCheck.onclick = () => checkItem(item.Id, item.Wykreslone);
            btnCheck.className = "fas fa-check";

            const actionsSpan = document.createElement("span");
            actionsSpan.className = "actions";
            actionsSpan.appendChild(btnCheck);
            actionsSpan.appendChild(btnEdit);
            actionsSpan.appendChild(btnDelete);

            li.appendChild(textSpan);
            li.appendChild(actionsSpan);
            list.appendChild(li);
        });
        
        // Aktualizuj zaokrąglone rogi dla nieskreślonych elementów
        updateRoundedCorners();
    });
}

function updateRoundedCorners() {
    const allItems = document.querySelectorAll('.task-item');
    const uncheckedItems = document.querySelectorAll('.task-item:not(.checked)');
    
    // Usuń wszystkie klasy zaokrąglenia
    allItems.forEach(item => {
        item.classList.remove('first-unchecked', 'last-unchecked', 'before-last-unchecked', 'after-first-unchecked');
    });
    
    if (uncheckedItems.length > 0) {
        // Pierwszy nieskreślony element
        const firstUnchecked = uncheckedItems[0];
        firstUnchecked.classList.add('first-unchecked');
        
        // Ostatni nieskreślony element
        const lastUnchecked = uncheckedItems[uncheckedItems.length - 1];
        lastUnchecked.classList.add('last-unchecked');
        
        // Element przed ostatnim nieskreślonym (żeby ukryć dolną linię)
        const beforeLastUnchecked = lastUnchecked.previousElementSibling;
        if (beforeLastUnchecked && beforeLastUnchecked.classList.contains('checked')) {
            beforeLastUnchecked.classList.add('before-last-unchecked');
        }
        
        // Element po pierwszym nieskreślonym (żeby dodać górną linię)
        const afterFirstUnchecked = firstUnchecked.nextElementSibling;
        if (afterFirstUnchecked && afterFirstUnchecked.classList.contains('checked')) {
            afterFirstUnchecked.classList.add('after-first-unchecked');
        }
    }
}

function addItem() {
    const input = document.getElementById('item');
    const itemName = input.value.trim();
    if (!itemName) return;

    fetch('api.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `action=add&item=${encodeURIComponent(itemName)}`
    }).then(() => {
        input.value = '';
        loadItems();
    });
}

let itemToDeleteId = null;

function deleteItemConfirmation(id) {
    itemToDeleteId = id;
    const confirmation = document.getElementById("conf2");
    confirmation.style.display = "flex";
}

function deleteItem() {
    if(itemToDeleteId !== null){
        fetch('api.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `action=delete&id=${itemToDeleteId}`
        }).then(() => loadItems());
        itemToDeleteId = null;
    }
    
    const confirmation = document.getElementById("conf2");
    confirmation.style.display = "none";
}

function cancelConfirmation(){
    const confirmation = document.getElementById("conf2");
    confirmation.style.display = "none";
    itemToDeleteId = null;
}

function editItem(item) {
    document.body.classList.add("editing-active");

    const li = document.getElementById("item-" + item.Id);
    li.classList.add("editing");

    const textSpan = li.querySelector(".item-text");
    const actionsSpan = li.querySelector(".actions");
    textSpan.style.display = "none";
    actionsSpan.style.display = "none";

    const input = document.createElement("input");
    input.type = "text";
    input.value = item.Nazwa;
    input.className = "edit-input";
    li.insertBefore(input, textSpan);

    const editButtons = document.createElement("span");
    editButtons.className = "edit-actions";

    const saveBtn = document.createElement("button");
    saveBtn.id = "save-edit";
    saveBtn.className = "fas fa-check";
    saveBtn.onclick = finishEdit;

    const cancelBtn = document.createElement("button");
    cancelBtn.id = "cancel-edit";
    cancelBtn.className = "fas fa-xmark";
    cancelBtn.onclick = () => {
        removeOutsideClick();
        endEditMode();
        loadItems();
    };

    editButtons.appendChild(saveBtn);
    editButtons.appendChild(cancelBtn);
    li.insertBefore(editButtons, actionsSpan);

    input.focus();

    function finishEdit() {
        removeOutsideClick();
        endEditMode();
        const newName = input.value.trim();
        if (newName && newName !== item.Nazwa) {
            fetch('api.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: `action=edit&id=${item.Id}&item=${encodeURIComponent(newName)}`
            }).then(() => loadItems());
        } else {
            loadItems();
        }
    }

    input.addEventListener("keydown", function(e){
        if(e.key === "Enter") finishEdit();
        if(e.key === "Escape") {
            removeOutsideClick();
            endEditMode();
            loadItems();
        }
    });

    function handleOutsideClick(e) {
        if (!li.contains(e.target)) {
            removeOutsideClick();
            endEditMode();
            loadItems();
        }
    }

    function removeOutsideClick() {
        document.removeEventListener("mousedown", handleOutsideClick);
    }

    function endEditMode() {
        document.body.classList.remove("editing-active");
        li.classList.remove("editing");
    }

    setTimeout(() => {
        document.addEventListener("mousedown", handleOutsideClick);
    }, 0);
}

function checkItem(id, currentChecked){
    const newChecked = currentChecked == 1 ? 0 : 1;
    fetch('api.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `action=toggle_check&id=${id}&Wykreslone=${newChecked}`
    }).then(() => loadItems());
}

function deleteAllConfirmation() {
    const confirmation = document.getElementById("conf");
    confirmation.style.display = "flex";
}

function deleteAll() {
    fetch('api.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: 'action=delete_all'
    }).then(() => loadItems());
    const confirmation = document.getElementById("conf");
    confirmation.style.display = "none";
}

function cancelConfirmationAll(){
    const confirmation = document.getElementById("conf");
    confirmation.style.display = "none";
}

window.onload = loadItems;