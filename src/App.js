import React from 'react'
import './App.css'

class App extends React.Component {
	constructor() {
		super()
		this.state = {
			classes: [],
			addingClass: false,
			addClassForm: {
				error: "",
				title: "",
				desc: "",
				minClasses: "",
				maxClasses: "",
				minCampers: "",
				maxCampers: ""
			}
		}

		this.stateSwitch = this.stateSwitch.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleAddClass = this.handleAddClass.bind(this);
	}

	async componentDidMount () {
		let response = await fetch('/classes', {
			method: "GET",
			headers: {
			  'Content-Type': 'application/json'
		}});
		let result = await response.json();
		this.setState( { classes: result } )
		console.log(result)
	}

	stateSwitch(prop) {
		this.setState( { [prop]: !this.state[prop] } )
	}

	handleInputChange(e) {
		let theForm = this.state.addClassForm
		theForm[e.target.name] = e.target.value
		theForm.error = ""
		this.setState( { addClassForm: theForm } )
	}

	async handleAddClass() {
		let theForm = this.state.addClassForm
		let oldClasses = this.state.classes

		//check for empty fields
		if (theForm.desc==="") theForm.desc = "No description"
		for (let prop in theForm) {
			if (prop!=="error" && theForm[prop]==="") {
				theForm.error = `Error: field "${prop}" is empty`
				this.setState( { addClassForm: theForm } )
				return
			}
		}

		//check title and desc for length
		if (theForm.title.length > 50) {
			theForm.error = `Error: Title is ${theForm.title.length} chars, max is 50`
			this.setState( { addClassForm: theForm } )
			return
		} else if (theForm.desc.length > 100) {
			theForm.error = `Error: Description is ${theForm.title.length} chars, max is 100`
			this.setState( { addClassForm: theForm } )
			return
		}

		//make sure numbers input are non negative ints
		let integers = [
			Number(theForm.minClasses),
			Number(theForm.maxClasses),
			Number(theForm.minCampers),
			Number(theForm.maxCampers)
		]

		for (let num of integers) {
			if (isNaN(num) || num < 0 || num%1) {
				theForm.error = `Error: a number field is not a non-negative integer`
				this.setState( { addClassForm: theForm } )
				return
			}
		}

		//make sure nums are within range
		if (integers[0] > 3) {
			theForm.error = `Error: minClasses must be 3 or less`
			this.setState( { addClassForm: theForm } )
			return
		} else if (integers[1] < 1 || integers[1] > 3) {
			theForm.error = `Error: maxClasses must be between 1 and 3 (incl)`
			this.setState( { addClassForm: theForm } )
			return
		} else if (integers[2] < 1 || integers[2] < 1 ) {
			theForm.error = `Error: minCampers and maxCampers both must be at least 1`
			this.setState( { addClassForm: theForm } )
			return
		} else if (integers[0] > integers[1] || integers[2] > integers[3]){
			theForm.error = `Error: mins must be less than respective maxes`
			this.setState( { addClassForm: theForm } )
			return
		}

		//tests passed
		let newClasses = oldClasses
		newClasses.push({
			title: theForm.title,
			desc: theForm.desc,
			minClasses: Number(theForm.minClasses),
			maxClasses: Number(theForm.maxClasses),
			minCampers: Number(theForm.minCampers),
			maxCampers: Number(theForm.maxCampers)
		})
		let response = await fetch('/classes', {
			method: "POST",
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(newClasses)
		});
		if (response.ok) {
			for (let prop in theForm) theForm[prop] = ""
			this.setState({
				classes: newClasses,
				addClassForm: theForm,
				addingClass: false
			})
		} else {
			theForm.error = "Error communicating with server"
			this.setState( { addClassForm: theForm } )
		}
	}

	displayClasses() {
		let theClasses = []
		if (!this.state.classes.length) return null
		for (let lesson of this.state.classes) { //class is a keyword :(
			theClasses.push(
				<div>
					<h3>{lesson.title}</h3>
					<label><em>{lesson.desc}</em></label>
					<div>
						<p>
							<strong>Min Classes:</strong> {lesson.minClasses}
							<strong> Max Classes:</strong> {lesson.maxClasses}
						</p>
						<p>
							<strong>Min Campers:</strong> {lesson.minCampers}
							<strong> Max Campers:</strong> {lesson.maxCampers}
						</p>
					</div>
				</div>
			)
		}

		return (
			<div>
				{theClasses}
			</div>
		)
	}

	displayAddNewClass() {
		if (!this.state.addingClass) {
			return (
				<button onClick={() => this.stateSwitch("addingClass")}>new class</button>
			)
		} else {
			return (
				<div>
					<h3 style={{marginTop: "40px"}}>Add a class</h3>
					<div style={{display: "flex", flexDirection: "column"}}>
						<div style={{marginBottom: "10px", display: "flex", flexDirection: "column", alignSelf: "flex-start"}}>
							<label>Title</label>
							<input name="title" onChange={this.handleInputChange}/>
						</div>
						<div style={{marginBottom: "10px", display: "flex", flexDirection: "column", alignSelf: "flex-start"}}>
							<label>Description</label>
							<input name="desc" onChange={this.handleInputChange}/>
						</div>
						<div style={{marginBottom: "10px", display: "flex", flexDirection: "column", alignSelf: "flex-start"}}>
							<label># of Classes</label>
							<div>
								<input
									name="minClasses" onChange={this.handleInputChange}
									type="number" className="num-input" min="0" max="3"
								/>{" - "}
								<input 
									name="maxClasses" onChange={this.handleInputChange}
									type="number" className="num-input" min="1" max="3"
								/>
							</div>
						</div>
						<div style={{marginBottom: "10px", display: "flex", flexDirection: "column", alignSelf: "flex-start"}}>
							<label># of Campers</label>
							<div>
								<input
									name="minCampers" onChange={this.handleInputChange}
									type="number" className="num-input" min="1"
								/>{" - "}
								<input
									name="maxCampers" onChange={this.handleInputChange}
									type="number" className="num-input" min="1"
								/>
							</div>
						</div>
					</div>
					<div>
						<button onClick={this.handleAddClass} style={{marginRight: "20px"}}>add</button>
						<button onClick={() => this.stateSwitch("addingClass")}>cancel</button>
					</div>
					<h4 style={{color: "red"}}>{this.state.addClassForm.error}</h4>
				</div>
			)
		}
	}

	render() {
		return (
			<div>
				<h1>CASCS: Camp Abnaki Skill Class Scheduler</h1>
				<div>
					<h2>Classes List</h2>
					{this.displayClasses()}
				</div>
				{this.displayAddNewClass()}
			</div>
		)
	}
}

export default App;

//new class fields
//	*certs
//	*id
//  *double pd
//  *enabled
//disable async buttons while fetching