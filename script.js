function loadItems(){
    fetch('api.php')
    .then(res => res.json())
    .then(items => {
        const list = document.getElementById("list");
        list.innerHTML = "";
        items.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item.Nazwa;
            li.className = "task-item";
            li.id = "item-" + item.Id;
            if (item.Wykreslone == 1) {
                li.classList.add("checked");
            }

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

            const span = document.createElement("span");

            span.appendChild(btnCheck);
            span.appendChild(btnEdit);
            span.appendChild(btnDelete);
            li.appendChild(span);
            list.appendChild(li);
        });
    });
}

function addItem() {
    const input = document.getElementById('item');
    const itemName = input.value.trim();
    if (!itemName) return;

    fetch('api.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `item=${encodeURIComponent(itemName)}`
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
            method: 'DELETE',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `id=${itemToDeleteId}`
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
    const newName = prompt("Edytuj nazwę:", item.Nazwa);
    if (newName) {
        fetch('api.php', {
            method: 'PUT',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `id=${item.Id}&item=${encodeURIComponent(newName)}`
        }).then(() => loadItems());
    }
}

function checkItem(id, currentChecked){
    const newChecked = currentChecked == 1 ? 0 : 1;
    fetch('api.php', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `id=${id}&Wykreslone=${newChecked}`
    }).then(() => loadItems());
}

function deleteAllConfirmation() {
    const confirmation = document.getElementById("conf");
    confirmation.style.display = "flex";
}

function deleteAll() {
    fetch('api.php', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: 'all=1'
    }).then(() => loadItems());
    const confirmation = document.getElementById("conf");
    confirmation.style.display = "none";
}

function cancelConfirmationAll(){
    const confirmation = document.getElementById("conf");
    confirmation.style.display = "none";
}

window.onload = loadItems;