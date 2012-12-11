// JavaScript Document
var planPhases, timeSpent, defectsInjected, defectsRemoved;


timeSpent = [ ];
defectsInjected = [ ];
defectsRemoved = [ ];


var updateProjectPlan = function () {
  /********************************/
	/*  the purpose of this function
		is to */
	/********************************/
	"use strict";	
	var counter, secondaryCounter, totalPhaseTime, totalDefectsInjected, totalDefectsRemoved, grandTotalPhaseTime, grandTotalDefectsInjected, grandTotalDefectsRemoved, TStimeSpentToDate, DItimeSpentToDate, DRtimeSpentToDate, toDatePercent, planned;

	totalPhaseTime = 0;
	totalDefectsInjected = 0;
	totalDefectsRemoved = 0;
	planned = 0;

	grandTotalPhaseTime = 0;
	grandTotalDefectsInjected = project.DefectLog.length;
	grandTotalDefectsRemoved = project.DefectLog.length;

	TStimeSpentToDate = 0;
	DItimeSpentToDate = 0;
	DRtimeSpentToDate = 0;

	if (project.Plan.hasOwnProperty('defectsInjected') === true) {
		planLog.timeSpent = project.Plan.timeSpent;
		planLog.defectsInjected = project.Plan.defectsInjected;
		planLog.defectsRemoved = project.Plan.defectsRemoved;

		/*DItimeSpentToDate = planLog.defectsInjected[counter].actual;
		DRtimeSpentToDate = planLog.defectsRemoved[counter].actual;*/
	} else /*if ( project.Plan === undefined)*/ {
		project.Plan.timeSpent = [ ];
		project.Plan.defectsInjected = [ ]; 
		project.Plan.defectsRemoved = [ ];

	}
	// in order to calc each phases % to-date, the total amount (grandTotal) must be known before hand.
	// for each item in the timeLog, add its total time to the grand total.
	for (counter = 0; counter < project.TimeLog.length; counter +=1) {
		grandTotalPhaseTime = grandTotalPhaseTime + project.TimeLog[counter].deltaTime;	
	}

	for (counter = 0; counter < project.Phases.length; counter += 1) {
		//planLog.timeSpent[project.Phases[counter]] = { };
		secondaryCounter = 0;
		while (secondaryCounter < project.TimeLog.length) {
			if (project.TimeLog[secondaryCounter].phase === project.Phases[counter]) {
				totalPhaseTime = totalPhaseTime + project.TimeLog[secondaryCounter].deltaTime;
			}
			secondaryCounter += 1;
		}
		if (project.Plan.timeSpent[counter]!== undefined ) {
			planned = project.Plan.timeSpent[counter].planned;
			TStimeSpentToDate = planLog.timeSpent[counter].actual;			
		}


		//TStimeSpentToDate = TStimeSpentToDate + totalPhaseTime;
		toDatePercent =  ((TStimeSpentToDate/grandTotalPhaseTime) * 100);

		project.Plan.timeSpent[counter] = { phaseName: project.Phases[counter], planned: planned, actual: totalPhaseTime, toDate: TStimeSpentToDate, toDatePercent: toDatePercent};
		totalPhaseTime = 0;
		TStimeSpentToDate = 0;
	}

	for (counter = 0; counter < project.Phases.length; counter += 1) {
		//planLog.timeSpent[project.Phases[counter]] = { };
		secondaryCounter = 0;
		while (secondaryCounter < project.DefectLog.length) {
			if (project.DefectLog[secondaryCounter].injectPhase === project.Phases[counter]) {
				totalDefectsInjected +=1;
			}
			secondaryCounter += 1;
		}
		DItimeSpentToDate = DItimeSpentToDate + totalDefectsInjected;
		toDatePercent = ((DItimeSpentToDate/grandTotalDefectsInjected) *100);
		project.Plan.defectsInjected[counter] = { phaseName: project.Phases[counter], actual: totalDefectsInjected, toDate: DItimeSpentToDate, toDatePercent: toDatePercent};
		totalDefectsInjected = 0;
		DItimeSpentToDate = 0;
	}

	for (counter = 0; counter < project.Phases.length; counter += 1) {
		//planLog.timeSpent[project.Phases[counter]] = { };
		secondaryCounter = 0;
		while (secondaryCounter < project.DefectLog.length) {
			if (project.DefectLog[secondaryCounter].removePhase === project.Phases[counter]) {
				totalDefectsRemoved += 1;
			}
			secondaryCounter += 1;
		}
		DRtimeSpentToDate = DRtimeSpentToDate + totalDefectsRemoved;
		toDatePercent = ((DRtimeSpentToDate/grandTotalDefectsRemoved) *100);
		project.Plan.defectsRemoved[counter] = { phaseName: project.Phases[counter], actual: totalDefectsRemoved, toDate: DRtimeSpentToDate, toDatePercent: toDatePercent};
		totalDefectsRemoved = 0;
		DRtimeSpentToDate = 0;
	}
	saveProject("PlanLog");
	console.log(planLog);
};

var updatePlannedTimeSpent = function (selectedPhase) {
	/********************************/
	/*  the purpose of this function
		is to */
	/********************************/
	"use strict";	
	var updateAmount;

	if (document.getElementById('plannedInput') !== null) {
		updateAmount = document.getElementById('plannedInput').value;
	} else {
		updateAmount = project.Plan.timeSpent[selectedPhase].planned;
	}
	//planLog.timeSpent[selectedPhase].planned = updateAmount;
	project.Plan.timeSpent[selectedPhase].planned = updateAmount;
	clearHTML(0);
	viewPlanLog();
};

var planLogAlternateWindow = function ( selectedPhase ) {
	/********************************/
	/*  the purpose of this function
		is to */
	/********************************/
	"use strict";	
	var currentPlanned, newPlanned, buttons;

	currentPlanned = 'Your Current Plan for this Phase is: <input type="text" value="'+ project.Plan.timeSpent[selectedPhase].planned + '" readonly="readonly" />';
	newPlanned = 'Enter new planned Time for this Phase: <input type="text" id="plannedInput" />';
	buttons = '<input type="button" value="Update" id="updateButton" /> <input type="button" value="Cancel" id="cancelButton" />';

	altWindow.innerHTML = currentPlanned + '</br>' + newPlanned  + '</br>' + buttons;

	document.getElementById('updateButton').onclick = function () {updatePlannedTimeSpent(selectedPhase)};
	document.getElementById('cancelButton').onclick = function () {viewPlanLog()};
	document.getElementById('cancelButton').onclick = function () {clearHTML(2)}
};

var viewPlanLog = function () {
	/********************************/
	/*  the purpose of this function
		is to */
	/********************************/
	"use strict";	
	var pageText, tableStart, timeSpentTable, tableEnd, defectsInjectedTable, defectsRemovedTable, controlButtons, counter;

	updateProjectPlan();
	controlButtons = '<input type="button" value="Save & Return" id="ReturnButton" /> ';
	tableStart = '<table border="1" style="width:500px">';
	tableEnd = '</table>';
	timeSpentTable = '<p>Time Spent per-phase: </p>' + tableStart + '<tr><th>Phase:</th><th>Planned Time(m):</th> <th>Actual-Time(m):</th><th>Time to-date:</th><th>To-Date %:</th></tr>';
	defectsInjectedTable = '<p>Defects Injected: </p>' + tableStart + '<tr><th>Phase:</th><th>Defects-Injected:</th><th>Injected to-date:</th><th>To-Date %:</th></tr>';
	defectsRemovedTable = '<p>Defects Removed: </p>' + tableStart + '<tr><th>Phase:</th><th>Defects-Removed:</th><th>Removed to-date:</th><th>To-Date %:</th></tr>';

	for (counter = 0; counter < project.Plan.timeSpent.length; counter +=1) {
		timeSpentTable = timeSpentTable + '<tr> <th>' + project.Plan.timeSpent[counter].phaseName + '</th> <th> <input type="button" id="' + project.Plan.timeSpent[counter].phaseName + 'TimeSpent" value="' + project.Plan.timeSpent[counter].planned +'" style="width:50px"/></th> <th>' + project.Plan.timeSpent[counter].actual + '</th> <th>' + project.Plan.timeSpent[counter].toDate + '</th> <th>' + project.Plan.timeSpent[counter].toDatePercent + '</th> </tr>';
	}
	timeSpentTable = timeSpentTable + tableEnd;

	for (counter = 0; counter < project.Plan.defectsInjected.length; counter +=1) {
		defectsInjectedTable = defectsInjectedTable + '<tr> <th>' + project.Plan.defectsInjected[counter].phaseName + '</th><th>' + project.Plan.defectsInjected[counter].actual + '</th> <th>' + project.Plan.defectsInjected[counter].toDate + '</th> <th>' + project.Plan.defectsInjected[counter].toDatePercent + '</th> </tr>';
	}
	defectsInjectedTable = defectsInjectedTable + tableEnd;

	for (counter = 0; counter < project.Plan.defectsRemoved.length; counter +=1) {
		defectsRemovedTable = defectsRemovedTable + '<tr> <th>' + project.Plan.defectsRemoved[counter].phaseName + '</th><th>' + project.Plan.defectsRemoved[counter].actual + '</th> <th>' + project.Plan.defectsRemoved[counter].toDate + '</th> <th>' + project.Plan.defectsRemoved[counter].toDatePercent + '</th> </tr>';
	}
	defectsRemovedTable = defectsRemovedTable + tableEnd;


	mainWindow.innerHTML = timeSpentTable + defectsInjectedTable + defectsRemovedTable + controlButtons;

	for (counter = 0; counter < project.Plan.timeSpent.length; counter +=1) {
		document.getElementById(project.Plan.timeSpent[counter].phaseName + 'TimeSpent').onclick = (function() {var current_counter = counter; return function	() {planLogAlternateWindow(current_counter);
			}
   		})();
	}


	document.getElementById('ReturnButton').onclick = function () {saveProject("PlanLog")};
	document.getElementById('ReturnButton').onclick = function () {chooseLog()};
};