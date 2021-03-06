(($) => {
    'use strict';

    const API_URL = 'http://localhost:3000/tasks';
    const TASK_STATUS = {
        PENDING: 'PENDIENTE',
        DONE: 'TERMINADO'
    };

    class Task {
        constructor(description) {
            this.id = null;
            this.description = description;
            this.status = TASK_STATUS.PENDING;
            this.date = new Date().toUTCString();
        }
    }

    /**
     * This method is executed once the page have just been loaded and call the service to retrieve the
     * list of tasks
     */
    document.onreadystatechange = () => {

        //ITEM 0: Busca una función equivalente a document.onreadystatechange proveída por jQuery 
        //y asegurate que dentro se ejecute una función que llame al API con el método GET 
        //para recuperar la lista de tareas existentes. 
        let $tareas_pendientes = $('#incomplete-tasks');
        let $tareas_completadas = $('#completed-tasks');
        $.ajax({
            type: 'GET',
            url: `${API_URL}`,
            contentType: 'application/json',
            dataType: 'json',
            accept: {json: 'application/json'},
            success: function(tareas) {
                $.each(tareas, function(i, tarea){
                    if(tarea.status === TASK_STATUS.PENDING){
                        console.log(tarea.status + ' ' + tarea.description);
                        $tareas_pendientes.append('<li>'+
                        '<label><input type="checkbox"/>'+ tarea.description + '</label>'
                        +'<button class="edit">Editar</button>'+
                        '<button class="delete">Borrar</button>'+
                        '</li>');
                    } else{
                        console.log(tarea.status + ' completas');
                        $tareas_completadas.append(
                            '<label>'+
                                '<hr/>'+
                        '<input type="checkbox" checked>'+
                        tarea.description +
                        '</label> '+
                        ' <button class="edit">Editar</button> '+
                        ' <button class="delete">Borrar</button> ');
                    }
                });
            }
        });
        /*$(document).ready(function(){
            $.get(`${API_URL}`, null, (datos,status,jqxhr) => loadTasks(datos));
        });*/
    };

    /**
     * This method displays an error on the page.
     * @param code the status code of the HTTP response.
     * @param text error message
     */
    const showError = (code, text) => {
        // TODO ITEM 6: Agrega un elemento en la página HTML para mostrar los mensajes de error,
        //y desde la función showError() haz visible o invisible el elemento para mostrar el texto de error.
        //El error debe mostrarse solo por 5 segundos, luego de ésto, debe desaparecer.
        //No dudes en las clases css error-bar, hide-bar y show-bar en el archivo de estilos.
        //code: xhr.status
        //text: xhr.statusText
        
            
        $('.error-bar').html('Status: ' + code + '\nStatusText: ' + text);
        $('.error-bar').removeClass('hide-bar');
        $('.error-bar').addClass('show-bar');
    };


    /**
     * This method receives the list of tasks and calls the method to add each of them to the page
     *
     * @param array the string coming on the body of the API response
     */
    const loadTasks = (array) => {

        let tasks = array;
        for (let i in tasks) {
            if (tasks.hasOwnProperty(i)) {
                addTaskToList(tasks[i]);
            }
        }
    };

    /**
     * Send the request to the API to create a new task
     *
     * @param e the event from the click on the new item button
     * @return {boolean}
     */
    const addTask = (e) => {
        let content = $('#new-task').val();
        if (content.length === 0) return false;

        e.preventDefault();

        let task = new Task(content);
        $.ajax({
            type:"POST",
            url: `${API_URL}`, 
            data: task,
            contentType: 'application/json',
            dataType: 'json', // El tipo de datos esperados del servidor.
            accept: {json: 'application/json'},
            success: (data) => {
                addTaskToList(data);
                $('#new-task').val('');
            },
            error: function(data){
                showError(data.status, `addtask-Error: ${data.statusText}`)
            }
        });
        // ITEM 1: Dentro de la función addTask llamar al API con el método POST para crear una nueva tarea. 
        /*$("button.add").click(() => {
            $.post(`${API_URL}`, addTaskToList(task), 'application/json');
        });*/
        return false;
    };

    /**
     * This procedure links the new task button the addTask method on the click event.
     */
    let addButtons = document.getElementsByClassName('add');
    for (let i in addButtons)
        addButtons.item(Number(i)).onclick =  (e) => addTask(e);

    /**
     * We associate a function to manipulate the DOM once the checkbox value is changed.
     * Change the task to the completed or incomplete list (according to the status)
     */
    const addOnChangeEvent = (task) => {
        
            // TODO ITEM 3: Dentro de la función addOnChangeEvent, en el evento onchange del checkbox,
            //recuperar el nuevo valor del estado de la tarea, (si el checkbox está marcado significa 
            //que la tarea está terminada, sino, sigue pendiente) y colocar la tarea entre 
            //la lista de tareas que corresponda (tareas completadas o tareas pendientes). 
            //Una vez hecho ésto, llamar al API con el método PUT para guardar el nuevo estado de la tarea.
            const checkBox = document.getElementById(`task-${task.id}`).querySelector('label > input');
            checkBox.onchange = (e) => {

            $.ajax({
                url: `${API_URL}/${task.id}`,
                method: 'PUT',
                contentType: 'application/json',
                accept: {json: 'application/json'},
                data: JSON.stringify({status: e.target.checked ? "TERMINADO": "PENDIENTE"}),
                //{"key":"value"}
                success: function(data) {
                    // handle success
                    html_load = $(`#task-${task.id}`).find('li').html();
                    $(`#task-${task.id}`).find('li').remove();
                },
                error: function (xhr) {
                    showError(xhr.status, xhr.statusText);
                }
            });
        };
    };

    /**
     * This method modifies the DOM HTML to add new items to the task list.
     * @param task the new task.
     */
    const addTaskToList = (task) => {
        let $tareas_pendientes = $('#incomplete-tasks');
        let $tareas_completadas = $('#completed-tasks');
        let tipo = '';
        if(task.status === TASK_STATUS.PENDING){
            $tareas_pendientes.append('<li>'+
            '<label><input type="checkbox"/>'+ task.description + '</label>'
            +'<button class="edit">Editar</button>'+
            '<button class="delete">Borrar</button>'+
            '</li>');
            tipo = '#incomplete-tasks';
        } else{
            $tareas_completadas.append(
                '<label>'+
                    '<hr/>'+
            '<input type="checkbox" checked>'+
            task.description +
            '</label> '+
            ' <button class="edit">Editar</button> '+
            ' <button class="delete">Borrar</button> ');
            tipo = '#completed-tasks';
        }
        $(tipo +' .edit').click((e) => editTask(e));
        $(tipo +' .delete').click((e) => removeTask(e));
        addOnChangeEvent(task);
        /*let html = `<li id="task-${task.id}">
            <label><input type="checkbox" ${task.status === TASK_STATUS.DONE ? "checked" : ""}/> ${task.description}</label>
            <button class="edit" data-id="${task.id}">Editar</button>
            <button class="delete" data-id="${task.id}">Borrar</button>
        </li>`;

        let tipo = '';
        if (task.status  === TASK_STATUS.PENDING) {
            tipo = '#incomplete-tasks';
        } else {
            tipo = '#completed-tasks';
        }

        $(tipo).append(html);
        $(tipo +'.edit').click((e) => editTask(e));
        $(tipo +'.delete').click((e) => removeTask(e));*/
    };

    /**
     * This method modifies the DOM HTML to display a form that allow the user to change the
     * task description and send a PUT request to modify it on the server side
     *
     * @param e
     */
    const editTask = (e) => {
        // We retrieve the value of the attribute data-id;
        const id = e.target.dataset.id;

        let currentDOMTask = document.getElementById(`task-${id}`);
        currentDOMTask.querySelector("label > input[type=checkbox]").remove();

        let currentTask = new Task(currentDOMTask.querySelector("label").innerHTML.trim());
        currentTask.id = id;

        currentDOMTask.querySelector('label').remove();

        let inputText = document.createElement('input');
        inputText.setAttribute('id', `task-edit-${currentTask.id}`);
        inputText.setAttribute('type', 'text');
        inputText.setAttribute('value', currentTask.description);

        /**
         * We associate the event click on the button ok, to send a PUT request to the server.
         */
        let buttonOK = document.createElement('button');
        buttonOK.innerText = 'OK';
        buttonOK.setAttribute('id', `ok-button-${currentTask.id}`);
        buttonOK.onclick = () => {
            currentTask.description = document.getElementById(`task-edit-${currentTask.id}`).value;

            // TODO ITEM 2: Dentro de la función editTask llamar a la API con el método PUT 
            //cuando la descripción de la tarea es modificada.
            $.ajax({
                url: `${API_URL}`,
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(currentTask),
                success: function(){
                    console.log(data);
                },
                error: function (xhr) {
                    showError(xhr.status, xhr.statusText);
                }
            });

        };

        let buttonCancel = document.createElement('button');
        buttonCancel.innerText = 'Cancel';
        buttonCancel.setAttribute('id', `cancel-button-${currentTask.id}`);
        buttonCancel.onclick = () => revertHTMLChangeOnEdit(currentTask);

        currentDOMTask.insertBefore(buttonCancel, currentDOMTask.children[0]);
        currentDOMTask.insertBefore(buttonOK, currentDOMTask.children[0]);
        currentDOMTask.insertBefore(inputText, currentDOMTask.children[0]);

        currentDOMTask.querySelector('.edit').style.visibility = 'hidden';
        currentDOMTask.querySelector('.delete').style.visibility = 'hidden';

        inputText.focus();
    };

    /**
     * This method removes the form displayed to edit the task and show it as a task item.
     * @param currentTask the string coming from the API
     */
    const revertHTMLChangeOnEdit = (currentTask) => {
        let task = JSON.parse(currentTask);

        let currentDOMTask = document.getElementById(`task-${task.id}`);
        currentDOMTask.querySelector('input[type=text]').remove();

        let label = document.createElement('label');

        currentDOMTask.insertBefore(label, currentDOMTask.children[0]);
        label.innerHTML = `<input type="checkbox"/> ${task.description}`;
        addOnChangeEvent(task);

        currentDOMTask.insertBefore(label, currentDOMTask.children[0]);
        currentDOMTask.querySelector(`button#ok-button-${task.id}`).remove();
        currentDOMTask.querySelector(`button#cancel-button-${task.id}`).remove();

        currentDOMTask.querySelector('.edit').style.visibility = 'visible';
        currentDOMTask.querySelector('.delete').style.visibility = 'visible';
    };

    /**
     * This methods removes the task item associated to the DOM of the page
     * @param id the identifier from the task
     */
    const removeTaskFromList = (id) => {
        // TODO ITEM 4: Dentro de la función removeTaskFromList, eliminar la tarea en cuestión del DOM HTML.
        $(`#task-${id}`).find('li').remove();
    };

    /**
     * This method sends a DELETE request to remove the task from the server.
     * @param e
     */
    const removeTask = (event) => {
        const id = event.target.dataset.id;
        // TODO ITEM 5: Dentro de la función removeTask, llamar al API con el método DELETE para borrar
        //la tarea del servidor.
        $.ajax({
            url: `${API_URL}/${id}`,
            type: 'DELETE',
            data: {"id": JSON.stringify(id)}, 
            contentType:'application/json',
            dataType: 'text',
            success: function (data) {
                removeTaskFromList(id);
                return null;
            },
            error: function (xhr) {
                showError(xhr.status, xhr.statusText);
            }
        });
    };
})(jQuery);