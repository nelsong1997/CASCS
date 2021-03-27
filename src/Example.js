import React from 'react'
import './styles.css'
import names from './names.js'
import cabins from './cabins.js'

class Example extends React.Component {
    constructor() {
        super()
        this.state = {}

        this.generate = this.generate.bind(this)
    }

    generate() {
        const classes = this.props.classes

        let table = []
        let headerRow = [
            "First Name",
            "Last Name",
            "Cabin",
            "Choice 1",
            "Choice 2",
            "Choice 3",
            "Choice 4",
            "Choice 5"
        ]
        table[0] = headerRow

        populateVillageRows(cabins.mehkoa, 6)
        populateVillageRows(cabins.tamakwa, 6)
        populateVillageRows(cabins.madewehsoos, 8)
        populateVillageRows(cabins.chippewadchu, 10)

        console.log(table)

        function populateVillageRows(village, numCampers) {
            function randomValueFromArray(array) {
                let index = Math.floor((Math.random() * array.length))
                return array[index]
            }

            function removeFromArray(index, array) {
                return array.slice(0, index).concat(array.slice(index + 1), array.length)
            }

            console.log(removeFromArray(2, ["Apple", "Banana", "Lemon", "Cheese"]))

            for (let cabin of village) {
                for (let i=0; i<numCampers; i++) {
                    let newRow = []
                    newRow[0] = randomValueFromArray(names.first)
                    newRow[1] = randomValueFromArray(names.last)
                    newRow[2] = cabin
                    newRow[3] = randomValueFromArray(classes).title //change so we can't repeat
                    newRow[4] = randomValueFromArray(classes).title
                    newRow[5] = randomValueFromArray(classes).title
                    newRow[6] = randomValueFromArray(classes).title
                    newRow[7] = randomValueFromArray(classes).title
                    table.push(newRow)
                }
            }
        }

    }

	render() {
        return(
            <div style={{marginTop: "20px"}}>
                <button onClick={this.generate}>generate example</button>
            </div>
        )
    }
}

export default Example;