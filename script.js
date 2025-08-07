function loadItems(){
    fetch('api.php')
    .then(res => res.json())
    .then(items => {
        const container = document.getElementById("categories-container");
        container.innerHTML = "";
        
        const categories = {};
        items.forEach(item => {
            const kategoria = item.Kategoria || 'Inne';
            if (!categories[kategoria]) {
                categories[kategoria] = [];
            }
            categories[kategoria].push(item);
        });
        
        const selectElement = document.querySelector('select');
        const categoryOrder = [];
        if (selectElement) {
            for (let i = 0; i < selectElement.options.length; i++) {
                categoryOrder.push(selectElement.options[i].value);
            }
        }
        
        const sortedCategories = Object.keys(categories).sort((a, b) => {
            const indexA = categoryOrder.indexOf(a);
            const indexB = categoryOrder.indexOf(b);
            
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            
            return indexA - indexB;
        });
        
        sortedCategories.forEach(categoryName => {
            const categoryItems = categories[categoryName];
            
            const categoryDiv = document.createElement("div");
            categoryDiv.className = "category-section";
            
            const categoryHeader = document.createElement("h2");
            categoryHeader.textContent = categoryName;
            categoryHeader.className = "category-header";
            categoryDiv.appendChild(categoryHeader);
            
            const categoryList = document.createElement("ol");
            categoryList.className = "todo-list category-list";
            categoryList.id = "list-" + categoryName.replace(/[^a-zA-Z0-9]/g, '-');
            
            categoryItems.forEach(item => {
                const li = document.createElement("li");
                li.className = "task-item";
                li.id = "item-" + item.Id;
                if (item.Wykreslone == 1) {
                    li.classList.add("checked");
                }

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
                categoryList.appendChild(li);
            });
            
            categoryDiv.appendChild(categoryList);
            container.appendChild(categoryDiv);
        });
        
        updateRoundedCorners();
    });
}

function updateRoundedCorners() {
    const categoryLists = document.querySelectorAll('.category-list');
    
    categoryLists.forEach(list => {
        const allItems = list.querySelectorAll('.task-item');
        const uncheckedItems = list.querySelectorAll('.task-item:not(.checked)');
        
        allItems.forEach(item => {
            item.classList.remove('first-unchecked', 'last-unchecked', 'before-last-unchecked', 'after-first-unchecked');
        });
        
        if (uncheckedItems.length > 0) {
            const firstUnchecked = uncheckedItems[0];
            firstUnchecked.classList.add('first-unchecked');
            
            const lastUnchecked = uncheckedItems[uncheckedItems.length - 1];
            lastUnchecked.classList.add('last-unchecked');
            
            const beforeLastUnchecked = lastUnchecked.previousElementSibling;
            if (beforeLastUnchecked && beforeLastUnchecked.classList.contains('checked')) {
                beforeLastUnchecked.classList.add('before-last-unchecked');
            }
            
            const afterFirstUnchecked = firstUnchecked.nextElementSibling;
            if (afterFirstUnchecked && afterFirstUnchecked.classList.contains('checked')) {
                afterFirstUnchecked.classList.add('after-first-unchecked');
            }
        }
    });
}

function addItem() {
    const input = document.getElementById('item');
    const select = document.querySelector('select');
    const itemName = input.value.trim();
    if (!itemName) return;

    const selectedOption = select.querySelector('option.active') || select.querySelector('option:checked');
    const kategoria = selectedOption ? selectedOption.value : 'Inne';

    fetch('api.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `action=add&item=${encodeURIComponent(itemName)}&kategoria=${encodeURIComponent(kategoria)}`
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

function initializeSelect() {
    const select = document.querySelector('select');
    const input = document.getElementById('item');
    
    if (select && input) {
        const firstOption = select.querySelector('option:first-child');
        if (firstOption) {
            firstOption.classList.add('active');
            firstOption.selected = true;
        }
        
        select.addEventListener('mousedown', function(e) {
            if (e.target.tagName === 'OPTION') {
                e.preventDefault();
                e.stopPropagation();
                
                for (let option of select.options) {
                    option.selected = false;
                    option.classList.remove('active');
                }
                
                e.target.selected = true;
                e.target.classList.add('active');
                
                setTimeout(() => {
                    input.focus();
                    select.style.display = 'block';
                    select.style.opacity = '1';
                    select.style.transform = 'translateY(0)';
                }, 10);
                
                return false;
            }
        });
        
        select.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
        });
        
        input.addEventListener('focus', function() {
            select.style.display = 'block';
            select.style.opacity = '1';
            select.style.transform = 'translateY(0)';
        });
        
        document.addEventListener('click', function(e) {
            const container = input.parentElement;
            if (container && !container.contains(e.target)) {
                select.style.display = 'none';
                select.style.opacity = '0';
                select.style.transform = 'translateY(-5px)';
                input.blur();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                select.style.display = 'none';
                select.style.opacity = '0';
                select.style.transform = 'translateY(-5px)';
                input.blur();
            }
        });
    }
}

window.onload = function() {
    loadItems();
    initializeSelect();
};