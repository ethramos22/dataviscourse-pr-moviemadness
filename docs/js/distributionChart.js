// Overview chart that shows distributions of movie
// characteristics (genre distribution, budget distribution, revenue distribution etc.)
// Clicking on a bar could filter the list of movies to contain only the ones in the selected distribution

class DistributionChart {
    constructor(globalMovieData) {
        console.log('Start Constructor of Distribution Chart', this.globalMovieData);
        this.globalMovieData = globalMovieData;
        
        this.CHART_WIDTH = 500;
        this.CHART_HEIGHT = 500;
        this.MARGIN = { left: 50, bottom: 20, top: 20, right: 20 };
        this.ANIMATION_DUATION = 300;
        // Set Color Scale with the data keys
        let groupedData = d3.group(this.globalMovieData.displayedMovies, d => d.genres[0].name);
        this.colorScale = d3.scaleOrdinal()
            .domain(groupedData.keys())
            .range(['#570408', '#fa4d56', '#012749',
                '#198038', '#6929c4', '#9f1853', '#005d5d',
                '#002d9c', '#8a3800', '#1192e8', '#ee538b',
                '#b28600', '#a56eff', '#009d9a']);
        this.setupChart();
        this.drawChart();
    }

    setupChart() {
    }

    drawChart() {
        // TODO: Fix when movies have multiple genres
        let groupedData = d3.group(this.globalMovieData.displayedMovies, d => d.genres[0].name);
        console.log('groupedData', groupedData);
        let data = groupedData;
        function onMouseEnter(e, datum) {
            console.log(datum);
        }
        function onMouseLeave() {
            console.log('left');
        }
        // Scales
        this.xScale = d3.scaleBand()
            .domain(groupedData.keys())
            .range([this.MARGIN.left, this.CHART_WIDTH - this.MARGIN.right])
            .padding(.1);
        this.yScale = d3.scaleLinear()
            .domain([0, d3.max(groupedData, d => d[1].length)])
            .range([this.CHART_HEIGHT - this.MARGIN.bottom - this.MARGIN.top, 0])
            .nice();
        // X Axis
        let xAxis = d3.select('#x-axis')
            .attr('transform', `translate(0,${this.CHART_HEIGHT - this.MARGIN.bottom})`)
            .call(d3.axisBottom(this.xScale));
        // Y Axis
        d3.select('#y-axis')
            .call(d3.axisLeft(this.yScale))
            .attr('transform', `translate(${this.MARGIN.left}, ${this.MARGIN.top})`);
        // Draw Chart
        let bars = d3.select('#bars')
            .selectAll('rect')
            .data(data)
        
        bars.join('rect')
            .on('mouseenter', onMouseEnter)
            .on('mouseleave', onMouseLeave)
            .transition().duration(this.ANIMATION_DUATION)
            .attr('x', d => this.xScale(d[0]))
            .attr('y', d => this.CHART_HEIGHT - (this.CHART_HEIGHT - this.yScale(d[1].length)) + this.MARGIN.top)
            .attr('width', this.xScale.bandwidth())
            .attr('height', d => this.yScale(0) - this.yScale(d[1].length))
            .attr('fill', 'lightgrey');
        // Tick rotate: https://bl.ocks.org/mbostock/4403522
        xAxis.selectAll('.tick text')
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(55)")
            .style("text-anchor", "start");
    }
}