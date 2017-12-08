const dateLabels = ['Deadline', 'Start Time', 'Appointment'];
const jsonColors = ['red', 'orange', 'blue'];
const injections = [/"/g, /'/g, /</g, />/g]
allTasks = {}
var todoApp

function uuidv4() {
  let taskId = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
  return taskId
}

function sleepFor (sleepDuration) {
  var now = new Date().getTime();
  while (new Date().getTime() < now + sleepDuration) { /* do nothing */ }
}

function removeInjections(text) {
  for (let i in injections) {
    text = text.replace(i, '');
  }
  return text;
}

function createTaskObject (newId, color, dateLabel, date, time, text) {
  let todoTaskObj = {}
  todoTaskObj['id'] = newId
  if (color > 0) { todoTaskObj['color'] = jsonColors[color - 1]; }
  if (dateLabel > 0) { todoTaskObj['dateLabel'] = dateLabels[dateLabel - 1]; }
  if (date) { todoTaskObj['date'] = date; }
  if (time) { todoTaskObj['time'] = time; }
  text = removeInjections(text);
  todoTaskObj['text'] = text;
  allTasks[newId] = todoTaskObj;
}

function updateTaskVals (taskId, key, val) {
  val = removeInjections(val);
  allTasks[taskId][key] = val;
}

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

function getHtmlColor (color) {
  return '<img alt="" src="static/images/black-circle.png" class="task-color ' + color + ' lighten-1 left circle">'
}

function taskObjToHtml (taskId) {
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

function todoAppClass () {
  var self = this;
  var id = uuidv4();
  var btnAdd = $('#btnAdd');
  // var todoList = $('#todo-list');
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

  self.init = function () {
    btnAdd.on('click', self.addTask);
    cbCheckAll.on('click', self.onCheckAll);
    btnDelDone.on('click', self.delDone);
    inputNewTask.on('keyup', self.onNewTaskKeyUp);
    inputNewTask.focus();
  };

  self.resetAddTaskValues = function () {
    inputNewTask.val('');
    inputTaskDate.val('');
    inputTaskTime.val('');
    inputDateLabel.val('0');
    inputColor.val('0');
    $('select').material_select();
  }

  self.buildTaskAppendToList = function (newId) {
    let newTask = $('<li class="collection-item" data-id="' + newId + '"></li>');
    let htmlModal = taskObjToHtml(newId);
    var cb = $([
      '<input id="cb-' + newId + ' "type="checkbox" name="' + newId,
      '" value="">',
      '<label id="' + newId + '" for="cb-' + newId + '" class="title">',
      htmlModal + '</label>'
    ].join(''));

    cb.on('click', self.setDone);
    cb.on('dblclick', self.editTask);
    var btnDel = $(
      '<a href="" class="secondary-content-trash task-editions"><i class="fa fa-trash-o" aria-hidden="true"></i></a>'
    );
    var btnEdit = $(
      '<a href="" id="' + newId + '" class="secondary-content-edit task-editions"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>'
    );
    btnDel.on('click', self.deleteTask);
    btnEdit.on('click', function (e) {
      e.preventDefault();
      var event = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      document.getElementById('taskTextSpan' + newId).dispatchEvent(event);
    });
    newTask.append(btnEdit);
    newTask.append(btnDel);
    newTask.append(cb);
    newTaskListItem.before(newTask);
  }

  self.addTask = function (e) {
    var newId = uuidv4();
    var text = $.trim(inputNewTask.val());

    if (text) {
      let color = parseInt(inputColor.val());
      let dateLabel = parseInt(inputDateLabel.val());
      let date = $.trim(inputTaskDate.val());
      let time = $.trim(inputTaskTime.val());
      var newTask = $('<li class="collection-item" data-id="' + newId + '"></li>');

      createTaskObject(newId, color, dateLabel, date, time, text);
      self.buildTaskAppendToList(newId)
      self.resetAddTaskValues()
    }

    btnAdd.addClass('disabled');
    inputNewTask.focus();
  };

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

  self.deleteTask = function (e) {
    e.preventDefault();
    var taskId = $(e.currentTarget).parent().attr('data-id');
    $('[data-id="' + taskId + '"]').remove();
    allTasks[taskId] = undefined;
  };

  self.editTask = function (e) {
    var label = $(e.currentTarget);
    var text = label.text();
    var taskId = label.attr('id');
    var taskEdit = $(
      '<input type="text" name="taskEdit" value="' + allTasks[taskId]['text'] + '" placeholder="" id="taskEdit">'
    );
    //var thisChildNodes = label[0].childNodes;
    var editEnd = function () {
      let htmlModal = taskObjToHtml(taskId);
      label.text('');
      label.append(htmlModal);
      taskEdit.replaceWith(label);
      label.on('click', self.setDone);
      label.on('dblclick', self.editTask);
    };
    label.replaceWith(taskEdit);
    taskEdit.on('blur', editEnd);
    taskEdit.on('keyup', function (e) {
      switch (e.keyCode) {
      case 13:
        var newText = $.trim(taskEdit.val());
        if (newText) {
	  updateTaskVals(taskId, 'text', newText)
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

  self.setDone = function (e) {
    var label = $(e.currentTarget);
    var cb = label.prev();
    var checked = cb.prop('checked');

    if (checked) {
      cb.prop('checked', false);
      label.removeClass('task-done');
    } else {
      cb.prop('checked', true);
      label.addClass('task-done');
    }
  };

  self.setAllDone = function () {
    $('#todo-list li input[type="checkbox"]:not(:checked)').each(function (i, el) {
      var $el = $(el);
      $el.prop('checked', true);
      $el.next().addClass('task-done');
    });
  };

  self.setAllUndone = function () {
    $('#todo-list li input[type="checkbox"]:checked').each(function (i, el) {
      var $el = $(el);
      $el.prop('checked', false);
      $el.next().removeClass('task-done');
    });
  };

  self.onCheckAll = function (e) {
    var checked = cbCheckAll.prop('checked');

    if (checked) {
      self.setAllDone();
    } else {
      self.setAllUndone();
    }
  };

  self.delDone = function (e) {
    $('#todo-list li input[type="checkbox"]:checked').each(function (i, el) {
      allTasks[$(el).attr('id')] = undefined;
      $(el).parent().remove();
    });

    cbCheckAll.prop('checked', false);
  };

  self.renderAllTasks = function () {
    var checked = cbCheckAll.prop('checked');

    if (checked == false) {
      self.setAllDone();
    }
    self.delDone()
    for (let key in allTasks) {
      if (!allTasks.hasOwnProperty(key)) { continue; }
      self.buildTaskAppendToList(key)
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
