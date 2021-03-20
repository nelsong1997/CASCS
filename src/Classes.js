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
                let fontStyle = null
                let fontColor = "black"
                let editButton = <button style={{marginLeft: "15px", alignSelf: "center"}}>edit</button>
                let toggleText = "disable"
                if (!lesson.enabled) {
                    fontStyle = "italic"
                    fontColor = "gray"
                    editButton = null
                    toggleText = "enable"
                }
                let doublePdText = null
                if (lesson.doublePd) doublePdText = [
                    <p key="0" style={{marginTop: "0px", fontStyle: fontStyle, color: fontColor}}>
                        <strong>Double Period</strong>
                    </p>
                ]
                theClasses.push(
                    <div key={keyNum++}>
                        <div style={{display: "flex"}}>
                            <h3 style={{fontStyle: fontStyle, color: fontColor}}>{lesson.title}</h3>
                            {editButton}
                            <button
                                style={{marginLeft: "15px", alignSelf: "center"}}
                                onClick={()=> this.props.toggleClass(lesson.id)}>{toggleText}
                            </button>
                            <button
                                style={{marginLeft: "15px", alignSelf: "center"}}
                                onClick={() => this.props.deleteClass(lesson.id)}>delete
                            </button>
                        </div>
                        {doublePdText}
                        <label style={{fontStyle: fontStyle, color: fontColor}}><em>{lesson.desc}</em></label>
                        <div>
                            <p style={{fontStyle: fontStyle, color: fontColor}}>
                                <strong># Classes:</strong> {lesson.minClasses}-{lesson.maxClasses}
                            </p>
                            <p style={{fontStyle: fontStyle, color: fontColor}}>
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