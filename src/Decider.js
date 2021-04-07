import React from 'react'
import './styles.css'
import Papa from 'papaparse'

class Decider extends React.Component {
    constructor() {
        super()
        this.state = {
            file: null,
            error: ""
        }

        this.inputChange = this.inputChange.bind(this);
        this.assign = this.assign.bind(this);
    }

    inputChange(e) {
        let theFile = e.target.files[0]
        if (theFile.name.endsWith(".csv")) {
            Papa.parse(theFile, {
                header: true,
                complete: function(results) {
                    this.setState( { file: results.data } )
                }.bind(this)
            })
        } else {
            this.setState( { error: "error: file must be a .csv" } )
        }
    }

    parseComplete(results) {
        this.setState( { file: results, error: "" } )
    }

    assign() {
        let table = this.state.file //rename this variable
        let theClasses = this.props.classes
        this.setState( { error: "" } )
        //rough draft alg.
        //0. prereqs
        //make sure table has required fields
        if (
            !table[0] ||
            !(table[0]["First Name"] && table[0]["Last Name"] && table[0]["Cabin"] &&
            table[0]["Choice 1"] && table[0]["Choice 2"] && table[0]["Choice 3"] &&
            table[0]["Choice 4"] && table[0]["Choice 5"])
        ) {
            this.setState( { error: "error: file input is missing at least one field" } )
            return
        }

        //0a. check to make sure there is enough raw space in the classes to handle all campers.
        //0b. check to make sure that any classes that must take place (min!==0) have enough campers signed up
        //0c. check no classes have the same name (do elsewhere?)
        
        let maxCampers = 0
        for (let lesson of theClasses) {
            maxCampers += lesson.maxCampers //0a.
            if (lesson.minClasses) { //0b.
                let minCampers = lesson.minClasses * lesson.minCampers
                let numCampers = 0
                for (let camper of table) {
                    if (
                        camper["Choice 1"]===lesson.title ||
                        camper["Choice 2"]===lesson.title ||
                        camper["Choice 3"]===lesson.title ||
                        camper["Choice 4"]===lesson.title ||
                        camper["Choice 5"]===lesson.title
                    ) numCampers++
                }
                if (numCampers < minCampers) {
                    this.setState( { error: `error: not enough campers signed up for ${lesson.title}` } )
                    return
                }
            }
            for (let innerLesson of theClasses) { //0c.
                if (lesson.title===innerLesson.title && lesson.id!==innerLesson.id) {
                    this.setState( { error: `error: two lessons with the same title: ${lesson.title}`} )
                    return
                }
            }
        }

        if (maxCampers < table.length) { //0a.
            this.setState( { error: "too many campers to fit in the classes" } )
            return
        }

        //0d. make sure nobody signed up for invalid class
        let classNames = theClasses.filter(lesson => lesson.enabled).map(lesson => lesson.title)
        for (let camper of table) {
            if (
                !(classNames.includes(camper["Choice 1"]) &&
                classNames.includes(camper["Choice 2"]) &&
                classNames.includes(camper["Choice 3"]) &&
                classNames.includes(camper["Choice 4"]) &&
                classNames.includes(camper["Choice 5"]))
            ) {
                this.setState({
                    error: `error: invalid class title for camper ${camper["First Name"]} ${camper["Last Name"]} from cabin ${camper["Cabin"]}`
                })
            }
        }
        
        //1. setup
        //1a. randomize camper list
        //there are better ways to do this
        for (let i=0; i<table.length; i++) {
            table[i].sortNum = Math.random()
            table[i].id = i
        }
        table.sort((a,b) => a.sortNum - b.sortNum)
        //how random is this method? would be interesting to graph nums.
        
        //2. fill adjoined classes
        let classTable = [] //creating these additional tables may be unnecessary
        for (let i=0; i<theClasses.length; i++) {
            let theClass = theClasses[i]
            if (!theClass.enabled) continue
            classTable.push({
                id: theClass.id,
                title: theClass.title,
                totalMaxCampers: theClass.maxCampers * theClass.maxClasses,
                allCampers: [],
                pd1Campers: [],
                pd2Campers: [],
                pd3Campers: []
            })
        }

        let classIndicesByName = {}
        for (let i=0; i<classTable.length; i++) classIndicesByName[classTable[i].title] = i

        let camperTable = []
        for (let i=0; i<table.length; i++) {
            let theCamper = table[i]
            camperTable.push({
                id: theCamper.id,
                name: theCamper["First Name"] + " " + theCamper["Last Name"],
                choiceIndices: [
                    classIndicesByName[theCamper["Choice 1"]],
                    classIndicesByName[theCamper["Choice 2"]],
                    classIndicesByName[theCamper["Choice 3"]],
                    classIndicesByName[theCamper["Choice 4"]],
                    classIndicesByName[theCamper["Choice 5"]]
                ],
                allClasses: [],
                pd1Class: null,
                pd2Class: null,
                pd3Class: null
            })
        }

        //2a. lumping each class together with all its periods, go thru random list and add campers to classes
        for (let pd=0; pd<3; pd++) {
            let camperCounter = 0
            for (let camper of camperTable) {
                for (let choiceIndex=0; choiceIndex<5; choiceIndex++) {
                    let classIndex = camper.choiceIndices[choiceIndex]
                    if (
                        (classTable[classIndex].allCampers.length <
                        classTable[classIndex].totalMaxCampers) &&
                        !camper.allClasses.includes(classTable[classIndex].id)
                    ) {
                        classTable[classIndex].allCampers.push(camper)
                        camper.allClasses.push(classTable[classIndex].id)
                        break
                    }
                    if (choiceIndex===4) {
                        let totalClasses = camperTable.length * 3
                        let completion = (pd * camperTable.length) + camperCounter
                        console.log(camperTable, classTable, camper, `${completion}/${totalClasses}`)
                        return
                    }
                }
                camperCounter++
            }
        }
        console.log(camperTable, classTable)
        return
        // by their top pref. if top pref is full go to next highest.
        //2b. when even the bottom pref is full, will have to trade. go back to top unused pref and choose random from
        // that class and pick a new class for that person (this does not necessarily terminate! cap it)
        //3. split classes into pds.
        //3a. start with biggest class, set to pd = 1. Then find another class with the most campers from biggest class.
        // set to pd = 2. then another class with the most from the gp set to pd = 3. Repeat, alternating between fwd and
        // reverse (start w pd 3, then pd 1, etc).
        //3b. if class cannot be placed in a pd skip to next pd.
        //3c. when a class cannot be placed because all pds have conflicts:
        //3c.i. split class differently if possible
        //3c.ii. do more trading
        //??
    }

	render() {
        let theButton = <input type="file" onChange={this.inputChange}/>
        if (this.state.file) theButton = <button onClick={this.assign}>assign classes</button>
        return(
            <div style={{marginTop: "20px"}}>
                <h3>Class Assigner</h3>
                {theButton}
                <h4 style={{color: "red"}}>{this.state.error}</h4>
            </div>
        )
    }
}

export default Decider;