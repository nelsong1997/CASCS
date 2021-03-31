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
    }

    inputChange(e) {
        let theFile = e.target.files[0]
        if (theFile.name.endsWith(".csv")) {
            this.setState( { file: theFile, error: "" } )
        } else {
            this.setState( { error: "error: file must be a .csv" } )
        }
    }

    assign() {
        //rough draft alg.
        //0. prereqs
        //0a. check to make sure there is enough raw space in the classes to handle all campers.
        //0b. check to make sure that any classes that must take place (min!==0) have enough campers signed up
        //0c. check no classes have the same name (do elsewhere?)
        //0d. prune disabled classes
        //1. setup
        //1a. randomize camper list
        //2. fill adjoined classes
        //2a. lumping each class together with all its periods, go thru random list and add campers to classes
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