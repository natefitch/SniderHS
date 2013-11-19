// this is a test for pushing
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var serialPort = new SerialPort("/dev/ttymxc0", {
  baudrate: 115200,
  parser: serialport.parsers.readline("\r")
});
var schedule = require('node-schedule');

var relays = [];
for (x = 0; x < 16; x++)
{
  var lbl = "";
  lbl = Math.round((x+1)/2);
  if (x % 2 == 0)
  {
    lbl += "A";
  }
  else
  {
    lbl += "B";
  }
  relays.push({ 
    RelayStatus: "Off",
    ButtonLabel: lbl });
}

serialPort.open(function () {
  console.log('serial port open');
  serialPort.on('data', function(data) {
    console.log('data received: ' + data);
    var jo = [];
    try
    {
      jo = JSON.parse(data);
      if (jo[0].UI.event === "TouchUp")
      {
        handleTouchUp(jo[0].UI.x, jo[0].UI.y);
        console.log("touch up event: " + JSON.stringify(jo[0].UI.event));
      }
    }
    catch (e)
    {
      console.log(e);
    }
  });
  beginScreenDraw();
});

function beginScreenDraw()
{
  serialPort.write("UL5S9\r");

  setTimeout(function(){
    serialPort.write("UL4S8\r");
  }, 50);

  setTimeout(function() {
    serialPort.write("UDC\r");
  }, 100);

  setTimeout(function() {
    serialPort.write("UDT1\r");
  }, 150);

  setTimeout(function() {
    drawButton(32, 32, 0, 0, "1A");
  }, 200);

  setTimeout(function() {
    drawButton(32, 32, 32, 0, "1B");
  }, 250);

  setTimeout(function() {
    drawButton(32, 32, 64, 0, "2A");
  }, 300);

  setTimeout(function() {
    drawButton(32, 32, 96, 0, "2B");
  }, 350);

  setTimeout(function() {
    drawButton(32, 32, 0, 32, "3A");
  }, 400);

  setTimeout(function() {
    drawButton(32, 32, 32, 32, "3B");
  }, 450);

  setTimeout(function() {
    drawButton(32, 32, 64, 32, "4A");
  }, 500);

  setTimeout(function() {
    drawButton(32, 32, 96, 32, "4B");
  }, 550);

  setTimeout(function() {
    drawButton(32, 32, 0, 64, "5A");
  }, 600);

  setTimeout(function() {
    drawButton(32, 32, 32, 64, "5B");
  }, 650);

  setTimeout(function() {
    drawButton(32, 32, 64, 64, "6A");
  }, 700);

  setTimeout(function() {
    drawButton(32, 32, 96, 64, "6B");
  }, 750);

  setTimeout(function() {
    drawButton(32, 32, 0, 96, "7A");
  }, 800);

  setTimeout(function() {
    drawButton(32, 32, 32, 96, "7B");
  }, 850);

  setTimeout(function() {
    drawButton(32, 32, 64, 96, "8A");
  }, 900);

  setTimeout(function() {
    drawButton(32, 32, 96, 96, "8B");
  }, 950);
}

function drawButton (dx, dy, x, y, txt)
{
  serialPort.write("UDL0\r");
  var str = "UDP" + (x+1).toString() + ",";
  str += (y+1).toString() + "E" + (x + dx - 2).toString();
  str += "," + (y + dy - 2).toString() + "B\r";
  setTimeout(function() {
    serialPort.write(str);
  }, 50);
  console.log("first string: " + str);
  var str2 = "UDP" + (x + dx/2 - 6).toString() + ",";
  str2 += (y + dx/2 - 6).toString() + "S" + txt + "\r";
  setTimeout(function() {
    serialPort.write(str2);
  }, 100);
  console.log("button string: " + str2)
}

function drawSelButton (dx, dy, x, y, txt)
{
  serialPort.write("UDL0\r");
  var str = "UDP" + (x+1).toString() + ",";
  str += (y+1).toString() + "E" + (x + dx - 2).toString();
  str += "," + (y + dy - 2).toString() + "B\r";
  setTimeout(function() {
    serialPort.write(str);
  }, 50);
  setTimeout(function() {
    serialPort.write("UDL3\r");
  }, 100);
  var str2 = "UDP" + (x+3).toString() + ",";
  str2 += (y+3).toString() + "E" + (x + dx - 4).toString();
  str2 += "," + (y + dy - 4).toString() + "B\r";
  setTimeout(function() {
    serialPort.write(str2);
  }, 150);
  setTimeout(function() {
    serialPort.write("UDFO\r");
  }, 200);
  setTimeout(function() {
    serialPort.write("UDL3\r");
  }, 250);
  setTimeout(function() {
    serialPort.write("UDB3\r");
  }, 300);
  var str3 = "UDP" + (x + dx/2 - 6).toString() + ",";
  str3 += (y + dx/2 - 6).toString() + "S" + txt + "\r";
  setTimeout(function() {
    serialPort.write(str3);
  }, 350);
  setTimeout(function() {
    serialPort.write("UDF3\r");
  }, 400);
  setTimeout(function() {
    serialPort.write("UDB0\r");
  }, 450);
}

function handleTouchUp(x, y)
{
  var xbutton = 0;
  var ybutton = 0;
  var xdraw = 0;
  var ydraw = 0;
  if (x < 32)
  {
    xdraw = 0;
    xbutton = 1;
  }
  else if (x >= 32 && x < 64)
  {
    xdraw = 32;
    xbutton = 2;
  }
  else if (x >= 64 && x < 96)
  {
    xdraw = 64;
    xbutton = 3;
  }
  else
  {
    xdraw = 96;
    xbutton = 4;
  }
  
  if (y < 32)
  {
    ydraw = 0;
    ybutton = 1;
  }
  else if (y >= 32 && y < 64)
  {
    ydraw = 32;
    ybutton = 2;
  }
  else if (y >= 64 && y < 96)
  { 
    ydraw = 64;
    ybutton = 3;
  }
  else
  {
    ydraw = 96;
    ybutton = 4;
  }
  var button = ((ybutton - 1) * 4) + xbutton;
  console.log("button: " + button + " was pressed.");
  
  var cmdChar = "";
  if (relays[(button - 1)].RelayStatus === "Off")
  {
    cmdChar = "C";
    relays[(button - 1)].RelayStatus = "On";
    drawSelButton(32, 32, xdraw, ydraw, relays[(button - 1)].ButtonLabel);
  }
  else
  {
    cmdChar = "O";
    relays[(button - 1)].RelayStatus = "Off";
    drawButton(32, 32, xdraw, ydraw, relays[(button - 1)].ButtonLabel);
  }
  
  var rlyCmd = "BA4." + Math.round(button / 2).toString() + ".0";
  rlyCmd += "CR";
  if (button % 2 == 0)
  {
    if (relays[(button - 2)].RelayStatus === "Off")
    {
      rlyCmd += "O";
    }
    else
    {
      rlyCmd += "C";
    }
    rlyCmd += cmdChar;
  }
  else
  {
    rlyCmd += cmdChar;
    if (relays[(button)].RelayStatus === "Off")
    {
      rlyCmd += "O";
    }
    else
    {
      rlyCmd += "C";
    }
  }
  rlyCmd += "\r";
  console.log("Command chars: " + rlyCmd);
  serialPort.write(rlyCmd);
}

function exteriorLtsOff() {
  serialPort.write("BA4.4.0CROO\r");
  setTimeout(function() {
    serialPort.write("BA4.5.0CROO\r");
  }, 100);
}

function exteriorLtsOn() {
  serialPort.write("BA4.4.0CRCC\r");
  setTimeout(function() {
    serialPort.write("BA4.5.0CRCC\r");
  }, 100);
}

function interiorLtsOff() {
  serialPort.write("BA4.1.0CROO\r");
  setTimeout(function() {
    serialPort.write("BA4.2.0CROO\r");
  }, 100);
  setTimeout(function() {
    serialPort.write("BA4.3.0CROO\r");
  }, 200);
  setTimeout(function() {
    serialPort.write("BA4.6.0CROO\r");
  }, 300);
  setTimeout(function() {
    serialPort.write("BA4.7.0CROO\r");
  }, 400);
  setTimeout(function() {
    serialPort.write("BA4.8.0CROO\r");
  }, 500);
}

function interiorLtsOn() {
  serialPort.write("BA4.1.0CRCC\r");
  setTimeout(function() {
    serialPort.write("BA4.2.0CRCC\r");
  }, 100);
  setTimeout(function() {
    serialPort.write("BA4.3.0CRCC\r");
  }, 200);
  setTimeout(function() {
    serialPort.write("BA4.6.0CRCC\r");
  }, 300);
  setTimeout(function() {
    serialPort.write("BA4.7.0CRCC\r");
  }, 400);
  setTimeout(function() {
    serialPort.write("BA4.8.0CRCC\r");
  }, 500);
}

// exterior on
var ruleExteriorOn = new schedule.RecurrenceRule();
ruleExteriorOn.hour = 17;
ruleExteriorOn.minute = 5;

// exterior off
var ruleExteriorOff = new schedule.RecurrenceRule();
ruleExteriorOff.hour = 8;
ruleExteriorOff.minute = 0;

// interior on
var ruleInteriorOn = new schedule.RecurrenceRule();
ruleInteriorOn.hour = 0;
ruleInteriorOn.minute = 1;
ruleInteriorOn.dayOfWeek = 1;

// interior off
var ruleInteriorOff = new schedule.RecurrenceRule();
ruleInteriorOff.hour = 23;
ruleInteriorOff.minute = 59;
ruleInteriorOff.dayOfWeek = 5;

var jobExteriorOn = schedule.scheduleJob(ruleExteriorOn, function() {
  exteriorLtsOn();
  console.log("Turning exterior lights on...");
});
var jobExteriorOff = schedule.scheduleJob(ruleExteriorOff, function() {
  exteriorLtsOff();
  console.log("Turning exterior lights off...");
});
var jobInteriorOn = schedule.scheduleJob(ruleInteriorOn, function() {
  interiorLtsOn();
  console.log("Turning interior lights on...");
});
var jobInteriorOff = schedule.scheduleJob(ruleInteriorOff, function() {
  interiorLtsOff();
  console.log("Turning interior lights off...");
});
