class BudgetVsRatingChart {
    constructor(globalMovieData) {
        this.globalMovieData = globalMovieData;

        this.movieData = this.globalMovieData.displayedMovies;

        this.MARGIN = {top: 10, right: 10, bottom: 20, left: 80}

        this.CHART_HEIGHT = 360;
        this.CHART_WIDTH = 420;

        this.xScale = d3.scaleLinear()
            .domain(d3.extent(this.movieData.map(d => d.budget)))
            .range([this.MARGIN.left, this.CHART_WIDTH - this.MARGIN.right]);

        this.yScale = d3.scaleLinear()
            .domain(d3.extent(this.movieData.map(d => d.vote_average)))
            .range([this.CHART_HEIGHT - this.MARGIN.bottom, this.MARGIN.top])

        // Tranlate axis to correct position
        d3.select('#bvrat-x-axis')
            .attr('transform', `translate(0, ${this.CHART_HEIGHT - this.MARGIN.bottom})`)
        d3.select('#bvrat-y-axis')
            .attr('transform', `translate(${this.MARGIN.left}, 0)`)

        this.drawChart();
    }

    drawChart() {

        this.drawAxis();
        this.drawCircles();

    }

    drawAxis() {
        this.xScale
            .domain(d3.extent(this.movieData.map(d => d.budget)));
        this.yScale
            .domain(d3.extent(this.movieData.map(d => d.vote_average)));

                
        // xAxis
        let xAxis = d3.axisBottom()
            .scale(this.xScale);
        d3.select('#bvrat-x-axis').call(xAxis);

        // yAxis
        let yAxis = d3.axisLeft()
            .scale(this.yScale);
        d3.select('#bvrat-y-axis').call(yAxis);

        //TODO: FORMAT AXIS AND DRAW LABELS
        // Tick rotate: https://bl.ocks.org/mbostock/4403522
        d3.select('#bvrat-x-axis').selectAll('.tick text')
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(55)")
            .style("text-anchor", "start");
    }

    drawCircles() {
        let circleSelection = d3.select('#bvrat-content')
            .selectAll('circle')
            .data(this.movieData)
            .join('circle')
            .transition().duration(300)
            .attr('cx', d => this.xScale(d.budget))
            .attr('cy', d => this.yScale(d.vote_average))
            .attr('r', 3)
            .attr('stroke', 'black')
            .attr('fill', 'red');
    }

    updateChart() {
        this.movieData = this.globalMovieData.displayedMovies;
        this.drawChart();
    }
}