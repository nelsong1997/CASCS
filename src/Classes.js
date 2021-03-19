import React from 'react'
import './styles.css'

class Classes extends React.Component {
	render() {
        let theClasses = []
		if (!this.props.classes.length && this.props.classesLoading) { 
            return <p>Loading classes...</p>
        } else if (!this.props.classes.length && !this.props.classesLoading) {
            return <p>No classes.</p>
        } else {
            let keyNum = 0
            for (let lesson of this.props.classes) { //class is a keyword :(
                theClasses.push(
                    <div key={keyNum++}>
                        <div style={{display: "flex"}}>
                            <h3>{lesson.title}</h3>
                            <button style={{marginLeft: "15px", alignSelf: "center"}}>edit</button>
                            <button style={{marginLeft: "15px", alignSelf: "center"}}>disable</button>
                            <button
                                style={{marginLeft: "15px", alignSelf: "center"}}
                                onClick={() => this.props.deleteClass(lesson.id)}>delete
                            </button>
                        </div>
                        <label><em>{lesson.desc}</em></label>
                        <div>
                            <p>
                                <strong># Classes:</strong> {lesson.minClasses}-{lesson.maxClasses}
                            </p>
                            <p>
                                <strong># Campers:</strong> {lesson.minCampers}-{lesson.maxCampers}
                            </p>
                        </div>
                    </div>
                )
            }
            return (
                <div>
                    <h2 style={{marginBottom: "0px"}}>Classes List</h2>
                    {theClasses}
                </div>
            )
        }		
    }
}

export default Classes;