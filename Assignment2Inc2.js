// JavaScript Document
var fixRef, fixTime, selectedType, fixDate;

var addDefectLogToProject = function (type) {
  /********************************/
	/*  the purpose of this function
		is to  */
	/********************************/
	"use strict";
	var length, description, allTypes, counter, arrayPosition = 0, injectPhase, selectedPhaseOne, removePhase, selectedPhaseTwo, phaseList;

	//retrieve user inputs.
	length = project[type].length;

	description = document.getElementById("description").value;
	allTypes = document.getElementsByName("Types");
	injectPhase = document.getElementById('injectList'); 
	selectedPhaseOne = injectPhase.selectedIndex;
	removePhase = document.getElementById('removeList');
	selectedPhaseTwo = removePhase.selectedIndex;
	fixRef = document.getElementById("fixReference").value;
	fixTime = document.getElementById("fixTimeInput").value;
	fixDate = new Date();
	phaseList = injectPhase.options;

	selectedPhaseOne = phaseList[selectedPhaseOne].text;
	selectedPhaseTwo = phaseList[selectedPhaseTwo].text;

	// has the user inputed a fixTime, or used the timer?
	if (fixTime === "") { //if no fixTime Input, get FixTime from Timer.
		fixTime = phaseTotalTime;
	}
	fixTime = +fixTime;

	// go through all of the radio button subTypes, untill you find the one that is selected.
	for (counter = 0; counter < allTypes.length; counter += 1) {
		if ( allTypes.item(counter).checked === true) {
			selectedType = allTypes.item(counter).value;
		}
	}

	// set the array Position to the array length (length = actual position + 1)
	for (arrayPosition = 0; arrayPosition < project[type].length; arrayPosition += 1) {
	}

	 project[type][arrayPosition] = { fixDate: fixDate, injectPhase : selectedPhaseOne, removePhase : selectedPhaseTwo, fixTime : fixTime, defectType : selectedType, fixReference : fixRef, description : description };
};