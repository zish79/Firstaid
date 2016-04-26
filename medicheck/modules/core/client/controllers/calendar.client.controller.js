//Code taken from the folowing link
//http://angular-ui.github.io/ui-calendar/

'use strict';

var appointmentsEvents = function(AppointmentService){
    var event1 = [];
    AppointmentService.query(function (data) {
        /* event source that contains custom events on the scope */
        //console.log(data);
        angular.forEach(data, function(value, key) {
            event1.push({ 
                        title: value.appointmentDescription, 
                        start: new Date(value.startTime), 
                        end: new Date(value.endTime)
                    });
        });
    });
    return event1;
}
var selectedTime;

angular.module('core').controller('CalendarCtrl', ['$scope','$state','$compile','$http','uiCalendarConfig','AppointmentsService', 'ngDialog', 'Authentication',
function($scope,$state,$compile, $http,uiCalendarConfig,AppointmentsService, ngDialog, Authentication) {
    $scope.authentication = Authentication;
    var appointments = appointmentsEvents(AppointmentsService);
    $scope.events=[];
    
    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
      var events = appointments;
      callback(events);
    };

    $scope.calEventsExt = {
        
        events: appointments,
        color: '#30c165',
        textColor: 'white',
    };
    /* alert on eventClick */
    $scope.alertOnEventClick = function( date, jsEvent, view){
        $scope.alertMessage = (date.title + ' was clicked ');
    };
    /* alert on DayClick */
    $scope.dayClick = function( date, jsEvent, view){
        ngDialog.open({ 
            template: '/modules/core/client/views/popup.calendar.client.view.html', 
            className: 'ngdialog-theme-default' 
        });
        selectedTime = new Date(date);
    };
    /* alert on Drop */
     $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };
    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalender = function(calendar) {
      if(uiCalendarConfig.calendars[calendar]){
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
    };
     /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) { 
        element.attr({'tooltip': event.title,
                     'tooltip-append-to-body': true});
        $compile(element)($scope);
    };
    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: "100%",
        defaultView: "agendaWeek",
        //editable: true,
        selectable: true,
        timezone: 'UTC',
        weekends:false,
        handleWindowResize:true,
        //slotDuration: '00:10:00',
        //slotLabelInterval: '00:30:00',
        nowIndicator: true,
        buttonIcons:
        {
            prev: 'left-single-arrow',
            next: 'right-single-arrow',
        },
        //theme: true,
        //UTC: true,
        header:{
          left: 'today prev,next',
          center: 'title',
          right:'month '/*basicWeek basicDay*/ +'agendaWeek'// agendaDay'
        },
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender,
        dayClick: $scope.dayClick
      }
    };
    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
    $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];

    $scope.mytime = selectedTime;
    $scope.selectedTime = selectedTime;
    $scope.description = '';
    //$scope.hstep = 1;
    $scope.mstep = 15;

    $scope.options = {
        //hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
    };

    $scope.ismeridian = true;
    
    $scope.toggleMode = function() {
        
        var appointment = {
            startTime: $scope.selectedTime,
            endTime: $scope.mytime,
            appointmentDescription: $scope.description,
            user: $scope.authentication.user._id,
            appointeduser: $scope.authentication.user._id //needs to be corrected            
        };
        $http.post('/api/appointments', appointment).success(function (response) {
            $state.reload($state.current.name);
            $scope.closeThisDialog();
        });
    };

    $scope.changed = function () {
        console.log('Time changed to: ' + $scope.mytime);
    };
}]);