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

    checkNewClass(editingId) {
        this.setState( { error: "" } )
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
        if (editingId) {
            let editingIndex;
            for (let i=0; i<oldClasses.length; i++) {
                if (oldClasses[i].id===editingId) {
                    editingIndex = i
                    console.log("editing index: ", editingIndex)
                    break
                }
            }
            if (editingIndex===undefined) {
                console.log("err: can't find the class you're editing")
                return
            }
            newClasses[editingIndex] = {
                title: theForm.title,
                desc: theForm.desc,
                minClasses: theForm.minClasses,
                maxClasses: theForm.maxClasses,
                minCampers: theForm.minCampers,
                maxCampers: theForm.maxCampers,
                id: editingId,
                enabled: true,
                doublePd: theForm.doublePd
            }
        } else {
            let maxId = 0
            for (let lesson of oldClasses) if (lesson.id > maxId) maxId = lesson.id
            newClasses.push({
                title: theForm.title,
                desc: theForm.desc,
                minClasses: theForm.minClasses,
                maxClasses: theForm.maxClasses,
                minCampers: theForm.minCampers,
                maxCampers: theForm.maxCampers,
                id: maxId + 1,
                enabled: true,
                doublePd: theForm.doublePd
            })
        }
		this.props.postNewClasses(newClasses)
	}

	render() {
        if (!this.props.addingClass) return null
        let defaultValues = {}
        let topText = "Add a class"
        let editing = false
        if (this.props.addFormPos > 0 && this.props.addFormPos < 9999) {
            let classIndex;
            for (let i=0; i<this.props.classes.length; i++) {
                if (this.props.addFormPos===this.props.classes[i].id) {
                    classIndex = i
                    break;
                }
            }
            defaultValues = this.props.classes[classIndex]
            topText = "Edit class"
            editing = this.props.addFormPos
        }
        return (
            <div>
                <h3 style={{marginTop: "40px"}}>{topText}</h3>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <div style={{marginBottom: "10px", display: "flex", flexDirection: "column", alignSelf: "flex-start"}}>
                        <label>Title</label>
                        <input name="title" ref={this.title} defaultValue={defaultValues.title}/>
                    </div>
                    <div style={{marginBottom: "10px", display: "flex", flexDirection: "column", alignSelf: "flex-start"}}>
                        <label>Description</label>
                        <input name="desc" ref={this.desc} defaultValue={defaultValues.desc}/>
                    </div>
                    <div style={{marginBottom: "10px", display: "flex", flexDirection: "column", alignSelf: "flex-start"}}>
                        <label># of Classes</label>
                        <div>
                            <input
                                name="minClasses" ref={this.minClasses} defaultValue={defaultValues.minClasses}
                                type="number" className="num-input" min="0" max="3"
                            />{" - "}
                            <input 
                                name="maxClasses" ref={this.maxClasses} defaultValue={defaultValues.maxClasses}
                                type="number" className="num-input" min="1" max="3"
                            />
                        </div>
                    </div>
                    <div style={{marginBottom: "10px", display: "flex", flexDirection: "column", alignSelf: "flex-start"}}>
                        <label># of Campers</label>
                        <div>
                            <input
                                name="minCampers" ref={this.minCampers} defaultValue={defaultValues.minCampers}
                                type="number" className="num-input" min="1"
                            />{" - "}
                            <input
                                name="maxCampers" ref={this.maxCampers} defaultValue={defaultValues.maxCampers}
                                type="number" className="num-input" min="1"
                            />
                        </div>
                    </div>
                    <div style={{marginBottom: "10px"}}>
                        <label>Double Period?
                            <input
                                type="checkbox" name="doublePd" ref={this.doublePd}
                                defaultChecked={defaultValues.doublePd}
                            />
                        </label>
                    </div>
                </div>
                <div>
                    <button onClick={() => this.checkNewClass(editing)} style={{marginRight: "20px"}}>save</button>
                    <button onClick={this.props.addClassSwitch}>cancel</button>
                </div>
                <h4 style={{color: "red"}}>{this.state.error}</h4>
            </div>
        )
    }
}

export default AddClassForm;