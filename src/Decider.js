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
                index: classTable.length, //combine this w id?
                title: theClass.title,
                totalMaxCampers: theClass.maxCampers * theClass.maxClasses,
                maxCampers: theClass.maxCampers,
                // minCampers: theClass.minCampers
                maxClasses: theClass.maxClasses
            })
        }

        let classIndicesByName = {}
        for (let i=0; i<classTable.length; i++) classIndicesByName[classTable[i].title] = i

        let camperTable = []
        for (let i=0; i<table.length; i++) {
            let theCamper = table[i]
            camperTable.push({
                id: theCamper.id,
                index: camperTable.length,
                name: theCamper["First Name"] + " " + theCamper["Last Name"],
                choiceIndices: [
                    classIndicesByName[theCamper["Choice 1"]],
                    classIndicesByName[theCamper["Choice 2"]],
                    classIndicesByName[theCamper["Choice 3"]],
                    classIndicesByName[theCamper["Choice 4"]],
                    classIndicesByName[theCamper["Choice 5"]]
                ],
            })
        }

        function getCampersInClass(assignments, classIndex) {
            let thing = assignments.filter(
                assignment => assignment.classIndex===classIndex
            ).map(assignment => assignment.camperIndex)
            if (thing===undefined) console.log(assignments, classIndex)
            return thing
        }

        function getCamperClasses(assignments, camperIndex) {
            return assignments.filter(
                assignment => assignment.camperIndex===camperIndex
            ).map(assignment => assignment.classIndex)
        }

        function getAssignmentIndex(assignments, camperIndex, classIndex) {
            return assignments.findIndex(assignment => 
                assignment.camperIndex===camperIndex && assignment.classIndex===classIndex
            )
        }
            
        //2a. lumping each class together with all its periods, go thru random list and add campers to classes
        // by their top pref. if top pref is full go to next highest.
        let assignmentsTable = []
        for (let pd=0; pd<3; pd++) {
            for (let camper of camperTable) {
                for (let choiceIndex=0; choiceIndex<5; choiceIndex++) { //choice index 0 == camper's first choice
                    let classIndex = camper.choiceIndices[choiceIndex]
                    if (
                        (getCampersInClass(assignmentsTable, classIndex).length <
                        classTable[classIndex].totalMaxCampers) && //all 3 pds not full
                        !getCamperClasses(assignmentsTable, camper.index).includes(classIndex) //camper not already in class
                    ) {
                        assignmentsTable.push({
                            index: assignmentsTable.length,
                            camperIndex: camper.index,
                            classIndex: classIndex
                        })
                        break
                    }
                    let success = false

                    //2b. when even the bottom pref is full, will have to trade. go back to top unused pref and pick from
                    // that class and pick a new class for that person
                    if (choiceIndex===4) {
                        //for all camper's choices, they are already in the class
                        //or the class is full
                        let camperClasses = getCamperClasses(assignmentsTable, camper.index)
                        let otherChoices = camper.choiceIndices.filter(index => !camperClasses.includes(index))
                        for (let otherChoice of otherChoices) {
                            //look at every other chosen class camper is not in to look for a class that has a camper to swap with
                            let targetCampers = getCampersInClass(assignmentsTable, otherChoice)
                            for (let camperIndex of targetCampers) {
                                //look at every camper in the class to see who could move
                                //consider randomizing
                                let targetCamperClasses = getCamperClasses(assignmentsTable, camperIndex)
                                //look at their choices but only the ones they're not already in
                                let pontentialNewClasses = camperTable[camperIndex].choiceIndices.filter(
                                    lessonIndex => !targetCamperClasses.includes(lessonIndex)
                                )
                                for (let newClass of pontentialNewClasses) {
                                    let camperCount = getCampersInClass(assignmentsTable, newClass).length
                                    if (camperCount < classTable[newClass].totalMaxCampers) {
                                        //swap
                                        //change other camper
                                        let assignmentIndex = getAssignmentIndex(assignmentsTable, camperIndex, otherChoice)
                                        assignmentsTable[assignmentIndex].classIndex = newClass
                                        //add assignment for our main camper
                                        assignmentsTable.push({
                                            index: assignmentsTable.length,
                                            camperIndex: camper.index,
                                            classIndex: otherChoice
                                        })
                                        success = true
                                        break
                                    }
                                }
                                if (success) break; //clean up
                            }
                            if (success) break;
                        }
                        if (!success) {
                            console.log("could not assign everyone", assignmentsTable)
                            return
                        }
                    }
                }
            }
        }

        //figure out how many pds each class should have
        //want to minimize number of classes
        for (let lesson of classTable) {
            let totalCampers = getCampersInClass(assignmentsTable, lesson.index).length
            let numPds = Math.ceil(totalCampers/lesson.maxCampers)
            classTable[lesson.index].numPds = numPds
            classTable[lesson.index].avgCampersPerPd = totalCampers/numPds
            //now check to make sure there aren't too many classes
            if (numPds > lesson.maxClasses) {
                console.log(`exception--too many classes for ${classTable[lesson.index]}`)
            }
        }
        
        //3. split classes into pds.
        //3a. start with biggest class, set to pd = 1. Then find another class with the most campers from biggest class.
        //order classes by size
        let sortedClasses = classTable.slice(0)
        sortedClasses.sort((a, b) => b.avgCampersPerPd - a.avgCampersPerPd)
        //fix indices of classTable
        //take the biggest class
        let class0 = sortedClasses[0]
        //find the other class with the biggest intersection of campers
        let class0Campers = getCampersInClass(assignmentsTable, class0.index)
        let targetIndex = null
        let targetCount = 0
        for (let lesson of sortedClasses) {
            if (lesson.id===class0.id) continue;
            let theCampers = getCampersInClass(assignmentsTable, lesson.index)
            let intersection = theCampers.filter(
                camper => class0Campers.includes(camper)
            )
            if (targetIndex===null || intersection.length > targetCount) {
                targetIndex = lesson.index
                targetCount = intersection.length
                console.log(targetIndex, targetCount)
            }
        }

        console.log(class0, classTable[targetIndex], targetCount, class0Campers, getCampersInClass(assignmentsTable, targetIndex))
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