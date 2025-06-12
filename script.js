function loadItems(){
    fetch('api.php')
    .then(res => res.json())
    .then(items => {
        const list = document.getElementById("list");
        list.innerHTML = "";
        items.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item.Nazwa;

            const btnDelete = document.createElement("button");
            btnDelete.textContent = "Usuń";
            btnDelete.onclick = () => deleteItem(item.Id);

            const btnEdit = document.createElement("button");
            btnEdit.textContent = "Edytuj";
            btnEdit.onclick = () => editItem(item);


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