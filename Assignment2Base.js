// JavaScript Document
var project, mainWindow, altWindow, defectLog, planLog, timeLog, phases;
defectLog = [ ];
timeLog = [ ];
planLog =  { };
phases = [ ];
types = [ ];
mainWindow = document.getElementById('div1'); 
altWindow = document.getElementById('div2');

var clearHTML = function (windowNum) {
   /********************************/
	/*  the purpose of this function
		is to clear the screen of all
		current html */
	/********************************/
	"use strict";
	mainWindow = document.getElementById('div1'); 
	altWindow = document.getElementById('div2');
	if (windowNum === 0) {
		mainWindow.innerHTML = ' ';
		altWindow.innerHTML = ' ';
	} else if (windowNum === 1) {
		mainWindow.innerHTML = ' ';
	} else if (windowNum === 2) {
		altWindow.innerHTML = ' ';
	} else {
	alert('incorrect number call!, please pass either 0,1, or 2!');
	return;	
	}
};


var chooseLog = function() {
	/********************************/
	/*  the purpose of this function
		is to allow the user to easily
		choose which log they would like
		to view */
	/********************************/
	"use strict";
	mainWindow = document.getElementById('div1'); 
	altWindow = document.getElementById('div2');

	mainWindow.innerHTML = '<p> What do you want to View? </p> <input type="button" id="viewPlan" value="Plan" /> <input type="button" id="viewTimeLog" value="Time Log" /> <input type="button" id="viewDefectLog" value="Defect Log" />'; 

	//altWindow.innerHTML = ' <br /><p> Or Return to Project Select: </p> <input type="button" id="returnToHome" value="Select Project" />';

	document.getElementById('viewTimeLog').onclick = function () {viewLog('TimeLog'); };
	document.getElementById('viewDefectLog').onclick = function () {viewLog('DefectLog'); }
	document.getElementById('viewPlan').onclick = function () {viewPlanLog(); }
	//document.getElementById("returnToHome").onclick = function () {init(); };
};

var loadProject = function (type) {
	 /********************************/
	/*  the purpose of this function
		is to load a project from storage
		or one that is created, into the
		global variable project for use */
	/********************************/
	"use strict";
	mainWindow = document.getElementById('div1'); 
	altWindow = document.getElementById('div2');

	var loadingProject, projectName, selectedValue, selectedFile;

	if (document.getElementById("projectList") === null) {

		if (document.getElementById('projectName') !== null) {
			selectedValue = document.getElementById('projectName').value + '.project';
			loadingProject = localStorage.getItem(selectedValue);
			project = JSON.parse(loadingProject);

		} else if (document.getElementById('projectName') === null) {
			selectedValue = project.Name;
			loadingProject = localStorage.getItem(selectedValue);
			project = JSON.parse(loadingProject);
		}

	} else if (document.getElementById("projectList") !== null) {
		selectedValue = document.getElementById('projectList');
		selectedFile = selectedValue.selectedIndex;
        if (selectedFile === -1) {  // is there a file selected to load?
		// -1 is the equivilant of null in this instance
            alert('No file selected!');
            return;
        } 
	

        // if there is a file selected: load it, and update the global variables with its stored data
        loadingProject = localStorage.getItem(localStorage.key(selectedFile));
        project = JSON.parse(loadingProject);	
	}

	if ( document.getElementById("projectList") !== null ) {
		mainWindow.addEventListener('change', chooseLog(), false);
	} else if (document.getElementById("projectName") !== null) {
		mainWindow.addEventListener('change', chooseLog(), false);
	} else if (type = "PlanLog") {
		return;
	} else {
		mainWindow.addEventListener('change', viewLog(type), false);	
	}

};

var saveProject = function(type) {
	 /********************************/
	/*  the purpose of this function
		is to save the project that the
		user named in the function 
		'createProject' */
	/********************************/
	"use strict";
	mainWindow = document.getElementById('div1'); 
	altWindow = document.getElementById('div2');

	var projectName;

	if (document.getElementById('projectName') !== null) {
		projectName = document.getElementById('projectName').value;
		projectName = projectName + '.project';
	} else if ( project !== null) {
		projectName = project.Name;
		phases = project.Phases;
		types = project.Types;
		timeLog = project.TimeLog;
		defectLog = project.DefectLog;
		planLog = project.Plan;
	}
	project = {Name: projectName, Phases: phases, Types: types, TimeLog: timeLog, DefectLog: defectLog, Plan: planLog };

	localStorage.setItem(projectName, JSON.stringify(project)); // save the object as a string, and as a .txt
	console.log(localStorage.getItem(projectName) + ' saved As ' + projectName);

	mainWindow.addEventListener('change', loadProject(type), false);
};

var createProject = function() {
	/********************************/
	/*  the purpose of this function
		is to prompt the user for a name
		to call the project they're 
		going to create/ work on */
	/********************************/
	"use strict";
	var ProjectName;
	mainWindow = document.getElementById('div1'); 
	altWindow = document.getElementById('div2');
	mainWindow.innerHTML = 'Choose a name for your Project: <input type"text" id="projectName" /> <br /> <input type="button" id="beginProject" value="Begin Project" />';

	document.getElementById('beginProject').onclick = function () {saveProject('null'); };
};

var init = function () {
	/********************************/
	/*  the purpose of this function
		is to load the first screen 
		when the page is loaded, and
		to set the variables mainWindow
		and altWindow */
	/********************************/
	"use strict";
	// I need to restrict the localStorage to .projects!!!
	clearHTML(0);
	var mainWindow, listStart, listObject, endList, position = 0, altWindow, altWindowText, checkName, loopCounter, listArray;
	mainWindow = document.getElementById('div1'); 
	altWindow = document.getElementById('div2');
	listStart = '<p>Welcome! Select Project: </p> <select id="projectList">';
	endList = '</ select>';
	altWindowText =  '<br /> <p> OR </p> <input type="button" value="Create Project" id="createProject" />';

	for (loopCounter = 0; position < localStorage.length; loopCounter += 1) {
		checkName = localStorage.getItem(localStorage.key(position)).match(/(\.project)+/);
		if (checkName === null) {
			position += 1;
		} else {
			listObject = '<option value="' + localStorage.getItem(localStorage.key(position)) + '"> ' + localStorage.key(position) + '</option>';
			listStart = listStart + listObject;
			position += 1;
		}
	}

	 //HTML
	mainWindow.innerHTML = listStart + endList + '<input type="button" value="Select Project" id="selectProject" />' + altWindowText;

	document.getElementById('createProject').onclick = function () {createProject(); };
	document.getElementById('selectProject').onclick = function () {loadProject('null'); };
};

window.onload = init;