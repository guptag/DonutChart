<html>
<head>
 <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.0/jquery.min.js"></script>
 <script type="text/javascript">
  //http://stackoverflow.com/questions/1038746/equivalent-of-string-format-in-jquery
  String.prototype.format = String.prototype.f = function() {
      var s = this,
          i = arguments.length;

      while (i--) {
          s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
      }

      return s;
  };

  (function () {
      window.Point = function (x, y) {
          this.X = x;
          this.Y = y;
      }
  })();

  (function () {      

      window.DonutData1 = {
        name: "Allocation",
        items: [{
                name: "Health Care",
                value: 15,
                primaryColor: "hsl(145, 63%, 49%)",
                secondaryColor: "hsla(145, 63%, 49%, 0.5)",
                items: [{
                  name: "Primary Care",
                  value: 4,
                  primaryColor: "#5DE100",
                  secondaryColor: "#A0FF5C",
                },
                {
                  name: "Cancer Research",
                  value: 8,
                  primaryColor: "#00B060",
                  secondaryColor: "#5CFFB6",
                },
                {
                  name: "Obesity Research",
                  value: 3,
                  primaryColor: "#3D9200",
                  secondaryColor: "#68f800",
                }]

            }, {
                name: "Technology",
                value: 50,
                primaryColor: "#F39c12",
                secondaryColor: "#F7BE63",
                items: [{
                  name: "Software",
                  value: 35,
                  primaryColor: "#F36312",
                  secondaryColor: "#F9A87A",
                  items: [{
                       name: "Crm",
                       value: 12,
                       primaryColor: "#F3AE12",
                       secondaryColor: "#f8cf73"
                    },
                    {
                       name: "Office Software",
                       value: 6,
                       primaryColor: "#B65F38",
                       secondaryColor: "#d7997d"
                    },
                    {
                       name: "Sharepoint",
                       value: 4,
                       primaryColor: "#9E3506",
                       secondaryColor: "#f99366"
                    },
                    {
                       name: "Communications",
                       value: 7,
                       primaryColor: "#F9824C",
                       secondaryColor: "#fba47d"
                    },
                    {
                       name: "Security Products",
                       value: 6,
                       primaryColor: "#f64339",
                       secondaryColor: "#fbafab"
                    }]                  
                 },
                 {
                  name: "Hardware",
                  value: 15,
                  primaryColor: "#F3C212",
                  secondaryColor: "#F9DD7A"
                  
                 }]
            }, {
                name: "Materials",
                value: 35,
                primaryColor: "#E74D3C",
                secondaryColor: "hsla(6, 78%, 57%, 0.5)",
                items: [{
                  name: "Coal",
                  value: 15,
                  primaryColor: "#DE3A4D",
                  secondaryColor: "#E77381"
                 },
                 {
                  name: "Metals",
                  value: 20,
                  primaryColor: "#E7603C",
                  secondaryColor: "#ED896E"
                 }]
            }]};

  })();
  

  (function() {
    window.DonutDataManager1 = function (p_data) {
      this.data = p_data;
      this.current = this.data;
      setupReferences(this.data, null);
    }

    var _prototype = window.DonutDataManager1.prototype

    _prototype.getCurrent = function () {
      return this.current;
    }

    _prototype.reset = function () {
      this.current = this.data;
    }

    _prototype.drillDown = function(p_item, p_index) {
      if (p_item && p_item.items && p_item.items.length > p_index) {
         this.current = p_item.items[p_index];
         return true; 
      }
      return false;     
    }

    _prototype.moveUp = function() {
      this.current = this.current.parent || this.data;
    }

    function setupReferences(p_data, p_parent) {
       
       if (p_data && p_data.items) {

         p_data.parent = p_parent;

         var total = 0
         $.each(p_data.items, function(index, item) {
          total += item.value;  
         });
          
       var _startAngle = 0;
           var _endAngle = 0;
         $.each(p_data.items, function(index, item) {
           item.valuePercentage = item.value * 100 / total;
           item.startAngle = _startAngle = _endAngle;
             item.endAngle = _endAngle = _startAngle + (item.valuePercentage/100) * 360 * (Math.PI/180);  
          });

         $.each(p_data.items, function(index, item) {
          setupReferences(item, p_data);
         });
       }     

       return;
    }
  })(); 


  (function () {      
        window.DonutChart1 = function (p_canvas, p_dataManager, p_eventManager) {
          var _this = this;
          var $canvas = this.$canvas = p_canvas;
          
          this.context = $canvas[0].getContext("2d");
          this.center = new Point($canvas.width() / 2, $canvas.height() / 2);
          this.radius = Math.min($canvas.width() / 2, $canvas.height()) * 0.8
          this.innerRadius = this.radius * 0.815;
          
          this.dataMgr = p_dataManager;
      };

      var _prototype = window.DonutChart1.prototype;
      
      _prototype.drawQuadrantWithAnimation = function (p_angle_from, p_angle_to, p_color) {                     
            var _step = (p_angle_to - p_angle_from) / 8;
            var loop = 0;
            var _this = this;

            while (true) {
              loop += 1;
              var st = p_angle_from;
              var en = p_angle_from + loop * _step;
              if(en > p_angle_to) {
                en = p_angle_to;
              }

              setTimeout((function(start, end) {
                
                return function () {
                   console.log("Angle_From:{0}; Angle_To: {1};".format(start, end));

                _this.context.save();
                _this.context.beginPath();               
                _this.context.arc(_this.center.X, _this.center.Y, _this.radius, start, end, false);               
                _this.context.lineWidth = 60;
                _this.context.strokeStyle = p_color;
                _this.context.stroke(); 
                _this.context.restore();                              
            
            _this.context.beginPath();
            _this.context.moveTo(_this.center.X, _this.center.Y);           
                _this.context.arc(_this.center.X, _this.center.Y, _this.innerRadius, start ,end, false);                
                _this.context.closePath();
                _this.context.fillStyle ="white";
                _this.context.fill();

                //text width
                var _text = "Your Equity Holdings (100%)";
                var _text_dimensions = _this.context.measureText("Your Equity Holdings (100%)");
                _this.context.strokeStyle = "black";
                _this.context.font = 'italic 13pt Calibri Helvetica, Arial';
                _this.context.lineWidth = 1;
                _this.context.strokeText(_text, _this.center.X - _text_dimensions.width / 2, _this.center.Y);
            }
              })(st, en), 20  + 50 * loop);

        if (en >= p_angle_to) {
          break;
        }
            }              
      };

      _prototype.drawQuadrant = function (p_angle_from, p_angle_to, p_color, p_optional) {
        p_optional = p_optional || {};

        this.context.save();
          this.context.beginPath();
          this.context.arc(this.center.X, this.center.Y, p_optional.radius || this.radius, p_angle_from, p_angle_to, false);    
          this.context.lineWidth = 60;
          this.context.strokeStyle = p_color;
          this.context.stroke();  
          this.context.restore();                             
      
      this.context.beginPath();
      this.context.moveTo(this.center.X, this.center.Y);            
          this.context.arc(this.center.X, this.center.Y, p_optional.radius ? p_optional.radius * 0.815 : this.innerRadius, p_angle_from, p_angle_to, false);                
          this.context.closePath();
          this.context.fillStyle = p_optional.innerCircleColor || "white";
          this.context.fill();
      }

      _prototype.renderText = function(p_text) {
        
          var _text_dimensions = this.context.measureText(p_text);
          
          this.context.save();
          this.context.strokeStyle = "black";
          this.context.font = 'italic 13pt Calibri Helvetica, Arial';
          this.context.lineWidth = 1;
      this.context.strokeText(_text, this.center.X - _text_dimensions.width / 2, this.center.Y);
      this.context.restore();   
      } 

      _prototype.reDrawQuadrantForDataItem = function(p_dataItem, p_isPrimaryColor) {            
        var _dataItem = p_dataItem;
        if (_dataItem && _dataItem.startAngle !== undefined && _dataItem.endAngle !== undefined) {
              console.log("redraw : start:{0}, end: {1}, isPrimary:{2}".format(_dataItem.startAngle, _dataItem.endAngle, p_isPrimaryColor));
              this.drawQuadrantWithAnimation(_dataItem.startAngle, _dataItem.endAngle, "hsla(0,0,0,0)");
              this.drawQuadrantWithAnimation(_dataItem.startAngle, _dataItem.endAngle, p_isPrimaryColor ? _dataItem.primaryColor : _dataItem.secondaryColor );  
              this.drawInnerCircle();                            
            }               
      };

      _prototype.drawInnerCircle = function (p_angle_from, p_angle_to, p_color, p_radius) {
        p_angle_from = p_angle_from || 0;
        p_angle_to = p_angle_to || 2 * Math.PI;

        this.context.beginPath();
          this.context.moveTo(this.center.X, this.center.Y);
          this.context.fillStyle = p_color || "white";
          //this.context.arc(this.center.X, this.center.Y, this.innerRadius, 0 , 2 * Math.PI, false);
          this.context.arc(this.center.X, this.center.Y, p_radius || this.innerRadius, p_angle_from , p_angle_to, false);
          this.context.closePath();
          this.context.fill();
      };     

      _prototype.render = function () {
          var _current = this.dataMgr.current;
          for (var i = 0; i < _current.items.length; ++i) {               
              this.drawQuadrantWithAnimation(_current.items[i].startAngle, _current.items[i].endAngle, _current.items[i].primaryColor);
          }        
      };

      _prototype.clear = function () {
        this.context.clearRect(0, 0, this.$canvas.width(), this.$canvas.height());
      }     
  })();
  


  (function () {
    window.Task = function (p_completeCb) {     
      this.comepletCb = p_completeCb;
      this.workItems = [];
      this.batchItemsIdHash = {}; //hash for batch id and number of items
      this.isCompleted = false;
    }

    _prototype  = window.Task.prototype;

    //todo: rename workitem to job
    _prototype.addWorkItem = function(p_fn) {
      if (!this.isCompleted) {
        this.workItems.push({
          execFn: p_fn
        });
      } else {
        console.log("Cannot add work items to the completed task");
      }
    };

    _prototype.addBatchWorkItem = function(p_id, p_fnList) {
      if (!this.isCompleted) {
        this.workItems.push({
          batchId: p_id,
          execFnList: p_fnList
        });

                // keep a hash of batchid and number of jobs it needs to execute
        this.batchItemsIdHash[p_id] = {total: p_fnList.length, completed: 0};
      } else {
        console.log("Cannot add work items to the completed task");
      }
    }

    _prototype.process = function () {
      if (!this.isCompleted && this.workItems.length > 0) {
        var item_to_process = this.workItems.shift();
        
        if(item_to_process.batchId) {
          $.each(item_to_process.execFnList, function(index, item) {
            setTimeout(function() { item.call(window, item_to_process.batchId); }, index * 45);
          })
        } else {
          item_to_process.execFn.call(window);
        }
      } else {
        this.isCompleted = true;
        if (this.comepletCb) {
          this.comepletCb.call(window);
        }
      }
    }

    _prototype.signalComplete = function () {
      if (!this.isCompleted) {
        this.process();
      } 
    }

    _prototype.signalBatchItemComplete = function (p_id) {
      if (!this.isCompleted && this.batchItemsIdHash[p_id]) {
        this.batchItemsIdHash[p_id].completed += 1;
        if (this.batchItemsIdHash[p_id].completed  === this.batchItemsIdHash[p_id].total) {
          this.signalComplete();
        }
      } 
    }

  })();     


  (function () {
    window.AnimHelper = function() {
      var _this = this;
      var _requestId = null;

      _this.animate = function (p_from, p_to, p_execFn, p_finishCb) {       
        if (_requestId) {
          return false;
        }
        
        var cb = getAnimationFrameCallback(p_from, p_to, p_execFn, p_finishCb);
        _requestId = _this.requestAnimFrame(cb);

        return true;
      };

      _this.canAnimate = function () {
        return !(_requestId);
      }

      _this.requestAnimFrame = function(callback) {
        if(window.requestAnimationFrame_donotuse) {
          return window.requestAnimationFrame(callback);
        } else {
          return window.setInterval(callback, 1000 / 60);
        }
      }             

      _this.cancelRequestAnimFrame = function(id) {
        if (window.requestAnimationFrame_donotuse) {
          window.cancelRequestAnimationFrame(id);
        } else {
          window.clearInterval(id);
        }
      }

      function getAnimationFrameCallback(p_from, p_to, p_execFn, p_finishCb) {
        var step = 0;         
        var duration = 12;        

        return function() {
          console.log("in anim frame");
          step += 1;
          var temp_to = EasingHelper.easeInSine(step, p_from, p_to - p_from, duration);
          if ((p_from <= p_to && temp_to >= p_to) ||
            (p_from > p_to && temp_to < p_to)) {
            temp_to = p_to;
          }

          p_execFn.call(window, p_from, temp_to);

          if (temp_to === p_to || step > 100) {
            _this.cancelRequestAnimFrame(_requestId);
            _requestId = null;
            p_finishCb.call();
          }
        };
      }
    };

    window.AnimHelper.animate  = function (p_from, p_to, p_execFn, p_finishCb) {
      var animHelper = new AnimHelper();
      animHelper.animate(p_from, p_to, p_execFn, p_finishCb);     
    }
    
  })();

  (function () {
    /* ============================================================
     * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
     *
     * Open source under the BSD License.
     *
     * Copyright © 2008 George McGinley Smith
     * All rights reserved.
     * https://raw.github.com/danro/jquery-easing/master/LICENSE
     * ======================================================== */

     //https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
    window.EasingHelper =  {
      // t: current time, b: begInnIng value, c: change In value, d: duration
      easeInCubic: function (t, b, c, d) {
        return c*(t/=d)*t*t + b;
      },
      easeInSine: function (t, b, c, d) {
        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
      }
    };
  })(); 


 </script>
</head>
<body>
  <canvas id="canvas" width=400 height=400></canvas>

  <div style="margin:50px">
    <button id="drillInSequence">Simulate Drill-in event</button> 
    <button id="moveUpSequence">Simulate Move Up event</button>   
  </div>

  <script type="text/javascript">
    
  var dataManager = new DonutDataManager1(DonutData1);
  
  var chart = new DonutChart1($("#canvas"), dataManager);
  chart.render();
  
  $("#drillInSequence").click(runDrillInSequence);
  $("#moveUpSequence").click(runMoveUpSequence);

  function runDrillInSequence() {
    
    var _dataItem = dataManager.current;
    var task = new Task();    
    drillin_addAnimationStepsForStage1(task, _dataItem.items[0]);
    var _parentColor = _dataItem.items[0].primaryColor;
    dataManager.drillDown(_dataItem, 0);
    drillin_addAnimationStepsForStage2(task, dataManager.current, _parentColor);


  /*  var _dataItem = dataManager.current;
    dataManager.drillDown(_dataItem, 1);
    _dataItem = dataManager.current;
    var task = new Task();    
    drillin_addAnimationStepsForStage1(task, _dataItem.items[0]);
    var _parentColor = _dataItem.items[0].primaryColor;
    dataManager.drillDown(_dataItem, 0);
    drillin_addAnimationStepsForStage2(task, dataManager.current, _parentColor);*/

    task.process();
  }

  function  drillin_addAnimationStepsForStage1(p_task, p_dataItem) {
    var _dataItem = p_dataItem;
    var t1 = p_task;

    t1.addWorkItem(function () {
      chart.clear();
      t1.signalComplete(); 
    });
    t1.addWorkItem(function () {
      AnimHelper.animate(
        p_dataItem.startAngle, 
        p_dataItem.endAngle, 
        function (f, t) 
        { 
          chart.drawQuadrant(f, t, p_dataItem.primaryColor);
        }, 
        function() 
        { 
          console.log("segment one completed"); 
          setTimeout(function () { t1.signalComplete(); }, 15);
        });
    });   
    t1.addWorkItem(function () {
      AnimHelper.animate(
        p_dataItem.endAngle, 
        2 * Math.PI, 
        function (f, t) 
        { 
          chart.drawQuadrant(f, t, p_dataItem.primaryColor);
        }, 
        function() 
        { 
          console.log("completing the circle"); 
          setTimeout(function () { t1.signalComplete(); }, 70);
        });
    });
    t1.addWorkItem(function () {
      AnimHelper.animate(
        chart.radius, 
        chart.radius / 10, 
        function (f, t) 
        { 
          console.log("{0}:{1}".format(f, t));
          chart.clear();
          chart.drawQuadrant(0, 2 * Math.PI, p_dataItem.primaryColor, {radius: t});
        }, 
        function() 
        { 
          console.log("shrinked the outer circle"); 
          setTimeout(function () { t1.signalComplete(); }, 70);
        });
    });
    t1.addWorkItem(function () {
      chart.clear();
      AnimHelper.animate(
        0, 
        chart.radius * 0.815, 
        function (f, t) 
        { 
          chart.drawInnerCircle(0, 2 * Math.PI, p_dataItem.primaryColor, t);
        }, 
        function() 
        { 
          console.log("finished drawing inner circle"); 
          setTimeout(function () { t1.signalComplete(); }, 70); 
        });
    }); 
  }

  function drillin_addAnimationStepsForStage2(p_task, p_dataItem, p_parentColor) {
    var _dataItem = p_dataItem;
    var _parentColor = p_parentColor; 

    var drawQuadrantTask = function (p_batchId, p_task, p_dataItem) {
      return function () {
        console.log("batch task: " + p_dataItem.startAngle)
        AnimHelper.animate(
          p_dataItem.startAngle, 
          p_dataItem.endAngle, 
          function (f, t) 
          { 
            chart.drawQuadrant(f, t, p_dataItem.primaryColor, {innerCircleColor: _parentColor});
          }, 
          function() 
          { 
            console.log("draw segment for child data item"); 
            p_task.signalBatchItemComplete(p_batchId); 
          }, 
          30);
      };
    }   
    
    var jobList = [];
    var batchId = 100;
    for (var i=0; i < _dataItem.items.length; ++i) {
      jobList.push(drawQuadrantTask(batchId, p_task, _dataItem.items[i]));      
    }
    p_task.addBatchWorkItem(batchId, jobList);    
  }

  function runMoveUpSequence() {
    var _dataItem = dataManager.current;

    var task = new Task(function () { console.log("move up animation completed"); dataManager.reset();});
    
    moveup_addAnimationStepsForStage1(task, _dataItem);

    var _parentColor = _dataItem.primaryColor;
    dataManager.moveUp();

    moveup_addAnimationStepsForStage2(task, dataManager.current, _parentColor);   

    task.process();
  }

  function moveup_addAnimationStepsForStage1(p_task, p_dataItem) {
    var _dataItem = p_dataItem;

    var drawQuadrantTask = function (p_batchId, p_task, p_dataItem) {
      return function () {
        AnimHelper.animate(          
          p_dataItem.endAngle, 
          p_dataItem.startAngle,
          function (f, t) 
          { 
            // note t, f            
            chart.drawQuadrant(t, f, "white", {innerCircleColor: _dataItem.primaryColor});
          }, 
          function() 
          { 
            console.log("clear out the segments"); 
            p_task.signalBatchItemComplete(p_batchId); 
          });
      };
    };    
    
    var jobList = [];
    var batchId = 200;
    for (var i=_dataItem.items.length - 1; i > 0; --i) {
      jobList.push(drawQuadrantTask(batchId, p_task, _dataItem.items[i]));      
    }
    p_task.addBatchWorkItem(batchId, jobList);      

    p_task.addWorkItem(function () {
      chart.clear();
      AnimHelper.animate(        
        chart.radius * 0.7, 
        chart.radius,
        function (f, t) 
        { 
          chart.drawInnerCircle(0, 2 * Math.PI, _dataItem.primaryColor, t);
        }, 
        function() 
        { 
          console.log("expand the inner circle"); 
          setTimeout(function () { p_task.signalComplete(); }, 70); 
        });
    });

    p_task.addWorkItem(function () {
      chart.clear();
      AnimHelper.animate(
        0, 
        2 * Math.PI, 
        function (f, t) 
        { 
          chart.drawQuadrant(f, t, p_dataItem.primaryColor, {innerCircleColor: "white"});
        }, 
        function() 
        { 
          console.log("completing the circle"); 
          setTimeout(function () { p_task.signalComplete(); }, 70);
        });     
    });

    p_task.addWorkItem(function () {
      AnimHelper.animate(
        2 * Math.PI, 
        0, 
        function (f, t) 
        { 
          //note: t, f
          console.log("t={0}, f={1}".format(t,f));
          chart.drawQuadrant(t, f, "white", {innerCircleColor: "white"});
        }, 
        function() 
        { 
          console.log("clear the circle");
          chart.clear(); 
          p_task.signalComplete(); 
        });
    });     
  }

  function moveup_addAnimationStepsForStage2(p_task, p_dataItem, p_parentColor) {
    var _dataItem = p_dataItem;
    var t1 = p_task;
    var _parentColor = p_parentColor;

    var drawQuadrantTask = function (p_batchId, p_task, p_dataItem) {
      return function () {        
        AnimHelper.animate(
          p_dataItem.startAngle, 
          p_dataItem.endAngle, 
          function (f, t) 
          { 
            chart.drawQuadrant(f, t, p_dataItem.primaryColor, {innerCircleColor: "white"});
          }, 
          function() 
          { 
            console.log("draw segment for child data item"); 
            p_task.signalBatchItemComplete(p_batchId); 
          });
      };
    }

    var jobList = [];
    var batchId = 300;
    for (var i=0; i < _dataItem.items.length; ++i) {
      jobList.push(drawQuadrantTask(batchId, p_task, _dataItem.items[i]));      
    }
    p_task.addBatchWorkItem(batchId, jobList);
  }


  </script>
</body>
</html>