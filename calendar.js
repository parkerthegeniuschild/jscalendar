var calendar = {
  mName : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  data : null, 
  sDay : 0,
  sMth : 0,
  sYear : 0,
  list : function () {

    // taking into account JS '0' array count for dates
    calendar.sMth = parseInt(document.getElementById("month").value);
    calendar.sYear = parseInt(document.getElementById("year").value);
    var daysInMth = new Date(calendar.sYear, calendar.sMth + 1, false).getDate(),
        startDay = new Date(calendar.sYear, calendar.sMth, 1).getDay(),
        endDay = new Date(calendar.sYear, calendar.sMth, daysInMth).getDay();

    // data to/from localStorage
    calendar.data = localStorage.getItem("cal-" + calendar.sMth + "-" + calendar.sYear);
    if (calendar.data==null) {
      localStorage.setItem("cal-" + calendar.sMth + "-" + calendar.sYear, "{}");
      calendar.data = {};
    } else {
      calendar.data = JSON.parse(calendar.data);
    }

    // blank spaces on calendar before month starts
    var boxes = [];
    if (startDay != 0) {
      for (var i = 0; i < startDay; i++) {
        boxes.push("b");
      }
    }

    // populate days of the month
    for (var i = 1; i <= daysInMth; i++) {
      boxes.push(i);
    }

    // blank spaces on calender after month ends
    if (endDay != 6) {
      var blanks = endDay == 0 ? 6 : 6 - endDay;
      for (var i = 0; i < blanks; i++) {
        boxes.push("b");
      }
    }

    // plotting the container table
    var container = document.getElementById("container"),
        cTable = document.createElement("table");
    cTable.id = "calendar";
    container.innerHTML = "";
    container.appendChild(cTable);

    // the first row of days
    var cRow = document.createElement("tr"),
        cCell = null,
        days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    for (var d of days) {
      cCell = document.createElement("td");
      cCell.innerHTML = d;
      cRow.appendChild(cCell);
    }
    cRow.classList.add("day");
    cTable.appendChild(cRow);

    // days of the month
    var total = boxes.length;
    cRow = document.createElement("tr");
    for (var i = 0; i < total; i++) {
      cCell = document.createElement("td");
      if (boxes[i] == "b") {
        cCell.classList.add("blank");
      } else {
        cCell.innerHTML = "<div class='dd' id='" + boxes[i] + "'>" + boxes[i] + "</div>";
        if (calendar.data[boxes[i]]) {
          cCell.innerHTML += "<div class='evt'>" + calendar.data[boxes[i]] + "</div>";
        }
        cCell.addEventListener("click", function() {
          calendar.show(this);
        });
      }


      cRow.appendChild(cCell);
      if (i != 0 && (i + 1) % 7 == 0) {
        cTable.appendChild(cRow);
        cRow = document.createElement("tr");
      }
    }

    document.getElementById("event").innerHTML = "";

  },

  // show event for selected date
  show : function (el) {

    calendar.sDay = el.getElementsByClassName("dd")[0].innerHTML;

    var tForm = "<h2>" + (calendar.data[calendar.sDay] ? "Update This" : "Create New") + " Event</h2>";
    tForm += "<div>" + calendar.sDay + " " + calendar.mName[calendar.sMth] + " " + calendar.sYear + "</div>";
    tForm += "<textarea id='evt-details' required>" + (calendar.data[calendar.sDay] ? calendar.data[calendar.sDay] : "") + "</textarea>";
    tForm += "<input type='submit' value='Save'/>";
    tForm += "<input type='button' value='Delete' onclick='calendar.del()'/>";

    var eForm = document.createElement("form");
    eForm.addEventListener("submit", calendar.save);
    eForm.innerHTML = tForm;

    var container = document.getElementById("event");
    container.innerHTML = "";
    container.appendChild(eForm);
  },


  // save events
  save : function (e) {

    e.stopPropagation();
    e.preventDefault();
    calendar.data[calendar.sDay] = document.getElementById("evt-details").value;
    localStorage.setItem("cal-" + calendar.sMth + "-" + calendar.sYear, JSON.stringify(calendar.data));
    calendar.list();
  },

  // delete events
  del : function () {

    if (confirm("Delete this event?")) {
      delete calendar.data[calendar.sDay];
      localStorage.setItem("cal-" + calendar.sMth + "-" + calendar.sYear, JSON.stringify(calendar.data));
      calendar.list();
    }
  }
};

window.addEventListener("load", function () {
  
  var today = new Date(),
      todayMonth = today.getMonth(),
      todayYear = parseInt(today.getFullYear());

  var mth = document.getElementById("month");
  for (var i = 0; i < 12; i++) {
    var opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = calendar.mName[i];
    if (i == todayMonth) {
      opt.selected = true;
    }
    mth.appendChild(opt);
  }

  var year = document.getElementById("year");
  for (var i = todayYear - 6; i <= todayYear + 6; i++) {
    var opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = i;
    if (i == todayYear) {
      opt.selected = true;
    }
    year.appendChild(opt);
  }

  calendar.list();

  var activeDay = new Date().getDate();
  
  document.getElementById(activeDay).style.background = "cyan";
  document.getElementById(activeDay).style.height = "25px";


});


