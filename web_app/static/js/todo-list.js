const dateLabels = ['Deadline', 'Start Time', 'Appointment'];
const jsonColors = ['red', 'orange', 'blue'];
const injections = [/"/g, /'/g, /</g, />/g]
const allTasks = {}
var todoApp

/**
 * setDateTimes
 * JS settings for materialize CSS Date and Time inputs
 */
function setDateTimes () {
  $('.timepicker').pickatime({
    default: 'now',
    fromnow: 0,
    twelvehour: false,
    donetext: 'OK',
    cleartext: 'Clear',
    canceltext: 'Cancel',
    autoclose: false,
    ampmclickable: true,
    aftershow: function () {}
  });
  $('.datepicker').pickadate({
    format: 'mm/dd/yyyy',
    selectMonths: true,
    selectYears: 15,
    today: 'Today',
    clear: 'Clear',
    close: 'Ok',
    closeOnSelect: true
  });
}

/**
 * uuidv4
 * creates unique id
 * @return {String} unique id string
 */
function uuidv4() {
  let taskId = (
    ([1e7]+-1e3+-4e3+-8e3+-1e11)
      .replace(/[018]/g, c => (c ^ crypto.getRandomValues(
	new Uint8Array(1))[0] & 15 >> c / 4).toString(16))
  )
  return taskId
}

/**
 * sleepFor
 * pauses app for input length
 * @sleepDuration {int} sleep duration in seconds
 */
function sleepFor (sleepDuration) {
  var now = new Date().getTime();
  while (new Date().getTime() < now + sleepDuration) { /* do nothing */ }
}

/**
 * removeInjections
 * removes characters that could mess up the code
 * @text {String} the text to modify
 * @return {String} updated text
 */
function removeInjections(text) {
  for (let i in injections) {
    text = text.replace(i, '');
  }
  return text;
}

/**
 * convertToISO
 * used for Google Calender, converts date to ISO format
 * @date {String} date string to change
 * @time {String} time to add to datestring
 * return {String} new ISO formated time
 */
function convertToISO (date, time) {
  date = date.replace(/\//g, '');
  date = date.slice(4, 8) + date.slice(0, 4);
  date += 'T';
  time = time.replace(/:/g, '');
  let timeEnd = parseInt(time.slice(0, 2)) + 1;
  if (timeEnd == 24) {
    timeEnd = date + '235900Z';
  } else {
    timeEnd = date + timeEnd.toString() + time.slice(2, 4) + '00Z';
  }
  time += '00Z';
  return date + time + '%2F' + timeEnd;
}

/**
 * createTaskObject
 * creates js object and adds to global object allTasks.  Object is based on
 * task information, used for runtime storage, editing, updating and
 * JSON API requests
 * @newId {String} the object ID
 * @color {String} color of task
 * @dateLabel {String} date type
 * @date {String} date
 * @time {String} time
 * @text {String} the text of todo item
 */
function createTaskObject (newId, color, dateLabel, date, time, text) {
  let todoTaskObj = {};
  todoTaskObj['id'] = newId;
  todoTaskObj['labelClass'] = 'title';
  if (color > 0) { todoTaskObj['color'] = jsonColors[color - 1]; }
  if (dateLabel > 0) { todoTaskObj['dateLabel'] = dateLabels[dateLabel - 1]; }
  if (date) { todoTaskObj['date'] = date; }
  if (time) { todoTaskObj['time'] = time; }
  text = removeInjections(text);
  todoTaskObj['text'] = text;
  allTasks[newId] = todoTaskObj;
}

/**
 * updateTaskVal
 * updates a task value from allTasks object based on input id key and value
 * @taskId {String} the object ID
 * @key {String} key with value to change
 * @val {String} value to change
 */
function updateTaskVal (taskId, key, val) {
  val = removeInjections(val);
  allTasks[taskId][key] = val;
}

/**
 * getHtmlColor
 * builds HTML object for image color
 * @color {String} the color name to use
 * return {String} the HTML formatted image tag
 */
function getHtmlColor (color) {
  return '<img alt="" src="static/images/black-circle.png" class="task-color '
    + color + ' lighten-1 left circle">'
}

/**
 * todoAppClass
 * main settings for TODO list functionality
 * return {todoAppClass} instance
 */
function todoAppClass () {
  var self = this;
  var id = uuidv4();
  var btnAdd = $('#btnAdd');
  var newTaskListItem = $('#newTaskListItem');
  var inputNewTask = $('#inputNewTask');
  var inputTaskDate = $('#inputTaskDate');
  var inputTaskTime = $('#inputTaskTime');
  var inputDateLabel = $('#inputDateLabel');
  var inputColor = $('#inputColor');
  var cbCheckAll = $('#cbCheckAll');
  var btnDelDone = $('#btnDelDone');

  if (!(self instanceof todoAppClass)) {
    return new todoAppClass();
  }

  /**
   * init
   * initializes on click functions
   */
  self.init = function () {
    btnAdd.on('click', self.addTask);
    cbCheckAll.on('click', self.onCheckAll);
    btnDelDone.on('click', self.delDone);
    inputNewTask.on('keyup', self.onNewTaskKeyUp);
    inputNewTask.focus();
  };

  /**
   * resetAddTaskValues
   * resets all the input task states
   */
  self.resetAddTaskValues = function () {
    inputNewTask.val('');
    inputTaskDate.val('');
    inputTaskTime.val('');
    inputDateLabel.val('0');
    inputColor.val('0');
    $('select').material_select();
  };

  /**
   * taskObjToHtml
   * renders HTML Task Section based on the JS Object
   * @taskId {String} the object ID
   * return {String} HTML formatted section of task
   */
  self.taskObjToHtml = function (taskId) {
    let todoTaskObj = allTasks[taskId];
    let htmlModal = [];
    if (todoTaskObj['color']) { htmlModal.push(getHtmlColor(todoTaskObj['color'])); }
    if (todoTaskObj['dateLabel']) { htmlModal.push(todoTaskObj['dateLabel'] + ': '); }
    if (todoTaskObj['date']) {
      let this_time;
      if (todoTaskObj['time']) {
	this_time = todoTaskObj['time'];
      } else {
	this_time = "12:00";
      }
      let date_time = convertToISO(todoTaskObj['date'], this_time);
      let dateModal = [
	'<a href="http://www.google.com/calendar/event?action=TEMPLATE&',
	'text=' + encodeURI(todoTaskObj['text']) + '&',
	'dates=' + date_time + '&location=&details=" target="_blank">',
	'<i class="fa fa-calendar-plus-o" aria-hidden="true"></i>',
	' + google</a> '
      ];
      htmlModal.push(dateModal.join(''));
      htmlModal.push(todoTaskObj['date'] + ' ');
    }
    if (todoTaskObj['time']) { htmlModal.push(todoTaskObj['time'] + ' '); }
    htmlModal.push('<span id="taskTextSpan' + taskId
		   + '" class="taskText">' + todoTaskObj['text'] + '</span>');
    return htmlModal.join('')
  }

  /**
   * buildTaskAppendToList
   * builds task HTML and appends it to the task list
   * @taskId {String} the object ID
   */
  self.buildTaskAppendToList = function (taskId) {
    let newTask = $(
      '<li class="collection-item" data-id="' + taskId + '"></li>'
    );
    let htmlModal = self.taskObjToHtml(taskId);
    labelClass = allTasks[taskId]['labelClass'];
    var checkBoxObj = $([
      '<input id="cb-' + taskId + '" type="checkbox" name="' + taskId,
      '" value=""><label id="' + taskId + '" for="cb-' + taskId + '" class="',
      labelClass + '">' + htmlModal + '</label>'
    ].join(''));

    checkBoxObj.on('click', self.clickCheckBox);
    checkBoxObj.on('dblclick', self.editTask);
    var btnDel = $(
      '<a href="" class="secondary-content-trash task-editions">' +
	'<i class="fa fa-trash-o" aria-hidden="true"></i></a>'
    );
    var btnEdit = $(
      '<a href="" id="' + taskId
	+ '" class="secondary-content-edit task-editions">' +
	'<i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>'
    );
    btnDel.on('click', self.deleteTask);
    btnEdit.on('click', function (e) {
      e.preventDefault();
      var event = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      document.getElementById('taskTextSpan' + taskId).dispatchEvent(event);
    });
    newTask.append(btnEdit);
    newTask.append(btnDel);
    newTask.append(checkBoxObj);
    newTaskListItem.before(newTask);
  }

  /**
   * addTask
   * handles adding a new task based on input values
   * @e {Object} clicked element from DOM
   */
  self.addTask = function (e) {
    var newId = uuidv4();
    var text = $.trim(inputNewTask.val());

    if (text) {
      let color = parseInt(inputColor.val());
      let dateLabel = parseInt(inputDateLabel.val());
      let date = $.trim(inputTaskDate.val());
      let time = $.trim(inputTaskTime.val());
      var newTask = $(
	'<li class="collection-item" data-id="' + newId + '"></li>'
      );

      createTaskObject(newId, color, dateLabel, date, time, text)
      self.buildTaskAppendToList(newId)
      self.resetAddTaskValues()
    }
    btnAdd.addClass('disabled');
    inputNewTask.focus();
  };

  /**
   * onNewTaskKeyUp
   * handles add task button logic and task input on carriage return
   * @e {Object} the element clicked from DOM
   */
  self.onNewTaskKeyUp = function (e) {
    if (e.keyCode === 13) {
      self.addTask(e);
      return;
    }
    var text = $.trim(inputNewTask.val());
    var disabled = btnAdd.hasClass('disabled');
    if (text && disabled) {
      btnAdd.removeClass('disabled');
    } else if (!text && !disabled) {
      btnAdd.addClass('disabled');
    }
  };

  /**
   * deleteTask
   * deletes task from storage and document
   * @e {Object} the element clicked from DOM
   */
  self.deleteTask = function (e) {
    e.preventDefault();
    var taskId = $(e.currentTarget).parent().attr('data-id');
    $('[data-id="' + taskId + '"]').remove();
    delete allTasks[taskId];
  };

  /**
   * editTask
   * handles editing a new task
   * @e {Object} the clicked element from DOM
   * return {String} HTML formatted section of task
   */
  self.editTask = function (e) {
    var label = $(e.currentTarget);
    var text = label.text();
    var taskId = label.attr('id');
    var taskEdit = $(
      '<input type="text" name="taskEdit" value="' + allTasks[taskId]['text'] +
	'" placeholder="" id="taskEdit">'
    );
    var editEnd = function () {
      let htmlModal = self.taskObjToHtml(taskId);
      label.text('');
      label.append(htmlModal);
      taskEdit.replaceWith(label);
      label.on('click', self.clickCheckBox);
      label.on('dblclick', self.editTask);
      };
    label.replaceWith(taskEdit);
    taskEdit.on('blur', editEnd);
    taskEdit.on('keyup', function (e) {
      switch (e.keyCode) {
      case 13:
        var newText = $.trim(taskEdit.val());
        if (newText) {
	  updateTaskVal(taskId, 'text', newText)
        }
        editEnd();
        break;
      case 27:
        editEnd();
        break;
      }
    });
    taskEdit.select();
  };

  /**
   * clickCheckBox
   * handles clicking a check box
   * @e {Object} the element clicked from DOM
   */
  self.clickCheckBox = function (e) {
    var label = $(e.currentTarget);
    var checkBoxObj = label.prev();
    var checked = checkBoxObj.prop('checked');
    if (checked) {
      label.removeClass('task-done');
      if (label.attr('id').slice(0, 2) != 'cb') {
	updateTaskVal(label.attr('id'), 'labelClass', 'title')
      }
    } else {
      label.addClass('task-done');
      if (label.attr('id').slice(0, 2) != 'cb') {
	updateTaskVal(label.attr('id'), 'labelClass', 'title task-done')
      }
    }
  };

  /**
   * setAllChecked
   * sets all taks to checked
   */
  self.setAllChecked = function () {
    $('#todo-list li input[type="checkbox"]:not(:checked)').each(function (i, el) {
      var element = $(el);
      element.prop('checked', true);
      element.next().addClass('task-done');
      updateTaskVal(element.attr('name'), 'labelClass', 'title task-done')
    });
  };

  /**
   * unCheckAll
   * sets all tasks to unchecked
   */
  self.unCheckAll = function () {
    $('#todo-list li input[type="checkbox"]:checked').each(function (i, el) {
      var element = $(el);
      element.prop('checked', false);
      element.next().removeClass('task-done');
      updateTaskVal(element.attr('name'), 'labelClass', 'title')
    });
  };

  /**
   * onCheckAll
   * handles logic for check all button
   * @e {Object} the object element from DOM
   */
  self.onCheckAll = function (e) {
    var checked = cbCheckAll.prop('checked');
    if (checked) { self.setAllChecked(); } else { self.unCheckAll(); }
  };

  /**
   * delDone
   * deletes all checked tasks
   * @e {Object} element from DOM
   */
  self.delDone = function (e) {
    $('#todo-list li input[type="checkbox"]:checked').each(function (i, el) {
      delete allTasks[el.name];
      $(el).parent().remove();
    });
    cbCheckAll.prop('checked', false);
  };

  /**
   * renderAllTasks
   * called from OAuth upon startup if tasks have been populated from backend
   */
  self.renderAllTasks = function () {
    for (let key in allTasks) {
      if (!allTasks.hasOwnProperty(key)) { continue; }
      self.buildTaskAppendToList(key)
      if (allTasks[key]['labelClass'] == 'title task-done') {
	element = $('#cb-' + key)
	element.prop('checked', true);
      }
    }
  }
  return self;
}

$(document).ready(function () {
  todoApp = new todoAppClass();
  todoApp.init();
  $('select').material_select();
  setDateTimes();
});
