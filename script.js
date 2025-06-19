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

            const btnDelete = document.createElement("button");
            btnDelete.textContent = "";
            btnDelete.onclick = () => deleteItem(item.Id);
            btnDelete.className = "fas fa-xmark";

            const btnEdit = document.createElement("button");
            btnEdit.textContent = "";
            btnEdit.onclick = () => editItem(item);
            btnEdit.className = "fas fa-edit";


            li.appendChild(btnDelete)
            li.appendChild(btnEdit);
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

function deleteItem(id) {
    fetch('api.php', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `id=${id}`
    }).then(() => loadItems());
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

window.onload = loadItems;