
const global_storage = "ch_ensnert_timelog";

const TYPES = { START: 0, BREAK: 1, END: 2 };
const TYPES_TRANSLATION = {
    [TYPES.START]:"Start Work",
    [TYPES.BREAK]:"Break from Work",
    [TYPES.END]:"End Work"
};
const TYPES_CLASS = {
    [TYPES.START]:"start",
    [TYPES.BREAK]:"break",
    [TYPES.END]:"end"
}

const MUST_DAILY = 8;
const MUST_WEEKLY = 42;

const time = {
    from:function(a){
        return {"day":""}
    },
    difference: function(a,b){
        
    },
}

let list = document.querySelector(".list");
let data_today = document.querySelector("[data-today]");
let data_day_total = document.querySelector("[data-day-total]");
let data_day_end = document.querySelector("[data-day-end]");
let data_week_total = document.querySelector("[data-week-total]");
let data_week_overtime = document.querySelector("[data-week-overtime]");
// let list = document.querySelector(".list");

let timers = [];
window.onbeforeunload = save;
document.onreadystatechange = load;

let zero = new Date("2022-01-01 00:00:00");
// zero = new Date(zero.getTime() - zero.getTimezoneOffset());

// timers : [{id,type,datetime}]

async function sleep(timeout = 1000) {
    let promise = new Promise(
        async (resolve) => {
            setTimeout(
                () => {
                    resolve(true);
                },
                timeout
            );
        }
    );
    await promise;
}

function getNextUnique() {
    let next = 0;
    if (timers.length != 0) {
        next = timers.reduce(
            // '{ ... }' object ; '{ xxx }' value xxx in object
            (n, { id }) => { 
                return (n < id ? id : n)
            },
            // start value
            0 
        );
    }
    return next + 1;
}


function addStart() {
    timers.push(
        new TimeElement(
            {
                "type": TYPES.START,
                "datetime": Date.now(),
                "id": getNextUnique()
            }
        )
    );
    save();
}
function addBreak() {
    timers.push(
        new TimeElement(
            {
                "type": TYPES.BREAK,
                "datetime": Date.now(),
                "id": getNextUnique()
            }
        )
    );
    save();
}
function addEnd() {
    timers.push(
        new TimeElement(
            {
                "type": TYPES.END,
                "datetime": Date.now(),
                "id": getNextUnique()
            }
        )
    );
    save();
}

function getClass(e) {
    return e.__proto__.constructor.name;
}
// function save(){}
function save() {
    localStorage.setItem(
        global_storage,
        JSON.stringify(
            timers.map(
                (e) => e.save_value
            ).filter(
                (e) => {
                    return e != null
                }
            )
        )
    )
    console.log("Data Saved!");
}

var loaded = false;
let data;

function load() {
    if (loaded == true) return;

    let dayofweek = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"];
    let today = new Date();
    data_today.innerText = `${dayofweek[today.getDay()]}, ${today.getDate()<=9?"0":""}${today.getDate()}.${today.getMonth()+1<=9?"0":""}${today.getMonth()+1}.${today.getFullYear()}`

    loaded = true;
    console.log("Loading Data...");
    // console.info(arguments);
    data = JSON.parse(
        localStorage.getItem(
            global_storage
        ) || []
    )
    if (data == [] || data.length == 0) return;
    data.sort((a,b)=>(a.datetime>=b.datetime?1:-1)).map(
        (e) => timers.push(
            new TimeElement(e)
        )
    )
    // showTotal();
    console.log("Data Loaded!");
}
function importData(inputData){
    if (getClass(inputData) == 'String'){
        try {
            inputData = JSON.parse(inputData);
        }
        catch (e) {
            return console.error("Data can not be Converted to JSON"),"Data can not be Converted to JSON";
        }
    }
    if(getClass(inputData) != 'Array'){
        throw new Error("Can not import Data given.");
    }
    let result = window.confirm("Do you want to Save to imported Data?");
    timers
        .push(
            ...inputData.map(a=>(new TimeElement(a)))
            .map(a=>(a.export=result,a))
        );
    save();
}

function showTotal() {


    let {totalText,estEndText} = (
        function (consumedTimeInMS = 0){
            let estEnd,estEndText,totalText;
            estEnd=new Date(
                (
                    ((MUST_DAILY * 60 * 60 * 1000) - consumedTimeInMS) + Date.now()
                )
            );
            estEnd.setSeconds(30);
            _a = estEnd;
            estEndText = displayTimeHM(estEnd,false)+":00";
            totalText = displayTimeHMS(new Date(consumedTimeInMS),false);
            // totalText = `${Math.floor(consumedTimeInMS)}:${Math.floor(consumedTimeInMS % 1 * 60)}:${Math.floor(consumedTimeInMS % 1 * 60 % 1 * 60)}`;
            return {totalText,estEndText};
        }
    )(
        (
            timers
                .map(a => a.save_value)
                .filter(a=>a)
                .filter(a=>(new Date(a.datetime).toJSON().split('T')[0] == (new Date()).toJSON().split('T')[0])) // only today
                .reduce((a, b) => (b.type == TYPES.START ? (a.push([b.datetime])) : (a[a.length-1].push(b.datetime)),a), []) // combine start with break || end
                .filter((a, b, c)=>a.length>=2||b==c.length-1) // filter unsolved working sections
                .map(a => (a[1] || Date.now()) - a[0]) // calc section
                .reduce((a, b) => a + b, 0) // summup entries
        )
    );
    data_day_total.innerText = totalText;
    data_day_end.innerText = estEndText;

    let {totalWeekText,overworkWeekText} = (
        function (consumedTimeInMS = 0){
            let estEnd,overworkWeekText,totalWeekText;
            estEnd=new Date(
                (MUST_WEEKLY * 60 * 60 * 1000) - consumedTimeInMS
            );
            // estEnd.setSeconds(30);
            overworkWeekText = displayTimeHMS(estEnd);
            totalWeekText = displayTimeHMS(new Date(consumedTimeInMS));
            // totalText = `${Math.floor(consumedTimeInMS)}:${Math.floor(consumedTimeInMS % 1 * 60)}:${Math.floor(consumedTimeInMS % 1 * 60 % 1 * 60)}`;
            return {totalWeekText,overworkWeekText};
        }
    )(
        (
            timers
                .map(a => a.save_value)
                .filter(a=>a)
                // .filter(a=>(new Date(a.datetime).toJSON().split('T')[0] == (new Date()).toJSON().split('T')[0])) // only today
                .reduce((a, b) => (b.type == TYPES.START ? (a.push([b.datetime])) : (a[a.length-1].push(b.datetime)),a), []) // combine start with break || end
                .filter((a, b, c)=>a.length>=2||b==c.length-1) // filter unsolved working sections
                .map(a => (a[1] || Date.now()) - a[0]) // calc section
                .reduce((a, b) => a + b, 0) // summup entries
        )
    );
    data_week_total.innerText = totalWeekText;
    data_week_overtime.innerText = overworkWeekText;
    // section = (end or now) - (prevElement)
    // if(this.start) continue;
    // if(this.end) this.datetime - prev.datetime
}

function RemoveAll() {
    let rly = window.confirm("Do you want to Remove all Data from this Page?");
    if (rly == true) {
        timers.map(
            (e) => e.dispose()
        );
        save();
    }
}

function displayTimeHMS(time){
    let aligned = new Date(zero.getTime() + time.getTime());
    let a=(b)=>(b<=9?'0'+b:b.toString());
    return `${a(aligned.getHours()+((aligned.getDate()-1)*24))}:${a(aligned.getMinutes())}:${a(aligned.getSeconds())}`;
}
function displayTimeHM(time,addDays=true){
    let aligned = new Date(zero.getTime() + time.getTime());
    if(addDays == false){aligned = time;}
    let a=(b)=>(b<=9?'0'+b:b.toString());
    return `${a(aligned.getHours()+(!addDays?0:((aligned.getDate()-1)*24)))}:${a(aligned.getMinutes())}`;
}

let intervalTimer = setInterval(
    () => {
        showTotal();
    },
    500
);

function exportAll(){
    let a = new Blob(JSON.stringify(timers.map(a=>a.save_value)).split(""),{type:"application/json"});
    let b = URL.createObjectURL(a);
    let c = document.createElement("a");
    c.setAttribute("href",b);
    c.setAttribute("download","timeLog_"+(new Date().toISOString().split("T")[0])+".json");
    document.body.append(c);
    c.click();
    document.body.lastChild.remove();
    URL.revokeObjectURL(b);
}

class TimeElement {
    baseElement = null;
    id = null;
    datetime = null;
    mode = TYPES.START;
    export = true;

    constructor(data) {
        if(data == null) {return null}
        if (getClass(data) == "Object") {
            /* this.id = data.id; */
            this.id = getNextUnique();
            this.datetime = data.datetime;
            this.type = data.type;
            this.baseElement = TimeElement.generateModel(data);
        } else {
            this.baseElement = data;
            this.id = data.querySelector("input[name=id]").value;
        }
    }
    dispose() {
        this.export = false;
        this.baseElement.outerHTML = "";
        return true;
    }
    disposable() {
        return true;
    }
    is(e) {
        return (
            e == this.baseElement || e == this.id
        );
    }
    get save_value() {
        return (
            this.export == false ? null : {
                /* "id":this.id, */
                "datetime": this.datetime,
                "type": this.type
            }
        )
    }
}


TimeElement.generateModel = function(data){ 
    let div = document.createElement('div'); 
    div.innerHTML = '<span>' + TYPES_TRANSLATION[data.type] + '</span>'
    +'<input type="hidden" name="id" value="' + data.id + '">'
    +'<span>'+(new Date(data.datetime)).toLocaleString()+'</span>';
    div.setAttribute("data-log","");
    div.setAttribute("data-log-type",TYPES_CLASS[data.type]);

    list.prepend(div);
    return (
        function (e) { 
            return e.item(0) 
        }(list.children)
    );
}

// import data by filedrop
async function handleDropEvent(evt){
    evt.stopPropagation();
    evt.preventDefault();
    files = evt.dataTransfer.files;
    console.log(files);
    let targetFile = files[0];
    if(targetFile.type == "application/json"){
        console.log("Importing File "+(targetFile.name.toString()));
        targetFile.text().then(importData).catch(a=>alert(a));
    }
}
function handleDropOverEvent(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

window.addEventListener("drop",handleDropEvent, false);
window.addEventListener("dragover",handleDropOverEvent,false);