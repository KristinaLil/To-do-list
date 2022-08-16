// Čia bus rašomas Javascript/jQuery kodas.
/* Standartinė jQuery funkcija */
/* DOM - Document Object Model */
var newTaskCount = 0;
$(document).ready(function () {
    // Palaukia, kol visas HTML/CSS kodas bus užkrautas iš serverio naršyklėje.

    // Iškviečiame getTasks funkciją
    getTasks();

    /* Delete button event listener */
    /* Negalime, naudoti, $('.trinti').click() - nes šie elementai sukuriami asinchroniškai ir dinamiškai */
    $('#task_list').on('click', '.trinti', function (event) {
        // alert("Coming Soon");

        let userAnswer = confirm("Are you sure you want to delete this task?"); // Visada pagal vartotojo pasirinkima, si funkcija grazins true/false


        // console.log($(this).parent());
        // Pašaliname užduoties elementą iš HTML Sąrašo
        if(userAnswer === true) {
            $(this).parent("li").remove();

            let taskID = $(this).data('task');

            deleteTask(taskID);
        }

    });


    /* Click - Event Listener PVZ. */
    /* $("#add_task").click(function(event) {
        // Kodas aprašytas čia, bus vykdomas, kai paspaudžiamas mygtukas
        // Ji sustabdo puslapį nuo persikrovimo pateikus formą
        event.preventDefault();
        
        // Gauname elementa kuris naudojamas uzduoties pavadinimui
        let taskInput = $("#task_name");
        
        // Gauname input laukelio reiksme ir issaugome ja kaip kintamaji
        let taskName = taskInput.val();
        // Isvalome input laukelio reiksme (value)
        taskInput.val("");
        console.log(taskName);
    }); */
    /* Submit - Event Listener */
    $("#task_form").submit(function (event) {
        event.preventDefault();
        // Gauname elementa kuris naudojamas uzduoties pavadinimui
        let taskInput = $("#task_name");
        // Gauname input laukelio reiksme ir issaugome ja kaip kintamaji
        let taskName = taskInput.val();
        // Isvalome input laukelio reiksme (value)
        taskInput.val("");
        // Sukuriame task objekta
        let task = {
            "name": taskName,
            "status": "inprogress"
        };

        // Įrašo užduoties duomenis į duombazę
        saveTask(task);

    });



    // Nauja funkcija atvaizduoti naujai pridetai uzduociai.
    /* task - Užduoties objektas - 
    {
        "name" : "name",
        "status" : "status",
        "id" : 3
    }
    */
    function addTask(task) {
        // console.log(taskName);
        let taskList = $("#task_list");

        let dynamicTaskID = `checkbox_${newTaskCount}`;
        // taskList.append('Labas');
        /* Funkcija prepend, prideda papildomus html elementus i elemento pradzia */
        taskList.prepend(`
        <li class="list-group-item">
            <input class="form-check-input me-1" type="checkbox" value="" id="${dynamicTaskID}">
            <label class="form-check-label" for="${dynamicTaskID}">${task.name} (#${task.id}) </label>  
            <button data-task='${task.id}' type="button" class="trinti btn btn-close float-end"></button>
        </li>`);

        newTaskCount++; // newTaskCount = newTaskCount + 1;
    }

    function getTasks() {
        let apiURL = 'http://localhost:3000/tasks';
        /* jQuery AJAX GET Dokumentacija */
        /* https://api.jquery.com/jquery.get/ */
        /* Išsiunčiame užklausą ir gauname grąžintus duomenis. */
        $.get(apiURL, function (data) {
            // Atspausdiname gauta rezultata, konsoleje
            // console.log(data);
            /* Pereiname per visus grazinto masyvo elementus */
            for (let i = 0; i < data.length; i++) {
                // console.log(data[i]);
                addTask(data[i]);
            }


        });
    }

    function saveTask(task) {
        /* Savankiskam darbui */
        // Užduoties išsaugojimui, pasikreipti į ta pati URL, bet POST medtodu 
        let apiURL = 'http://localhost:3000/tasks';

        let data = task;

        /* Alert 123 - Asinchroniškai veikiančio Javascript pavyzdys */
        // alert("1");
        /* jQuery POST dokumentacija: https://api.jquery.com/jquery.post/ */
        $.post(apiURL, data, function (data) {
            console.log("POST Uzklausos rezultatas");
            /* 
            addTask funkcija, kvieciama, tik sulaukus atsakymo is API, 
            todel, kad tik tada suzinome užduoties ID. 
            */
            addTask(data);
            // alert("2");
        });

        // alert("3");
    }

    function deleteTask(taskID) {
        // Uzduoties trynimas.

        let apiURL = 'http://localhost:3000/tasks/' + taskID;

        // let data = task;

        /* jQuery AJAX funkcijos dokumentacija: https://api.jquery.com/jquery.ajax/ */
        $.ajax({
            url: apiURL,
            method: "DELETE",
            data: {},
            error: function() {
                console.log("Error");
            },
            success: function() {
                console.log("Success");
            }
            // dataType: "html"
          });

        //   alert("Duomenys uzsikrove");
    }
});