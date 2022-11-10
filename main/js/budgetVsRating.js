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
            .domain([5,10])
            .range([this.CHART_HEIGHT - this.MARGIN.bottom, this.MARGIN.top])


        this.drawChart();
    }

    drawChart() {

        this.drawAxis();
        this.drawCircles();

    }

    drawAxis() {
        // Tranlate axis to correct position
        let xAxisSelect = d3.select('#bvrat-x-axis')
            .attr('transform', `translate(0, ${this.CHART_HEIGHT - this.MARGIN.bottom})`)
        let yAxisSelect = d3.select('#bvrat-y-axis')
            .attr('transform', `translate(${this.MARGIN.left}, 0)`)
        
        // xAxis
        let xAxis = d3.axisBottom()
            .scale(this.xScale);
        xAxisSelect.call(xAxis);

        // yAxis
        let yAxis = d3.axisLeft()
            .scale(this.yScale);
        yAxisSelect.call(yAxis);

        //TODO: FORMAT AXIS AND DRAW LABELS
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