var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var
HeatMapContainer = function (_React$Component) {_inherits(HeatMapContainer, _React$Component);
  function HeatMapContainer(props) {_classCallCheck(this, HeatMapContainer);var _this = _possibleConstructorReturn(this, (HeatMapContainer.__proto__ || Object.getPrototypeOf(HeatMapContainer)).call(this,
    props));
    _this.state = { heatData: {} };return _this;
  }_createClass(HeatMapContainer, [{ key: "componentDidMount", value: function componentDidMount()

    {var _this2 = this;
      var request = function request(obj) {
        return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", obj.url);
          xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300)
            resolve(xhr.response);else

            reject(xhr.statusText);
          };
          xhr.onerror = function () {return reject(xhr.statusText);};
          xhr.send(obj.body);
        });
      };
      var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";
      request({ url: url }).
      then(function (data) {
        var heatData = JSON.parse(data);
        _this2.setState({ heatData: heatData });
      });
    } }, { key: "render", value: function render()
    {
      return (
        React.createElement(HeatMap, { heatData: this.state.heatData }));

    } }]);return HeatMapContainer;}(React.Component);var


HeatMap = function (_React$Component2) {_inherits(HeatMap, _React$Component2);function HeatMap() {_classCallCheck(this, HeatMap);return _possibleConstructorReturn(this, (HeatMap.__proto__ || Object.getPrototypeOf(HeatMap)).apply(this, arguments));}_createClass(HeatMap, [{ key: "componentDidUpdate", value: function componentDidUpdate()
    {
      var margin = {
        top: 20,
        bottom: 100,
        left: 100,
        right: 20 };

      var w = 1200,h = 550,width = w - margin.left - margin.right,height = h - margin.top - margin.bottom;
      var svg = d3.select(".svg-container").
      append("svg").
      attr("id", "chart").
      attr("width", w).
      attr("height", h);
      var chart = svg.append("g").
      classed("inner-chart", true).
      attr("width", width).
      attr("height", height).
      attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      if (this.props.heatData.baseTemperature) {
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var baseTemperature = this.props.heatData.baseTemperature;
        var monthlyVariance = this.props.heatData.monthlyVariance.map(function (d) {
          return {
            year: new Date(d.year, d.month - 1, 1),
            month: months[d.month - 1],
            variance: d.variance,
            abs: (baseTemperature + d.variance).toFixed(3) };

        });

        var years = [];
        var i = 1,j = 0,length = monthlyVariance.length;
        years[0] = monthlyVariance[0].year;
        while (i < length) {
          if (monthlyVariance[i].year.getFullYear() != years[j].getFullYear()) {
            j++;
            years.push(monthlyVariance[i].year);
          }
          i++;
        }

        var x = d3.scaleBand().
        domain(years).
        range([0, width]);

        var y = d3.scaleBand().
        domain(months).
        range([0, height]);

        var colorScale = d3.scaleLinear().
        domain([0, 2, 5, 7, 10]).
        range(['#004ed6', '#7ba5c4', '#eae6da', '#e0b5a6', '#a32600']);

        // .domain([1, 3, 5, 8, 10])
        // .range(['#6e2da3', '#76bc3e', '#f4f2ab', '#ff9000', '#d80404']);
        //"blue","green","yellow","orange","red" 
        var xAxis = d3.axisBottom().
        scale(x).
        tickFormat(d3.timeFormat("%Y")).
        tickValues(x.domain().filter(function (d, i) {return d.getFullYear() % 10 == 0;}));

        var yAxis = d3.axisLeft().
        scale(y);

        // {
        //     year: new Date(d.year, d.month - 1, 1),
        //     month: months[d.month - 1],
        //     variance: d.variance,
        //     abs: (baseTemperature + d.variance).toFixed(3)
        //   }

        var tip = d3.tip().
        attr("class", "d3-tip").
        offset([-5, 0]).
        html(function (d) {
          var year = d.year.getFullYear() + " - " + d.month;
          var variance = d.variance > 0 ? "+" + d.variance : d.variance;
          return "<div class=\"year-month\"><strong>" + year + "</strong></div><div class=\"abs-temp\">" + d.abs + " \u2103</div><div class=\"var-temp\">" + variance + " \u2103</div>";
        });

        chart.append("g").
        classed("x axis", true).
        attr("transform", "translate(0," + height + ")").
        call(xAxis);

        chart.append("g").
        classed("y axis", true).
        call(yAxis);

        chart.select(".y.axis").
        append("text").
        classed("axis-label", true).
        attr("transform", "translate(-70," + height / 2 + ") rotate(-90)").
        text("Months").
        style("fill", "black");

        chart.select(".x.axis").
        append("text").
        classed("axis-label", true).
        attr("transform", "translate(" + width / 2 + ",45)").
        text("Years").
        style("fill", "black");

        var valuesMap = [0.0, 2.7, 3.9, 5.0, 6.1, 7.2, 8.3, 9.4, 10.5, 11.6, 12.7];
        var format = d3.format(".1f");

        var colorValue = function colorValue(temp) {
          if (temp < 0)
          return 0;else
          if (temp >= 12.7)
          return 9;

          for (var _i = 0; _i < 10; _i++) {
            if (temp < valuesMap[_i + 1])
            return _i;
          }
        };

        var bars = chart.selectAll(".bar").
        data(monthlyVariance).
        enter().
        append("rect").
        classed("bar", true);

        bars.attr("y", function (d) {return y(d.month);}).
        attr("x", function (d) {
          var date = new Date(d.year.getFullYear(), 0, 1);
          return x(date);
        }).
        attr("width", x.bandwidth()).
        attr("height", y.bandwidth()).
        style("fill", function (d) {
          var val = colorValue(d.abs);
          return colorScale(val);
        }).
        on("mouseover", tip.show).
        on("mouseout", tip.hide);;

        bars.exit().
        remove();

        var colorKey = chart.append("g").
        attr("width", 400).
        attr("transform", "translate(" + (width - 445) + "," + (height + 60) + ")");

        var colorKeyRects = colorKey.append("g").
        attr("width", 400).
        attr("height", 15);

        colorKeyRects.selectAll(".key").
        data(valuesMap).
        enter().
        append("g").
        classed("key", true);

        colorKeyRects.selectAll(".key").
        append("rect").
        attr("width", 40).
        attr("height", 15).
        classed("key-rect", true).
        attr("x", function (d, i) {return i * 40;}).
        attr("fill", function (d, i) {return colorScale(i);});

        colorKeyRects.selectAll(".key").
        append("text").
        text(function (d) {return format(d);}).
        attr("x", function (d, i) {return i * 40;}).
        classed("key-text", true).
        style("text-anchor", "middle").
        attr("transform", "translate(0,30)");

        colorKeyRects.selectAll(".key").
        exit().
        remove();

        svg.call(tip);
      }
    } }, { key: "render", value: function render()

    {
      return (
        React.createElement("div", null,
          React.createElement("h1", null, "Monthly Global Land-Surface Temperature"),
          React.createElement("h2", null, "1753 - 2015"),
          React.createElement("p", null, "Temperatures are in Celsius and reported as anomalies relative to the Jan 1951-Dec 1980 average.", React.createElement("br", null), "Estimated Jan 1951-Dec 1980 absolute temperature \u2103: 8.66 +/- 0.07"),
          React.createElement("div", { className: "svg-container" })));


    } }]);return HeatMap;}(React.Component);


ReactDOM.render(React.createElement(HeatMapContainer, null), document.querySelector("#root"));