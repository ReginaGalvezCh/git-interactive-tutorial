// var lecciones;
// var oReq = new XMLHttpRequest();
// oReq.onload = (e) => {
//     lecciones = JSON.parse(e.target.responseText);
// };
// oReq.open("get", "https://s3.amazonaws.com/laraveltienda/config.json", true);
// oReq.send();

( () => {
    var file = `{
        "config": {
            "errorComando": "comand not found"
        },
        "lecciones": {
            "1": {
                "orden": "1.1",
                "titulo": "Got 15 minutes and want to learn Git?",
                "tareas": [
                    "Git allows groups of people to work on the same documents (often code) at the same time, and without stepping on each other's toes. It's a distributed version control system.", 
                    "Our terminal prompt below is currently in a directory we decided to name 'octobox'. To initialize a Git repository here, type the following command:"
                ],
                "comando": "git init",
                "errorMessages": [
                    "fatal: Not a git repository (or any of the parent directories): .git"
                ],
                "alert": "Did not create a Git repo",
                "successMessages": [
                    "Initialized empty Git repository in /.git/"
                ],
                "repoStatus": "Empty"
            },
            "2": {
                "orden": "1.2",
                "titulo": "Checking the Status",
                "tareas": [
                    "Good job! As Git just told us, our 'octobox' directory now has an empty repository in /.git/. The repository is a hidden directory where Git operates.", 
                    "To save your progress as you go through this tutorial -- and earn a badge when you successfully complete it -- head over to create a free Code School account. We'll wait for you here.",
                    "Next up, let's type the git status command to see what the current state of our project is:"
                ],
                "comando": "git status",
                "errorMessages": [
                    "fatal: Not a git repository (or any of the parent directories): .git"
                ],
                "alert": "Did not use git status",
                "successMessages": [
                    "# On branch master",
                    "#",
                    "# Initial commit",
                    "#",
                    "nothing to commit (create/copy files and use 'git add' to track)"
                ],
                "repoStatus": "Empty"
            }
        }
    }`;
    var lecciones = JSON.parse(file).lecciones;
    // console.log(lecciones);
    var config = JSON.parse(file).config;

    var leccionActual = 1;

    var consoleArea = document.querySelector('.console-area');
    var textarea = document.querySelector('#console-input');
    var commandHist = [];
    var commandPos = 1;

    var areaTareas = document.querySelector('.tareas');

    function actualizarInstrucciones() {
        // Actualizar titulo y orden
        let titulo = document.querySelector('#instrucciones h3 .titulo');
        titulo.innerHTML = lecciones[leccionActual].titulo;
        let orden = document.querySelector('#instrucciones h3 .orden');
        orden.innerHTML = lecciones[leccionActual].orden;

        // Actualizar comando
        let button = document.querySelector('#instrucciones button');
        button.innerHTML = lecciones[leccionActual].comando;

        // Limpiar areaTareas
        while (areaTareas.firstChild) {
            areaTareas.removeChild(areaTareas.firstChild);
        }
        // Agregar nuevas Tareas
        for (var i = 0; i < lecciones[leccionActual].tareas.length; i++) {
            // let parrafo = document.createElement("P");        
            // let tarea = document.createTextNode(lecciones[leccionActual].tareas[i]);
            // parrafo.appendChild(tarea);
            let parrafo = crearParrafo(lecciones[leccionActual].tareas[i]);
            areaTareas.appendChild(parrafo);     
        }
    }

    function mostrarResultado(passOrFail) {
        // Mostrar resultado
        if (passOrFail == 'pass') {
            // PASSED
            for (var i = 0; i < lecciones[leccionActual].successMessages.length; i++) {
                let parrafo = crearParrafo(lecciones[leccionActual].successMessages[i]);                                       
                consoleArea.appendChild(parrafo);
            }
            let parrafo = crearParrafo("Success!");      
            console.log(parrafo);                                 
            parrafo.classList.add('success');                                    
            consoleArea.appendChild(parrafo);
            // Siguiente leccion
            leccionActual++;
        } else {
            // FAILED
            if (RegExp("(git)", "g").test(textarea.value.trim())) {
                for (var i = 0; i < lecciones[leccionActual].errorMessages.length; i++) {
                    let parrafo = crearParrafo(lecciones[leccionActual].errorMessages[i]);                                          
                    consoleArea.appendChild(parrafo);
                }
            } else {
                let comandError = crearParrafo(textarea.value + ": " + config.errorComando);
                comandError.style.marginTop                                  
                consoleArea.appendChild(comandError);
                console.log(RegExp("(git)", "g").test(textarea.value.trim()));
            }
            // Red error message
            let parrafo = crearParrafo(lecciones[leccionActual].alert);
            parrafo.classList.add('error');                                    
            consoleArea.appendChild(parrafo);
        }
        // let parrafoVacio = document.createElement("p");
        // parrafoVacio.classList.add('empty-p');
        // consoleArea.appendChild(parrafoVacio);
    }

    function cambiarLineaActual(passOrFail) {
        let lineaActual = document.querySelector('.current-line');
        let parrafo = crearParrafo("$ " + textarea.value);
        parrafo.style.marginTop  = "15px";
        parrafo.style.marginBottom  = "15px";
        // let parrafoVacio = document.createElement("p");
        // parrafoVacio.classList.add('empty-p');
        consoleArea.removeChild(lineaActual);
        
        consoleArea.appendChild(parrafo);
        // consoleArea.appendChild(parrafoVacio);
        consoleArea.classList.remove('current-line');
        // lineaActual.classList.add('line');

        setTimeout(function() {
            mostrarResultado(passOrFail);
            let div = document.createElement("div");
            consoleArea.appendChild(div);
    
            consoleArea.lastElementChild.classList.add('current-line');
            consoleArea.lastElementChild.style.marginTop  = "15px";
            lineaActual = document.querySelector('.current-line');
            lineaActual.innerHTML = '<span>$ </span><textarea id="console-input" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"></textarea>';
            // Ayudar listener para el textarea
            addTextareaListener();
            console.log(leccionActual);
            actualizarInstrucciones();
            textarea.value = "";
            textarea.focus();
        }, 1000);
        
    }

    function crearParrafo(texto) {
        let parrafo = document.createElement("P");
        let textNode = document.createTextNode(texto);
        parrafo.appendChild(textNode);
        return parrafo;
    }

    function addTextareaListener() {
        textarea = document.querySelector('#console-input');
        textarea.addEventListener('keydown', (e) => {
            if (e.keyCode === 13) {
                if (textarea.value.trim() === lecciones[leccionActual].comando) {
                    e.preventDefault();
                    cambiarLineaActual("pass");
                } else {
                    e.preventDefault();
                    if (textarea.value !== "") {
                        commandHist.push(textarea.value);
                    }
                    // console.log(commandHist);
                    // textarea.value = "";
                    cambiarLineaActual();
                }
            }
            
            if (e.keyCode === 38 && commandPos <= commandHist.length  && commandHist.length > 0) {
                // Up presses
                textarea.value = "";
                textarea.value = commandHist[commandHist.length - commandPos];
                commandPos++;
                // console.log(commandPos);
            } 
            // else if (e.keyCode === 40 && commandPos > 1 && commandHist.length > 0) {
            //     // Down pressed
            //     textarea.value = "";
            //     commandPos--;
            //     textarea.value = commandHist[commandPos + 1];
            //     console.log(commandPos);
            // }
        });
    }

    document.querySelector('.comando').addEventListener('click', () => {
        textarea.classList.add("typed");
        textarea.value = lecciones[leccionActual].comando;
    });

    // Actualizar instrucciones al cargar
    actualizarInstrucciones();
    // Ayudar listener para el textarea al cargar
    addTextareaListener();
})();
