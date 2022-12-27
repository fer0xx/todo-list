const taskList = {
    // Elements
    formElement: document.querySelector('#task-form'),
    inputElement: document.querySelector('#task-input'),
    listContainer: document.querySelector('#task-list'),

    // API functions
    load: function() {
        api.get().then((tasks) => {
            tasks.forEach((task) => {
                this.addToList(task);
            })
            console.log(tasks);
        });
    },
    create: function(description) {
        api.create({description: description})
            .then((task) => {
                this.addToList(task);
                this.inputElement.value = '';
                console.log(task);
            });
    },
    update: function(id, data, listItem) {
        api.update(id, data)
            .then((task) => {
                this.addToList(task, listItem);
                console.log(task);
            });
    },
    delete: function(id, listItem) {
        api.delete(id)
            .then(() => {
                listItem.remove();
            });
    },

    // Task list functions
    addToList: function(task, listItem) {
        const newLi = document.createElement('li');
        newLi.dataset.id = task._id;
        newLi.addEventListener('dblclick', this.editTask);

        newLi.appendChild(this.createCheckbox(task._id, task.done));
        if (task.done === true) {
            newLi.classList.add('task-done');
        }

        const descriptionElement = document.createElement('div');
        descriptionElement.innerHTML = task.description;
        descriptionElement.classList.add('task-description');
        newLi.appendChild(descriptionElement);

        newLi.appendChild(this.createDeleteButton(task._id));

        if (listItem) {
            // Replace the existing list item with a new one
            listItem.replaceWith(newLi);
        } else {
            // Add a new task to the list
            this.listContainer.appendChild(newLi);
        }
    },
    createCheckbox: function (id, done) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'task-done';

        checkbox.addEventListener('change', (event) => {
            const listItem = event.target.parentElement;
            this.update(
                id,
                {done: checkbox.checked},
                listItem
            );
            listItem.classList.toggle('task-done');
        });
        if (done === true) {
            checkbox.checked = done;
        }

        return checkbox;
    },
    createDeleteButton: function (id) {
        const button = document.createElement('button');
        const icon = document.createElement('i');
        icon.classList.add('fa-regular');
        icon.classList.add('fa-trash-can');
        button.appendChild(icon);

        button.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                this.delete(id, button.parentElement);
            }
        });

        return button;
    },
    editTask: function(event) {
        const listItem = event.currentTarget;
        const task = listItem.querySelector('.task-description');
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = task.innerHTML;
        editInput.classList.add('task-description');
        task.replaceWith(editInput);

        editInput.addEventListener('keypress', (event) => {
            if (event.key !== 'Enter') {
                return;
            }

            if (editInput.value === '') {
                this.delete(
                    listItem.dataset.id,
                    listItem
                );
            } else {
                this.update(
                    listItem.dataset.id,
                    {description: editInput.value},
                    listItem
                );
            }
        });
    }
};

// Load all existing tasks from the API
taskList.load();

// Create a new task
taskList.formElement.addEventListener('submit', function (event) {
    event.preventDefault();

    const taskDescription = taskList.inputElement.value;
    if (taskDescription === '') {
        alert('Nothing to do mate?');
        return;
    }

    taskList.create(taskDescription);
});
