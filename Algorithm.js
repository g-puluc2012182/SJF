var processes = [];
var numberOfProcesses;
var count = 0;
var colourPallete = ['#e6194b', '#3cb44b', "#c5919d", "#df6e21", "#472426", "#fbaf08", "#101357", "#bf4aa8"]
clearInputs(5);

function clearInputs(clue) {
    document.getElementById("input_ProName").value = "";
    document.getElementById("input_ProSubTime").value = "";
    document.getElementById("input_ProBurstTime").value = "";
    document.getElementById("input_ProColor").value = pickNewColour(colourPallete);
    if (clue == 5) {
        document.getElementById("input_NoProcess").value = "";
    }
}

function checkForEmpty(ids) {
    for (var i = 0; i < ids.length; i++) {
        if (document.getElementById(ids[i]).value == "") {
            return false;
        }

    }
    return true;
}

function checkSameName(processList, name) {
    for (var m = 0; m < processList.length; m++) {
        if (name == processList[m].ProcessName) {
            return false;
        }
    }
    return true;
}

function inputNum() {
    if (checkForEmpty(["input_NoProcess"])) {
        numberOfProcesses = parseInt(document.getElementById("input_NoProcess").value, 10);
        document.getElementById("button_Add").disabled = false;
        document.getElementById("button_OK").disabled = true;
    }
}

function addToArray() {
    if (processes.length < numberOfProcesses) {
        if (checkForEmpty(["input_ProName", "input_ProBurstTime", "input_ProSubTime"])) {
            if (checkSameName(processes, document.getElementById("input_ProName").value)) {
                var processA = new Process((document.getElementById("input_ProName").value).toString(), parseInt(document.getElementById("input_ProSubTime")
                    .value, 10), parseInt(document.getElementById("input_ProBurstTime").value, 10), (document.getElementById("input_ProColor").value).toString());
                processes.push(processA);
                var processRow = createTableRow(processA);
                attachTableRow(processRow);
                clearInputs(4);
                if (processes.length == numberOfProcesses) {
                    document.getElementById("button_Add").disabled = true;
                }
            } else {
                document.getElementById("para_errorLog").innerText = "Process name should not be same";
            }
        } else {
            document.getElementById("para_errorLog").innerText = "fill all correctly";
        }
    } else {
        document.getElementById("para_errorLog").innerText = "Process Full";
    }
}

function pickNewColour(colorArray) {
    if (colorArray.length > 0) {
        var number = Math.floor(Math.random() * (colorArray.length));
        var color = colorArray.splice(number, 1);
        return color;
    } else {
        return "#9d2525";
    }
}

function createListItem(value, t) {
    var item = document.createElement('li');
    item.innerText = value.ProcessName + " se ejecuta en " + t.toString() + " hasta " + (t + value.BurstTime).toString();
    return item;
}

function attachListItem(item) {
    var ulElement = document.getElementById('list_execution');
    ulElement.appendChild(item);
}

function createTableRow(Process) {
    params = ['ProcessName', 'SubmissionTime', 'BurstTime', 'ProcessColor'];
    var row = document.createElement('tr');
    for (var k = 0; k < 5; k++) {
        if (k < 3) {
            var cell = document.createElement('td');
            cell.className = "tablecell";
            cell.innerText = Process[params[k]];
        } else if (k == 3) {
            var cell = document.createElement('td');
            cell.className = "tablecell";
            cell.id = "tableColorcell";
            cell.bgColor = Process.ProcessColor.toString();
        } else if (k == 4) {
            var button_del = document.createElement('button');
            button_del.id = "buttonDel";
            button_del.className = "btn btn-primary"
            button_del.addEventListener("click", function () {
                var cell = this.parentElement;
                var row1 = cell.parentElement;
                var table = row1.parentElement;
                for (var n = 0; n < processes.length; n++) {
                    if (row1.childNodes[0].innerText == processes[n].ProcessName) {
                        processes.splice(n, 1);
                    }
                }
                table.removeChild(row1);
                document.getElementById("button_Add").disabled = false;
            });
            button_del.innerText = "X";
            var cell = document.createElement('td');
            cell.className = "tablecell";
            cell.appendChild(button_del);
        }
        row.appendChild(cell);
    }
    row.id = count;
    count = + 1;
    return row;
}

function attachTableRow(row) {
    var tableBody = document.getElementById('tableBody_Process');
    tableBody.appendChild(row);
}

function getAvailabeProcesses(processList, time) {
    currentAvailable = [];
    for (var p = 0; p < processList.length; p++) {
        if (time >= processList[p].SubmissionTime) {
            var pro = processList.splice(p, 1);
            currentAvailable.push(pro[0]);
            //WOW what a mistake
            p = p - 1;
        }
    }
    return currentAvailable;
    //array of process objects which are available at given time
}

function countAvailableProcesses(processList, time) {
    var count = 0;
    for (var q = 0; q < processList.length; q++) {
        if (time >= processList[q].SubmissionTime) {
            count += 1;
        }
    }
    return count;
}

function createIdleProcesses(processList, time) {
    var iterations = 1;
    while (countAvailableProcesses(processList, time + iterations) == 0) {
        iterations += 1;
    }
    return iterations;
}

function nextSJ(processList, time) {
    var minindex;
    var minVal = 10000000;
    var available = getAvailabeProcesses(processList, time);
    if (available.length > 0) {
        for (var p = 0; p < available.length; p++) {
            if (available[p].BurstTime < minVal) {
                minVal = available[p].BurstTime;
                minindex = p;
            }
        }
        var SJ = available.splice(minindex, 1);
        //method to add available array to processes array
        for (var z = 0; z < available.length; z++) {
            processList.push(available[z]);
        }
        return SJ[0];
    } else {
        var newIdleTime = createIdleProcesses(processList, time);
        var newProcess = new Process("IDLE", time, newIdleTime, "#999999");
        return newProcess;
    }

}

function Submission() {
    var sortedProcesses = [];
    var timeIndex = 0;
    document.getElementById("h3_exeList").innerText = "Orden de ejecución"; 
    while (processes.length > 0) {
        var shortestJob = nextSJ(processes, timeIndex);
        shortestJob.calculateTime(timeIndex);
        sortedProcesses.push(shortestJob);
        var Listitem = createListItem(shortestJob, timeIndex);
        attachListItem(Listitem);
        var cat = shortestJob.ProcessName + " executes at second " + timeIndex.toString()
            + " until " + (timeIndex + shortestJob.BurstTime).toString();
        timeIndex += shortestJob.BurstTime;
    }
    var test = getGraphValueArray(sortedProcesses);
    displayCalculatedTimes(sortedProcesses);
    plotGraph(test);
    document.getElementById("button_OK").disabled = false;
}

function getGraphValueArray(array) {
    var valueArray = [];
    for (var v = 0; v < array.length; v++) {
        var item = {
            "name": array[v].ProcessName,
            "startTime": array[v].StartTime,
            "endTime": array[v].StartTime + array[v].BurstTime,
            "color": array[v].ProcessColor,
        }
        valueArray.push(item);
    }
    return valueArray;
}

function displayCalculatedTimes(array){
    var TotTurnaround = 0;
    var TotWaiting = 0;
    var number = 0 
    for (var w = 0; w < array.length; w++) {
        if (array[w].ProcessName != "IDLE"){
        TotTurnaround = TotTurnaround + array[w].TurnAroundTime;
        TotWaiting = TotWaiting + array[w].WaitingTime;
        number = number + 1;
        }
    }
    document.getElementById("h5_turnaround").innerText = "Tiempo medio de respuesta : " + TotTurnaround/number;
    document.getElementById("h5_waiting").innerText = "Tiempo medio de espera : " + TotWaiting/number;

}
