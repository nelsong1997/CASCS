import React from 'react'
import './styles.css'
import names from './names.js'
import cabins from './cabins.js'
import Papa from 'papaparse'

class Example extends React.Component {
    constructor() {
        super()
        this.state = {
            result: null
        }

        this.generate = this.generate.bind(this)
    }

    generate() {
        const classTitles = this.props.classes.map(lesson => lesson.title)

        if (classTitles.length < 5) {
            console.log("not enough classes.")
            return
        }

        let table = [[
            "First Name",
            "Last Name",
            "Cabin",
            "Choice 1",
            "Choice 2",
            "Choice 3",
            "Choice 4",
            "Choice 5"
        ]]

        populateVillageRows(cabins.mehkoa, 6)
        populateVillageRows(cabins.tamakwa, 6)
        populateVillageRows(cabins.madewehsoos, 8)
        populateVillageRows(cabins.chippewadchu, 10)

        let csv = Papa.unparse(table)

        let file = new File([csv], "text.csv")
        console.log(file)

        this.setState( { result: encodeURIComponent(csv) } )

        function populateVillageRows(village, numCampers) {
            function randomValueFromArray(array) {
                let index = Math.floor((Math.random() * array.length))
                return array[index]
            }

            function removeItemFromArray(item, array) {
                let index = array.indexOf(item)
                return array.slice(0, index).concat(array.slice((index + 1), array.length))
            }

            for (let cabin of village) {
                for (let i=0; i<numCampers; i++) {
                    let classTitlesCopy = classTitles.slice(0)
                    let newRow = []
                    newRow[0] = randomValueFromArray(names.first)
                    newRow[1] = randomValueFromArray(names.last)
                    newRow[2] = cabin
                    for (let i=0; i<5; i++) {
                        let chosenClass = randomValueFromArray(classTitlesCopy)
                        classTitlesCopy = removeItemFromArray(chosenClass, classTitlesCopy)
                        newRow[i+3] = chosenClass
                    }
                    table.push(newRow)
                }
            }
        }

    }

	render() {
        let theButton = <button onClick={this.generate}>generate example</button>
        if (this.state.result) theButton = [
            <button key="0">
                <a 
                    href={`data:text/plain;charset=utf-8,${this.state.result}`}
                    download="example.csv"
                >download example</a>
            </button>
        ]
        return(
            <div style={{marginTop: "20px"}}>
                {theButton}
            </div>
        )
    }
}

export default Example;