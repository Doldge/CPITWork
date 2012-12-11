// JavaScript Document
mainWindow = document.getElementById('div1'); 
altWindow = document.getElementById('div2');
var numSubTypesAdded, phaseStartTime, phaseEndTime, phaseBreakTime = 0, breakEndTime, breakStartTime, pauseTimerCount = 0, phaseTotalTime = 0;

var deleteLogInstance = function(type) {
  /********************************/
	/*  the purpose of this function
		is to delete an instance of a
		log type from the working project */
	/********************************/
	"use strict";

	var selectedValue = document.getElementById('inputList'), selectedInstance = selectedValue.selectedIndex, retrievedObject, newNumber;

	if (selectedInstance === -1) { //is there a file selected?
		// -1 is the equivilant of null in this instance
		alert('no file selected!');
		return;
	}

	// if there is a file selected: delete it from storage and reload the page to display that it is gone.

	 //delete the selected instance, and move everything back in the array by 1.
	project[type].splice(selectedInstance, 1);	

	saveProject(type);
	document.getElementById('deleteInstanceButton').addEventListener('change', viewLog(type), false);
	
};

var addTimeLogToProject = function (type) {
	/********************************/
	/*  the purpose of this function
		is to add the newly created
		TimeLog instance to the project */
	/********************************/
	"use strict";
	var length, comment, allPhases, selectedPhaseOne, selectedPhaseTwo, counter, arrayPosition = 0;
	length = project[type].length;

	//retrieve user inputs.
	comment = document.getElementById("comment").value;
	allPhases = document.getElementsByName("Phases");

	// go through all of the radio button subTypes, untill you find the one that is selected.
	for (counter = 0; counter < allPhases.length; counter += 1) {
		if ( allPhases.item(counter).checked === true) {
			selectedPhaseOne = allPhases.item(counter).value;
		}
	}

	// set the array Position to the array length (length = actual position + 1)
	for (arrayPosition = 0; arrayPosition < project[type].length; arrayPosition += 1) {
	}
	// add instance to project log Type, and then call some functions.
		if (type === "TimeLog") {
			project[type][arrayPosition] =  {phase : selectedPhaseOne, startTime : phaseStartTime, breakTime : phaseBreakTime, endTime : phaseEndTime, deltaTime : phaseTotalTime, comment : comment};
		}

};

var addArrayToType = function (type) {
	/********************************/
	/*  the purpose of this function
		is to determine which type of
		log is being handled, and then
		to call the function that updates
		the working project, and then it
		saves the project.			*/
	/********************************/
	if (type === "TimeLog") {
		addTimeLogToProject(type);
	} else if (type === "DefectLog") {
		addDefectLogToProject(type);
	}  else {
		alert("Error!");
		return;
	}

	mainWindow.addEventListener('change', saveProject(type), false);
	mainWindow.addEventListener('change', viewLog(type), false);
};

var checkSubTypeLimit = function(subType, type) {
	/********************************/
	/*  the purpose of this function
		is to verify that the number
		of subTypes added so far is 
		not greater than the number
		the user indicated they would
		add. */
	/********************************/
	"use strict";
	var numOfTypes;
	// how many subTypes did the user indicate they would add?
	numOfTypes = document.getElementById(subType + 'Amount').value;
	numOfTypes = +numOfTypes;

	//has the user entered that number of subTypes?
	if (numSubTypesAdded === numOfTypes) { //if yes, return to addLogInstance (view log instance)
		addLogInstance(type);	
	} else if (numSubTypesAdded !== numOfTypes) { //if not, return to the page to add more subTypes.
		addSubTypeHTML(subType, type, numOfTypes);
	}
};

var addSubType = function(subType, type) {
	/********************************/
	/*  the purpose of this function
		is to add the Subtype created
		by the user to the project object
		that is being worked on*/
	/********************************/
	"use strict";
	var insertValue, counter, insertPosition, numOfTypes;

	// get information from the webpage (user input).
	insertValue = document.getElementById(subType + 'Name');
	numOfTypes = document.getElementById(subType + 'Amount').value;

	// is the project's subtype Length equal to 0?
	if (project[subType].length === 0) { // if yes, insert at position 1 (array positon 0).
		insertPosition = 0;	
	} else if (project[subType].length !== 0) { //if array size is not 0, add on to end of array.
		insertPosition = project[subType].length + 1;
	}

	// add type to array at position established earlier, then increment the amount of types added so far. 
		project[subType].splice(insertPosition, 0, insertValue.value);
		numSubTypesAdded += 1;

	checkSubTypeLimit(subType, type);

};

var addSubTypeHTML = function(subType, type, value) {
	/********************************/
	/*  the purpose of this function
		is to create the html to allow 
		the user to select how many subTypes
		to create, and then name each subType,
		when the user reaches the number of subTypes
		they've selected, the page returns to
		addLogInstance view */
	/********************************/
	"use strict";
	var inputCount, name, counter, numOfTypes, insertPosition, insertValue, controlButtons;
	//HTML
	inputCount = 'Number of ' + subType + ': <input type="number" name="' + subType +'Amount"  id="'+ subType + 'Amount" value="'+ value +'"/><br />';
	name = 'Enter ' + subType + ' name: <input type="text" id="' + subType + 'Name" /> <br />'; 
	controlButtons = '<input type="button" id="saveButton" value="Okay" /> <input type="button" id="cancelButton" value="Cancel" />';

	mainWindow.innerHTML = inputCount + name + controlButtons;

	//add function
	document.getElementById('saveButton').onclick = function () {addSubType(subType, type)};
	document.getElementById('cancelButton').onclick = function () {addLogInstance(type)};
};

var timeController = function (input) {
	/********************************/
	/*  the purpose of this function
		is to do all the Log-Instance
		maths, as well as recordings */
	/********************************/
	"use strict";
	var beginTime, endTime, totalTime, minute, breakTime;

	// this number represents a minutes in milliseconds.
	minute = 1000 * 60;

	beginTime = phaseStartTime;
	breakTime = phaseBreakTime;
	endTime = phaseEndTime;

	if (input === "startTimer") { //is the input a startTimer? if yes, set begin time to Now.
		beginTime = new Date();
		phaseStartTime = beginTime;
	} else if (input !== "startTimer") { //if not

		if (input === "pauseTimer") { // is the input a pause Timer?
			pauseTimerCount = pauseTimerCount + 1;
			if (pauseTimerCount % 2 !== 0 ) { //if its the first time (uneven) the buttons push, set pause start time.			
				breakStartTime = new Date();
			} else if (pauseTimerCount % 2 === 0 ) { //else its the seconds time (even) the buttons push, set the stop time, work out the difference, and then add the difference to the already exsisting difference.
				breakEndTime = new Date();
				phaseBreakTime = phaseBreakTime + (Math.ceil((breakEndTime.getTime()-breakStartTime.getTime())/(minute)));
			}

		} else if (input !== "pauseTimer") { //if not a pause Timer

			if (input === "stopTimer") { // is the input a stop Timer? if yes, set the end time, work out the difference between the end and the start, minus any pause.
				endTime = new Date();
				phaseEndTime = endTime;
				totalTime = Math.ceil((endTime.getTime()-beginTime.getTime())/(minute)) - phaseBreakTime;
				if (totalTime > -1) { //was the delta time Positive? (total time greater than the break time)
					phaseTotalTime = totalTime;
				} else if ( totalTime < 0) { //if the delta time is not Positive (break time greater than the total time), then set total to 0.
					phaseTotaTime = 0;
				}
			} else if (input !== "stopTimer") { //if input is not a stop Timer either, than alert the user to a spelling error (function recieved wrong input).
				alert("Spelling Error occured!");
				return;
			}
		}
	}

};

var addLogInstance = function(type) {
	/********************************/
	/*  the purpose of this function
		is to host the functions are 
		used in order to display the 
		correct information for each
		log type.

		show the user all the options
		for creating a Log instance, depending
		on the log. this function should offer a
		radio button for each (phase or Type) */
	/********************************/
	"use strict";

	if (type === "TimeLog") {
		addTimeLogInstance(type);
	} else if (type === "DefectLog") {
		addDefectLogInstance(type);
	}  else {
		alert("Error!");
		return;
	}

	function addTimeLogInstance(type) {
		/********************************/
		/*  the purpose of this function
			is to show the user all the options
			for creating a TimeLog instance.
			this function should offer a
			radio button for each phase */
		/********************************/
		"use strict";
			var phaseButtons = ' ', comment, addSubTypeButton, timer, total, subType, counter, controlButtons;
		phaseStartTime = 0;

		// what type of Log is it? 
		// if its a TimeLog, allow user to create Phases.
			subType = 'Phases';


		// for each instance in the subtype create a radio button named it
		for ( counter = 0; counter < project[subType].length; counter += 1) {
				phaseButtons = phaseButtons + '<input type="radio" name="'+ subType + '" id="' + project[subType][counter] + '" value="' + project[subType][counter] + '" /> ' + project[subType][counter];
		}
			// HTML information.
		comment = '<p> Comment </p> <textarea rows="3" cols="50" id="comment"> </textarea>';
		addSubTypeButton = '<input type="button" id="addTypeButton" value="Add ' + subType + '" />';
		timer = ' <br/> <input type="button" id="startTimeButton" value="Start Timer" /> <input type="button" id="pauseTimer" value="Pause/Play Timer" /> <input type="button" id="stopTimer" value="Stop Timer" />';
		controlButtons = '<input type="button" id="saveButton" value="Okay" /> <input type="button" id="cancelButton" value="Cancel" />';

		// show the HTML on the screen
		mainWindow.innerHTML = phaseButtons + addSubTypeButton + timer + comment + '</br>' + controlButtons;

		//assign functions to each button, when the addTypeButton is clicked, reset the number of types added so far to 0.
		document.getElementById('addTypeButton').onclick = numSubTypesAdded = 0;
		document.getElementById('addTypeButton').onclick = function () {addSubTypeHTML(subType, type, 0); };
		document.getElementById('startTimeButton').onclick = function () {timeController("startTimer"); };
		document.getElementById('pauseTimer').onclick = function () {timeController("pauseTimer"); };
		document.getElementById('stopTimer').onclick = function () {timeController("stopTimer"); };
	};

	function addDefectLogInstance(type) {
		/********************************/
		/*  the purpose of this function
			is to show the user all the options
			for creating a DefectLog instance. 
			this function should offer a
			radio button for each Type,
			aswell as a drop down box 
			containing each of the project
			phases.						*/
		/********************************/
		"use strict";
		var typeButtons = 'Defect Type: ', description, addSubTypeButton, timeButtons, timeText, total, subType, counter, controlButtons, phaseInject, phaseRemove, fixReference, addPhaseButton;
		phaseStartTime = 0;

		// what type of Log is it? 
		// if its a DefectLog, set subtypes to DefectTypes.
		subType = 'Types';

		// for each instance in the subtype create a radio button named it
		for ( counter = 0; counter < project[subType].length; counter += 1) {
				typeButtons = typeButtons + '<input type="radio" name="'+ subType + '" id="' + project[subType][counter] + '" value="' + project[subType][counter] + '" /> ' + project[subType][counter];
		}

		//HTML information.
		description = '<p> Description: </p> <textarea rows="3" cols="50" id="description"> </textarea>';
		fixReference = '</br> Fix Referrence: <input type="text" id="fixReference"  style="width:240px" />';
		addSubTypeButton = '<input type="button" id="addTypeButton" value="Add Types" />';
		addPhaseButton = '<input type="button" id="addPhaseButton" value="Add Phases" />';
		controlButtons = '<input type="button" id="saveButton" value="Okay" /> <input type="button" id="cancelButton" value="Cancel" />';
		phaseInject = '</br> Inject Phase: <select name="injectList" id="injectList">';
		//for each of the phases in the project, list it in a dropdown box as an option for the defect-injection phase.
		for ( counter = 0; counter < project.Phases.length; counter += 1) {
			phaseInject = phaseInject + '<option value="' + project.Phases[counter] + '" id="' + counter + 'Inject" > '+ project.Phases[counter] + '</option>';
		}
		phaseInject = phaseInject + '</select>' + addPhaseButton;

		//for each of the phases in the project, list it in a dropdown box as an option for the defect-removel phase.
		phaseRemove = '</br> Remove Phase: <select name="removeList" id="removeList">';
		for ( counter = 0; counter < project.Phases.length; counter += 1) {
			phaseRemove = phaseRemove + '<option value="' + project.Phases[counter] + '" id="' + counter + 'Remove" > '+ project.Phases[counter] + '</option>';
		}
		phaseRemove = phaseRemove + '</select>';

		//offer the user the choice to time how-long the defect takes to fix, or to input the length of time it took.
		timeText = '<br/>Fix Time (minutes):  <input type="text" id="fixTimeInput" />';
		timeButtons = ' OR: <input type="button" id="startTimeButton" value="Start Timer" /> <input type="button" id="stopTimer" value="Stop Timer" />';

		// draw html on page.
		mainWindow.innerHTML = typeButtons + addSubTypeButton + phaseInject + phaseRemove + timeText + timeButtons + fixReference + description + '</br>' + controlButtons;

		// assign functions to button presses.
		document.getElementById('addTypeButton').onclick = numSubTypesAdded = 0;
		document.getElementById('addTypeButton').onclick = function () {addSubTypeHTML('Types', type, 0); };
		document.getElementById('addPhaseButton').onclick = numSubTypesAdded = 0;
		document.getElementById('addPhaseButton').onclick = function () {addSubTypeHTML('Phases', type, 0); };
		document.getElementById('startTimeButton').onclick = function () {timeController("startTimer"); };
		document.getElementById('stopTimer').onclick = function () {timeController("stopTimer"); };
	};

	// apply functions to buttons.
	document.getElementById('saveButton').onclick = function () {addArrayToType(type); };
	document.getElementById('cancelButton').onclick = function () {saveProject(type) };
	document.getElementById('cancelButton').onclick = function () {viewLog(type) };
};

var viewLog = function (type) {
	/********************************/
	/*  the purpose of this function
		is to list all of the instances
		of the Log Type, and offer some
		options for the user to interact
		(add/delete) instances of the log Type*/
	/********************************/
	"use strict";
	var counter, list, listObject, openList = '<select name="list" id="inputList" size="5"  style="width:1200px">', closeList = '</select>', buttons = '<input type="button" value="Add" id="addButton" /> <input type="button" value="Delete" id="deleteInstanceButton" /*disabled="disabled"*//>  <input type="button" value="Return" id="returnToLogSelection" /*disabled="disabled"*//>', text;

	// is there a log type? if not, alert the user and exit.
	if (project[type] === null) {
		alert('somthing went wrong, check console for clues!');
		console.log(project[type]);
		return;
	}
	//is the log type a TimeLog? if yes, set the text to this.
	if (type === "TimeLog") {
		text = '<p> Phase: &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;     Start-Date: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;    pause-Time(m): &nbsp; &nbsp; &nbsp;   End-Date: &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;    Delta-Time (m): &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; Comments: </p>'
	} 
		else if (type = "DefectLog") {
			text = '<p>DefectNo. &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; DefectType: &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; inject Phase: &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; Remove Phase: &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; Fix Time: &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; Fix Ref: &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; Defect Description:</p>';	
	}

	list = text + openList;
	// for each of the files stored in local storage, if the type is TimeLog
	// retrieve each timeLog by its number, 
	// and add it to the list by its name for display
	// after which, close the list html so that it displays on the page properly.
	for (counter = 0; counter < project[type].length; counter += 1) {

		if (type === "TimeLog") {	//is it a TimeLog?
			listObject = '<option value="' + counter + '" id="' + counter + 'object">' + project[type][counter].phase + '&nbsp; &nbsp; &nbsp;' + project[type][counter].startTime + '&nbsp; &nbsp; &nbsp;' + project[type][counter].breakTime + '&nbsp; &nbsp; &nbsp;' + project[type][counter].endTime + '&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp; ' + project[type][counter].deltaTime + '&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;' + project[type][counter].comment + '</option>';
		} 

	// for each of the files stored in local storage, if the type is DefectLog
	// retrieve each defectLog by its number, 
	// and add it to the list by its details for display
	// after which, close the list html so that it displays on the page properly.
			else if (type === "DefectLog") { //is it a DefectLog?
				listObject = '<option value="' + counter + '" id="' + counter + 'object">' + '&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;' + counter +'&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;' + project[type][counter].defectType +'&nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;' + project[type][counter].injectPhase + '&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp; ' + project[type][counter].removePhase + '&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;' + project[type][counter].fixTime + '&nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;' + project[type][counter].fixReference + '&nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;' + project[type][counter].description + '</option>';
			}


		list = list + listObject;
	}


	// add html to the page.
	list = list + closeList;
	mainWindow.innerHTML = list + '<br />' + buttons;


	document.getElementById('addButton').onclick = function () {addLogInstance(type); };
	document.getElementById('deleteInstanceButton').onclick = function () {deleteLogInstance(type); };
	document.getElementById('returnToLogSelection').onclick = function () {chooseLog(); };
};