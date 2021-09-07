class TagList {
    
    #checkBoxReadonly = document.querySelector("#chb-readonly");
    #itemsContainer = document.querySelector('#items');
    #items = new Set();

    constructor(items) {
        this.#items = this.load(items);
    }

    get itemsSource() {
        return this.#items;
    }
    set itemsSource(value) {
        this.#items = this.load(value);
    }
    
    add() {
        if (this.isReadonly()) {
            //alert('readonly');
            showMessage("Can't write data: mode is readonly");
            return;
        }
        
        const input = document.querySelector('#input-title');    
        const value = input.value;

        this.#addByName(value);

        input.value = "";
    }

    delete(tag) {
        if (this.isReadonly()) {
            //alert('readonly');
            showMessage("Can't write data: mode is readonly");
            return;
        }
        
        const value = tag.parentElement.previousElementSibling.textContent;
        this.#items.delete(value);
    
        console.log(`item '${value}' deleted`)
        tag.closest('.block__item').remove();
    }
    
    clear() {
        if (this.isReadonly()) {
            //alert('readonly');
            showMessage("Can't write data: mode is readonly");
            return;
        }
    
        this.#items.clear();
        while(this.#itemsContainer.firstChild) {
            this.#itemsContainer.removeChild(this.#itemsContainer.firstChild);
        }
    }

    load(items) {
        if (this.isReadonly()) {
            return this.#items;
        }

        this.clear();
        if (!items?.size) {
            return new Set();
        }
        for (let item of items) {
            this.#addByName(item);
        }
        return items;
    }

    isReadonly() {
        return this.#checkBoxReadonly.checked;
    }

    // Private 

    #addByName(value) {
        if (!value) {
            showMessage("Input tag's title");
            //alert("input tag's title");
        } else if (!this.#items.has(value)) {
            const classThis = this;
            this.#items.add(value);
            this.#itemsContainer.appendChild(this.#createTag(
                value, 
                function() {
                    classThis.delete(this);
                })
            );
            return true;
        } else {
            // alert('this tag is already exists');
            showMessage("This tag is already exists");
            return false;
        }
    }

    #createTag(text, handler) {
        const block__item = document.createElement('div');
        block__item.classList.add('block__item');
    
        const item = document.createElement('div');
        item.classList.add('item');
    
        const item__content = document.createElement('div');
        item__content.classList.add('item__content');
    
        const item__text = document.createElement('div');
        item__text.classList.add('item__text');
    
        const item__delete = document.createElement('div');
        item__delete.classList.add('item__delete');
    
        const img = document.createElement('img');
        img.src = "img/delete-button.svg"
        img.classList.add('icon-delete');
    
        block__item.appendChild(item);
        item.appendChild(item__content);
        item__content.appendChild(item__text);
        item__content.appendChild(item__delete);
        item__delete.appendChild(img);
    
        item__text.textContent = text;
        img.onclick = handler;
    
        return block__item;
    }
}

function getItems() {
    const items = JSON.parse(localStorage.getItem('tags'));
    let set = new Set(items)
    return set;
}

function saveItems(items) {
    let toSave = JSON.stringify(items);
    localStorage.setItem('tags', toSave)
    return toSave;
}

function save_handler() {
    let values = list.itemsSource.values();
    let arr = Array.from(values);

    const saved = saveItems(arr);

    showMessage(`Data successfully saved (size: ${arr.length})`);
    console.log("saved: " + saved);
}

function load_handler() {
    if (list.isReadonly()) {
        showMessage("Cannot load data: mode is readonly");
        return;
    }

    const items = getItems();
    list.load(items);

    showMessage("Data loaded. Size: " + items.size);
    console.log("loaded: " + items);
}

function showMessage(text) {
    const message = document.querySelector('.settings__message');
    message.textContent = text;
    message.classList.toggle('show');
    const id = setTimeout(
        function() {
            message.classList.remove('show');
        }, 
        3000 
    );
}

let savedItems = getItems();
let list = new TagList(savedItems);