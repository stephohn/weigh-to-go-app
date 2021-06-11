let today = new Date()
let monthLength = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
).getDate()

class Tracker {

    static allTrackers = []

    constructor({name, id, records}){
        this.name = name
        this.id = id
        this.records = records.map(record => new Record(record))
        Tracker.allTrackers.push(this)
    }

    appendContent(){
        dayDiv.innerHTML = ""
        const deleteTrackerBtn = document.createElement("button")
        deleteTrackerBtn.innerText = "Delete this tracker"
        deleteTrackerBtn.addEventListener('click', this.deleteTracker.bind(this))
        let currentMonthFirstDay = new Date(
            today.getFullYear(), 
            today.getMonth(), 
            1)
            .getDay()
        for (let i = 0; i < currentMonthFirstDay; i++){
            let dayBlank = document.createElement("span")
            dayBlank.classList.add("cell")
            dayBlank.classList.add("empty")
            dayDiv.append(dayBlank)
        }
        for (let i = 1; i <= monthLength; i++){
            let daySpan = document.createElement("span")
            daySpan.id = i
            daySpan.addEventListener('click', () => Record.showRecordForm(this, selectDate))
            let selectDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                i
            )
            if (selectDate == today.getDate()) {
                daySpan.classList.add("today")
            }
            daySpan.addEventListener('click', () => {
                document.querySelector(".cell.today")?.classList.remove("today");
                daySpan.classList.add("today");
            })
            daySpan.innerText = i
            for (let record of this.records){
                record.filterRecordByDate(daySpan)
            }

            daySpan.classList.add("cell")
            daySpan.classList.add("day")
            dayDiv.append(daySpan)
        }
        content.append(dayDiv)
        dayDiv.append(deleteTrackerBtn)
        calendar.append(content)
    }

    deleteTracker(){
        fetch(`http://localhost:3000/trackers/${this.id}`, {
            method: "DELETE"
        }).then(jsonToJS)
        .then(m => {
            // calendar.children[0].remove()
            Tracker.allTrackers = Tracker.allTrackers.filter(tracker => tracker.id !== this.id)
            Tracker.appendTrackerDiv(Tracker.allTrackers)
        })
    }

    static appendHeader(){
        const monthList = new Array(
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        )
        const weekdayList = new Array(
            "SUN",
            "MON",
            "TUE",
            "WED",
            "THU",
            "FRI",
            "SAT"
        )
        monthDiv.innerText = monthList[today.getMonth()] + " " + today.getFullYear()
        for (let i = 0; i < weekdayList.length; i++){
            let weekday = document.createElement("span")
            weekday.classList.add("cell")
            weekday.classList.add("weekday")
            weekday.innerText = weekdayList[i]
            weekdayDiv.append(weekday)
        }
        header.classList.add("header")
        monthDiv.classList.add("month")
        weekdayDiv.classList.add("weekday")
        calendar.append(header)
        header.append(monthDiv)
        header.append(trackerDiv)
        calendar.append(weekdayDiv)
        this.fetchTrackers()
    }

    static fetchTrackers(){
        fetch("http://localhost:3000/trackers")
        .then(jsonToJS)
        .then(this.appendTrackerDiv)
    }

    static appendTrackerDiv(trackers = this.allTrackers){
        trackerDiv.innerHTML = ""
        const addTrackerBtn = document.createElement("button")
        addTrackerBtn.innerText = "+Add a new tracker"
        addTrackerBtn.classList.add("button")
        addTrackerBtn.addEventListener('click', Tracker.showTrackerForm)
        for (let tracker of trackers){
            let newTracker = new Tracker(tracker)
            const trackerBtn = document.createElement("button")
            trackerBtn.innerText = newTracker.name
            trackerBtn.classList.add("button")
            trackerBtn.addEventListener('click', () => newTracker.appendContent())
            trackerDiv.append(trackerBtn)
        }
        trackerDiv.append(addTrackerBtn)
    }

    static showTrackerForm(){
        const trackerForm = document.createElement("form")
        trackerForm.innerHTML = `
            <form id="trackerForm">
                <label>Enter the name of your new tracker:</label>
                <input id="trackerName">
                <input type="submit" value="Submit">
            </form>
        `
        trackerForm.addEventListener('submit', Tracker.addTracker)
        trackerDiv.append(trackerForm)
    }

    static addTracker(e){
        e.preventDefault()
        const userInput = trackerName.value
        const body = {
            tracker: {
                name: userInput
            }
        }
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(body)
        }
        e.target.reset()
        fetch("http://localhost:3000/trackers", options)
        .then(jsonToJS)
        .then(tracker => {
            let newTracker = new Tracker(tracker)
            Tracker.appendTrackerDiv(Tracker.allTrackers)
        })
    }

    // calendar.append(content)
}