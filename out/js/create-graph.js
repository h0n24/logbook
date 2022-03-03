app.CreateGraph = function CreateGraph(element, data, key) {

    this.showPercentArray = ['average_attendance', 'avg_progress_stud'];
    this.objectKey = key;
    this.showPercent = this.showPercentArray.indexOf(this.objectKey) != -1;
    this.element = element;
    this.data = data;

    this.call();
};

app.CreateGraph.prototype.call = function () {
    // var self = this;

    this.margin = 30;
    this.padding = 10;
    this.height = 200;
    this.width = this.element.clientWidth;


    this.svg = d3.select(this.element).append("svg")
        .attr("class", "axis")
        .attr("width", this.width)
        .attr("height", this.height)
        // .style("margin-top", this.margin)
        .style("padding-top", this.margin)
        .style("padding-left", this.padding);


    //изменение формата времени
    var parseTime = d3.timeParse("%Y-%m-%d");
    this.data.forEach(function(d) {
        d.month_date = parseTime(d.month_date);

    });

    // длина оси X= ширина контейнера svg - отступ слева и справа
    this.xAxisLength = this.width - 2 * this.margin;

    // длина оси Y = высота контейнера svg - отступ сверху и снизу
    this.yAxisLength = this.height - 2 * this.margin;


    this.setScaleValueX();
    this.setScaleValueY();

    this.createScaleX();
    this.drawScaleX();

    this.createScaleY();
    this.drawScaleY();

    this.drawArea();
    this.drawLine();
};

app.CreateGraph.prototype.setScaleValueX = function () {

// функция интерполяции значений на ось Х
    this.scaleX = d3.scaleTime()
        // .domain(d3.extent(this.data, function(d) {return d.month_date;}))
        .domain([
            d3.min(this.data, function(d) { return d.month_date;}),
            d3.max(this.data, function(d) { return d.month_date;})])
        .range([0, this.xAxisLength])
        // .nice();
};

app.CreateGraph.prototype.setScaleValueY = function () {

// функция интерполяции значений на ось Y

// domain - исходный диапазон данных
// range - результирующий диапазон (вписываем исходнные данные в диапазон от 0 до ширины/высоты графика)
// nice - расширяет начало и конец значений domain до ближайших округленных значений


    this.scaleY = d3.scaleLinear()
        // .domain(d3.extent(this.data, function(d) { return d.graphic_value; }))
        .domain([0, d3.max(this.data, function(d) { return (d.graphic_value); })])
        .range([this.yAxisLength, 0])
        .nice();
};

app.CreateGraph.prototype.createScaleX = function () {

    // создаем ось X

    // var self = this;

    this.xAxis = d3.axisBottom()
        .scale(this.scaleX)
        // .tickValues()
        // .ticks(d3.timeMonth)
        // .tickPadding(10)
        .tickFormat(d3.timeFormat("%d.%m"));
};


app.CreateGraph.prototype.drawScaleX = function () {

    // отрисовка оси Х
    this.svg.append("g")
        .attr("class", "x-axis")
        .attr("transform",  // сдвиг оси вправо и вниз
            "translate(" + (this.margin) + "," + (this.height - 2 * this.margin) + ")")
        // .style("stroke", "#000")
        // .style("stroke-width", 1)
        .call(this.xAxis);
};

app.CreateGraph.prototype.createScaleY = function () {

    // создаем ось Y

    var self = this;

    this.yAxis = d3.axisLeft()
        .scale(this.scaleY)
        // .ticks(7)
        .tickFormat(function (d) {
            d += self.showPercent ? '%' : '';
            return d;
        });
};

app.CreateGraph.prototype.drawScaleY = function () {

    // отрисовка оси Y
    this.svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", // сдвиг оси вправо и вниз
            "translate(" + (this.margin) + "," + 0 + ")")
        .call(this.yAxis);
};

app.CreateGraph.prototype.drawLine = function () {

    var self = this;
    var line = d3.line()
        .x(function (d, i) {
            return (self.scaleX(d.month_date) + self.margin);
        })
        .y(function (d) {
            return (self.scaleY(d.graphic_value) - 2);
        })
        .curve(d3.curveMonotoneX);

// добавляем путь
    this.svg.append("g").append("path")
        .attr("d", line(this.data))
        .style("stroke", "#6daed8")
        .style("stroke-width", 4);

};

app.CreateGraph.prototype.drawArea = function () {

    var self = this;
    var area = d3.area()
        .x(function (d, i) {
            return (self.scaleX(d.month_date) + self.margin + 1);
        })
        .y0(self.height - 2 * self.margin)
        .y1(function (d) {
            return self.scaleY(d.graphic_value);
        })
        .curve(d3.curveMonotoneX);

    this.svg.append("g").append("path")
        .attr("d", area(this.data))
        .style("fill", "#eefaff");
    // .style("stroke", "#000")
    // .style("stroke-width", 2);

};

