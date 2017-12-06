var app;

function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}

function isImage(i) {
    return i instanceof HTMLImageElement;
}

function setDateTimes() {
  $('.timepicker').pickatime({
    default: 'now',
    fromnow: 0,
    twelvehour: false,
    donetext: 'OK',
    cleartext: 'Clear',
    canceltext: 'Cancel',
    autoclose: false,
    ampmclickable: true,
    aftershow: function(){}
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

function App() {
  var self = this;
  var id = 0;
  var btnAdd = $('#btnAdd');
  var todoList = $('#todo-list');
  var newTaskListItem = $('#newTaskListItem')
  var inputNewTask = $('#inputNewTask');
  var inputTaskDate = $('#inputTaskDate');
  var inputTaskTime = $('#inputTaskTime');
  var inputDateLabel = $('#inputDateLabel');
  var inputPriority = $('#inputPriority');
  var cbCheckAll = $('#cbCheckAll');
  var btnDelDone = $('#btnDelDone');

  if(!(self instanceof App)) {
    return new App();
  }

  self.init = function() {
    btnAdd.on('click', self.addTask);
    cbCheckAll.on('click', self.onCheckAll);
    btnDelDone.on('click', self.delDone);
    inputNewTask.on('keyup', self.onNewTaskKeyUp);
    inputNewTask.focus();
  };

  self.addTask = function(e) {
    var newId = self.getId();
    var text = $.trim(inputNewTask.val());

    if(text) {
      var color = parseInt(inputPriority.val());
      var dateLabel = parseInt(inputDateLabel.val());
      var date = $.trim(inputTaskDate.val());
      var time = $.trim(inputTaskTime.val());
      textModal = []
      if (dateLabel > 0) {
	dateLabels = ["Deadline", "Start Time", "Appointment"]
	textModal.push(dateLabels[dateLabel - 1] + ': ');
      }
      if (date) {
	textModal.push('<span class="taskDate">' + date + '</span> ');
      }
      if (time) {
	textModal.push('<span class="taskTime">' + time + '</span> ');
      }
      textModal.push('<span id="taskTextSpan' + newId + '" class="taskText">' + text + '</span>');

      if (color > 0) {
	colors = [
	  '<img alt="" src="images/black-circle.png" class="task-color red lighten-1 left circle">',
	  '<img alt="" src="images/black-circle.png" class="task-color orange lighten-1 left circle">',
	  '<img alt="" src="images/black-circle.png" class="task-color blue lighten-1 left circle">'
	]
	textModal.push(colors[color - 1])
      }
      var newTask = $('<li class="collection-item" data-id="' + newId + '"></li>');

      var cb = $([
	'<input id="cb' + newId + ' "type="checkbox" name="cb' + newId + '" value="">',
	'<label id="' + newId + '" for="cb' + newId + '" class="title">' + textModal.join('') + '</label>'
      ].join(''));

      cb.on('click', self.setDone);
      cb.on('dblclick', self.editTask);

      var btnDel = $(
	'<a href="" class="secondary-content-trash task-editions"><i class="fa fa-trash-o" aria-hidden="true"></i></a>'
      );
      var btnEdit = $(
	'<a href="" id="' + newId + '" class="secondary-content task-editions"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>'
      );

      btnDel.on('click', self.deleteTask);
      btnEdit.on('click', function(e) {
	e.preventDefault();
	var event = new MouseEvent('dblclick', {
	  'view': window,
	  'bubbles': true,
	  'cancelable': true
	});
	document.getElementById('taskTextSpan' + newId).dispatchEvent(event);
      });

      newTask.append(cb);
      newTask.append(btnEdit);
      newTask.append(btnDel);

      //inputNewTask.parent().before(newTask);
      newTaskListItem.before(newTask);
      inputNewTask.val('');
      inputTaskDate.val('');
      inputTaskTime.val('');
      inputDateLabel.val('0');
      inputPriority.val('0');
      $('select').material_select();
    }

    btnAdd.addClass('disabled');
    inputNewTask.focus();
  };

  self.onNewTaskKeyUp = function(e) {
    if(e.keyCode === 13) {
      self.addTask(e);
      return;
    }

    var text = $.trim(inputNewTask.val());
    var disabled = btnAdd.hasClass('disabled');
    if(text && disabled) {
      btnAdd.removeClass('disabled');
    } else if(!text && !disabled) {
      btnAdd.addClass('disabled');
    }
  };

  self.deleteTask = function(e) {
    e.preventDefault();
    var id = $(e.currentTarget).parent().attr('data-id');
    $('[data-id="' + id + '"]').remove();
  };

  self.editTask = function(e) {
    var timeout = 3000
    var label = $(e.currentTarget);
    var text = label.text();
    var id = label.attr('id');
    console.log(label)
    var taskEdit = $(
      '<input type="text" name="taskEdit" value="' + text + '" placeholder="" id="taskEdit">'
    );
    var thisChildNodes = label[0].childNodes;
    var image = undefined;
    for (let i of thisChildNodes) {
      if (isImage(i)) {
	image = i;
      }
    }
    var editEnd = function() {
      taskEdit.replaceWith(label);
      label.on('click', self.setDone);
      label.on('dblclick', self.editTask);
    };
    label.replaceWith(taskEdit);
    taskEdit.on('blur', editEnd);
    taskEdit.on('keyup', function(e) {
      switch(e.keyCode) {
	// Enter
      case 13:
	var newText = $.trim(taskEdit.val());
	if(newText) {
	  newText = '<span id="taskTextSpan' + id + '" class="taskText">' + newText + '</span>';
	  label.text('');
	  if (image) {
	    label.append(image);
	  }
	  label.append(newText);
	}
	editEnd();
	break;
	//Escape
      case 27:
	editEnd();
	break;
      }
    });
    taskEdit.select();
  };

  self.setDone = function(e) {
    var label = $(e.currentTarget);
    var cb = label.prev();
    var checked = cb.prop('checked');

    if(checked) {
      cb.prop('checked', false);
      label.removeClass('task-done');
    } else {
      cb.prop('checked', true);
      label.addClass('task-done');
    }
  };

  self.setAllDone = function() {
    $('#todo-list li input[type="checkbox"]:not(:checked)').each(function(i, el) {
      var $el = $(el);
      $el.prop('checked', true);
      $el.next().addClass('task-done');
    });
  };

  self.setAllUndone = function() {
    $('#todo-list li input[type="checkbox"]:checked').each(function(i, el) {
      var $el = $(el);
      $el.prop('checked', false);
      $el.next().removeClass('task-done');
    });
  };

  self.onCheckAll = function (e) {
    var checked = cbCheckAll.prop('checked');

    if(checked) {
      self.setAllDone();
    } else {
      self.setAllUndone();
    }
  }

  self.delDone = function(e) {
    $('#todo-list li input[type="checkbox"]:checked').each(function(i, el) {
      $(el).parent().remove();
    });

    cbCheckAll.prop('checked', false);
  };

  self.getId = function() {
    return id++;
  };


  return self;
}

$(document).ready(function() {
  app = new App();
  app.init();
  $('select').material_select();
  setDateTimes()
});
