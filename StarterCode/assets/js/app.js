// @TODO: YOUR CODE HERE!



let svgWidth = 900;
let svgHeight = 600;

let margin = {
    top: 20,
    right: 50,
    bottom: 60,
    left: 50
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

let svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.csv("assets/js/data.csv").then(function (main_data) {

    console.log(main_data);

    main_data.forEach(function(data) {
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.healthcareLow = +data.healthcareLow;
        data.healthcareHigh = +data.healthcareHigh;
        data.obesity = +data.obesity;
        data.obesityLow = +data.obesityLow;
        data.obesityHigh = +data.obesityHigh;
        data.smokes = +data.smokes;
        data.smokesLow = +data.smokesLow;
        data.smokesHigh = +data.smokesHigh;
      });

    let xScale = d3.scaleLinear()
        .domain([d3.min(main_data, d => d.poverty) - d3.max(main_data, d => d.povertyMoe), d3.max(main_data, d => d.poverty) + d3.max(main_data, d => d.povertyMoe)])
        .range([0, width]);

    let yScale = d3.scaleLinear()
        .domain([d3.min(main_data, d => d.healthcareLow), d3.max(main_data, d => d.healthcareHigh)])
        .range([height, 0]);

    let bottomAxis = d3.axisBottom(xScale);
    let leftAxis = d3.axisLeft(yScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    chartGroup.append("g")
        .call(leftAxis);

    let circlesGroup = chartGroup.selectAll("circle")
        .data(main_data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "teal")
        .attr("opacity", ".65");
    });
