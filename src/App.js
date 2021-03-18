import React from 'react'
import './App.css'

class App extends React.Component {
	constructor() {
		super()
		this.state = {
			classes: [],
			addingClass: false
		}

		this.addClass = this.addClass.bind(this);
		this.stateSwitch = this.stateSwitch.bind(this)
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

	async addClass() {
		let oldClasses = this.state.classes
		let newClasses = oldClasses
		newClasses.push({
			title: "Table Flipping",
			min: 3,
			max: 3
		})
		let response = await fetch('/classes', {
			method: "POST",
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(newClasses)
		});
		if (response.ok) this.setState( { classes: newClasses } )
		console.log(newClasses)
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
							<input/>
						</div>
						<div style={{marginBottom: "10px", display: "flex", flexDirection: "column", alignSelf: "flex-start"}}>
							<label>Description</label>
							<input/>
						</div>
						<div style={{marginBottom: "10px", display: "flex", flexDirection: "column", alignSelf: "flex-start"}}>
							<label># of Classes</label>
							<div>
								<input type="number" className="num-input" min="1" max="3"/> - <input type="number" className="num-input" min="1" max="3"/>
							</div>
						</div>
						<div style={{marginBottom: "10px", display: "flex", flexDirection: "column", alignSelf: "flex-start"}}>
							<label># of Campers</label>
							<div>
								<input type="number" className="num-input" min="2"/> - <input type="number" className="num-input"/>
							</div>
						</div>
					</div>
					<div>
						<button style={{marginRight: "20px"}}>add</button>
						<button onClick={() => this.stateSwitch("addingClass")}>cancel</button>
					</div>
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
