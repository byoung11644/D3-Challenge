// @TODO: YOUR CODE HERE!



let svgWidth = window.innerWidth;
let svgHeight = window.innerHeight;

let margin = {
    top: 30,
    right: 60,
    bottom: 30,
    left: 60
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

let svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.csv("assets/js/data.csv").then(function(data) {

    console.log(data);


});
