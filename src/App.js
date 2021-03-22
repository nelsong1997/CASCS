import React from 'react'
import Classes from './Classes.js'
import './styles.css'

class App extends React.Component {
	constructor() {
		super()
		this.state = {
			classes: [],
			addingClass: false,
			classesLoading: true,
			addFormPos: 0
		}

		this.addClassSwitch = this.addClassSwitch.bind(this);
		this.postNewClasses = this.postNewClasses.bind(this);
		this.deleteClass = this.deleteClass.bind(this);
		this.toggleClass = this.toggleClass.bind(this);
	}

	async componentDidMount () {
		let response = await fetch('/classes', {
			method: "GET",
			headers: {
			  'Content-Type': 'application/json'
		}});
		let result = await response.json();
		this.setState( { classes: result, classesLoading: false } )
	}

	async postNewClasses(newClasses) { //all classes + new ones
		this.setState( { classesLoading: true } )
		let response = await fetch('/classes', {
			method: "POST",
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(newClasses)
		});
		if (response.ok) {
			this.setState({
				classes: newClasses,
				addingClass: false,
				editingClass: false,
				classesLoading: false,
				addFormPos: 0
			})
		} //else?
	}

	addClassSwitch(pos) {
		let position = 0
		if ((pos && typeof(pos)==="number")) position = pos
		this.setState( { addingClass: !this.state.addingClass, addFormPos: position } )
	}

	deleteClass(deleteId) {
		let oldClasses = this.state.classes
		let deleteIndex;
		for (let i=0; i<oldClasses.length; i++) {
			if (oldClasses[i].id===deleteId) deleteIndex = i
		}
		let newClasses = oldClasses.slice(0, deleteIndex).concat(oldClasses.slice(deleteIndex + 1))
		this.setState( { classes: newClasses } )
		this.postNewClasses(newClasses)
	}

	toggleClass(classId) {
		let oldClasses = this.state.classes
		let toggleIndex;
		for (let i=0; i<oldClasses.length; i++) {
			if (oldClasses[i].id===classId) toggleIndex = i
		}
		let newClasses = oldClasses
		newClasses[toggleIndex].enabled = !newClasses[toggleIndex].enabled
		this.setState( { classes: newClasses } )
		this.postNewClasses(newClasses)
	}

	render() {
		let addClassButtons = [null, null]
		if (!this.state.addingClass) addClassButtons = [
			<button key="0" onClick={() => this.addClassSwitch(0)}>add a class</button>,
			<button key="1" onClick={() => this.addClassSwitch(9999)}>add a class</button>
		]
		return (
			<div>
				<h1>CASCS: Camp Abnaki Skill Class Scheduler</h1>
				{addClassButtons[0]}
				<Classes
					classes={this.state.classes}
					classesLoading={this.state.classesLoading}
					deleteClass={this.deleteClass}
					toggleClass={this.toggleClass}
					addingClass={this.state.addingClass}
					postNewClasses={this.postNewClasses}
					addClassSwitch={this.addClassSwitch}
					addFormPos={this.state.addFormPos}
				/>
				{addClassButtons[1]}
				<div>
					<input type="file" id="hi"/>
					<button onClick={()=>{
						let theFile = document.getElementById("hi").files[0]
						console.log(theFile)
						let betterFile = new File([theFile], "download.csv", {type: "text/csv", webkitRelativePath: "../public"})
						console.log(betterFile)
						let urlThing = URL.createObjectURL(betterFile) //at this point i dont think im supposed to even use this func
						let anchor = document.createElement("a")
						anchor.href = urlThing
						anchor.textContent = "hello"
						document.getElementById("root").appendChild(anchor)
					}}>click me</button>
				</div>
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