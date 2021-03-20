import React from 'react'
import './styles.css'

class AddClassForm extends React.Component {
    constructor() {
        super()
        this.state = {
            error: ""
        }

        this.checkNewClass = this.checkNewClass.bind(this);

        this.title = React.createRef()
        this.desc = React.createRef()
        this.minClasses = React.createRef()
        this.maxClasses = React.createRef()
        this.minCampers = React.createRef()
        this.maxCampers = React.createRef()
        this.doublePd = React.createRef()
    }

    checkNewClass() {
		let theForm = {
            title: this.title.current.value,
            desc: this.desc.current.value,
            minClasses: Number(this.minClasses.current.value),
            maxClasses: Number(this.maxClasses.current.value),
            minCampers: Number(this.minCampers.current.value),
            maxCampers: Number(this.maxCampers.current.value),
            doublePd: this.doublePd.current.checked
        }
		let oldClasses = this.props.classes

		//check for empty fields
		if (theForm.desc==="") theForm.desc = "No description"
		for (let prop in theForm) {
			if (prop!=="error" && theForm[prop]==="") {
				this.setState( { error: `Error: field "${prop}" is empty` } )
				return
			}
		}

		//check title and desc for length
		if (theForm.title.length > 50) {
			this.setState( { error: `Error: Title is ${theForm.title.length} chars, max is 50` } )
			return
		} else if (theForm.desc.length > 100) {
			this.setState( { error: `Error: Description is ${theForm.title.length} chars, max is 100` } )
			return
		}

		//make sure numbers input are non negative ints
		let integers = [
			theForm.minClasses,
			theForm.maxClasses,
			theForm.minCampers,
			theForm.maxCampers
		]

		for (let num of integers) {
			if (isNaN(num) || num < 0 || num%1) {
				this.setState( { error: `Error: a number field is not a non-negative integer` } )
				return
			}
		}

		//make sure nums are within range
		if (integers[0] > 3) {
			this.setState( { error: `Error: minClasses must be 3 or less` } )
			return
		} else if (integers[1] < 1 || integers[1] > 3) {
			this.setState( { error: `Error: maxClasses must be between 1 and 3 (incl)` } )
			return
		} else if (integers[2] < 1 || integers[2] < 1 ) {
			this.setState( { error: `Error: minCampers and maxCampers both must be at least 1` } )
			return
		} else if (integers[0] > integers[1] || integers[2] > integers[3]){
			this.setState( { error: `Error: mins must be less than respective maxes` } )
			return
		}

		//tests passed
		let newClasses = oldClasses
        let maxId = 0
        for (let lesson of oldClasses) if (lesson.id > maxId) maxId = lesson.id
		newClasses.push({
			title: theForm.title,
			desc: theForm.desc,
			minClasses: Number(theForm.minClasses),
			maxClasses: Number(theForm.maxClasses),
			minCampers: Number(theForm.minCampers),
			maxCampers: Number(theForm.maxCampers),
            id: maxId + 1,
            enabled: true,
            doublePd: theForm.doublePd
		})
		this.props.postNewClasses(newClasses)
	}

	render() {
        if (!this.props.addingClass) return null
        return (
            <div>
                <h3 style={{marginTop: "40px"}}>Add a class</h3>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <div style={{marginBottom: "10px", display: "flex", flexDirection: "column", alignSelf: "flex-start"}}>
                        <label>Title</label>
                        <input name="title" ref={this.title}/>
                    </div>
                    <div style={{marginBottom: "10px", display: "flex", flexDirection: "column", alignSelf: "flex-start"}}>
                        <label>Description</label>
                        <input name="desc" ref={this.desc}/>
                    </div>
                    <div style={{marginBottom: "10px", display: "flex", flexDirection: "column", alignSelf: "flex-start"}}>
                        <label># of Classes</label>
                        <div>
                            <input
                                name="minClasses" ref={this.minClasses}
                                type="number" className="num-input" min="0" max="3"
                            />{" - "}
                            <input 
                                name="maxClasses" ref={this.maxClasses}
                                type="number" className="num-input" min="1" max="3"
                            />
                        </div>
                    </div>
                    <div style={{marginBottom: "10px", display: "flex", flexDirection: "column", alignSelf: "flex-start"}}>
                        <label># of Campers</label>
                        <div>
                            <input
                                name="minCampers" ref={this.minCampers}
                                type="number" className="num-input" min="1"
                            />{" - "}
                            <input
                                name="maxCampers" ref={this.maxCampers}
                                type="number" className="num-input" min="1"
                            />
                        </div>
                    </div>
                    <div style={{marginBottom: "10px"}}>
                        <label>Double Period?
                            <input type="checkbox" name="doublePd" ref={this.doublePd}/>
                        </label>
                    </div>
                </div>
                <div>
                    <button onClick={this.checkNewClass} style={{marginRight: "20px"}}>add</button>
                    <button onClick={this.props.addClassSwitch}>cancel</button>
                </div>
                <h4 style={{color: "red"}}>{this.state.error}</h4>
            </div>
        )
    }
}

export default AddClassForm;