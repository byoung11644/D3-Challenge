// @TODO: YOUR CODE HERE!



let svgWidth = 960;
let svgHeight = 500;

let margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

let svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .classed("chart", true);

let chosenXAxis = "poverty";

function xChoice(main_data, chosenXAxis) {
    let xScale = d3.scaleLinear()
        .domain([d3.min(main_data, d => d[chosenXAxis]) * 0.9, d3.max(main_data, d => d[chosenXAxis]) * 1.1])
        .range([0, width]);
    return xScale;
}

function renderAxes(newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}

function updateToolTip(chosenXAxis, circlesGroup) {

    let label;

    if (chosenXAxis === "poverty") {
        label = "Poverty (%):";
    }
    else {
        label = "Age (Median):";
    }

    let toolTip = d3.tip()
        .attr("class", "td3-tip")
        .offset([40, -30])
        .html(function (d) {
            return (`${d.state}<br>${label}: ${d[chosenXAxis]}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}

d3.csv("assets/js/data.csv").then(function (main_data, err) {

    console.log(main_data);

    if (err) throw err;

    main_data.forEach(function (data) {
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

    let xScale = xChoice(main_data, chosenXAxis);

    let yScale = d3.scaleLinear()
        .domain([d3.min(main_data, d => d.healthcareLow), d3.max(main_data, d => d.healthcareHigh)])
        .range([height, 0]);

    let bottomAxis = d3.axisBottom(xScale);
    let leftAxis = d3.axisLeft(yScale);

    let xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);


    let yAxis = chartGroup.append("g")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .call(leftAxis);


    var circlesGroup = chartGroup.selectAll("circle")
        .data(main_data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d[chosenXAxis]))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", "10")
        .classed("stateCircle", true)
        .attr("opacity", ".8");

    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (Median)");

    let stateLabels = chartGroup.select("text")
        .data(main_data)
        .enter()
        .append("text")
        .attr("x", d => xScale(d[chosenXAxis]))
        .attr("y", d => yScale(d.healthcare))
        .attr("dominant-baseline", "middle")
        .classed("stateText", true)
        .text(function (d) {
            return d.abbr;
        });

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Lacks Healthcare (%)");

    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    labelsGroup.selectAll("text")
        .on("click", function () {
            let value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {
                chosenXAxis = value;

                console.log(chosenXAxis)


                xScale = xChoice(main_data, chosenXAxis);

                xAxis = renderAxes(xScale, xAxis);

                circlesGroup = renderCircles(circlesGroup, xScale, chosenXAxis);

                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                if (chosenXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
}).catch(function (error) {
    console.log(error);
});
