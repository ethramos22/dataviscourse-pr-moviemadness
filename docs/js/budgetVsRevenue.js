class BudgetVsRevenueChart {
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
            .domain(d3.extent(this.movieData.map(d => d.revenue)))
            .range([this.CHART_HEIGHT - this.MARGIN.bottom, this.MARGIN.top])

        // position axis
        d3.select('#bvrev-x-axis')
            .attr('transform', `translate(0, ${this.CHART_HEIGHT - this.MARGIN.bottom})`)
        d3.select('#bvrev-y-axis')
            .attr('transform', `translate(${this.MARGIN.left}, 0)`)

        this.drawChart();
    }


    drawChart() {

        // draw axis
        this.drawAxis();

        //TODO: Draw circles
        this.drawCircles();
    }

    drawAxis() {
        // Change domain to be specific to displayed data
        this.xScale
            .domain(d3.extent(this.movieData.map(d => d.budget)));
        this.yScale
            .domain(d3.extent(this.movieData.map(d => d.revenue)));

        // draw xAxis
        let xAxis = d3.axisBottom()
            .scale(this.xScale);
        d3.select('#bvrev-x-axis').call(xAxis);

        // draw yAxis
        let yAxis = d3.axisLeft()
            .scale(this.yScale);
        d3.select('#bvrev-y-axis').call(yAxis);

        //TODO: FORMAT AXIS AND DRAW LABELS
    }

    drawCircles() {
        let circleSelection = d3.select('#bvrev-content')
            .selectAll('circle')
            .data(this.movieData)
            .join('circle')
            .transition().duration(300)
            .attr('cx', d => this.xScale(d.budget))
            .attr('cy', d => this.yScale(d.revenue))
            .attr('r', 3)
            .attr('stroke', 'black')
            .attr('fill', 'red');
    }

    updateChart() {
        this.movieData = this.globalMovieData.displayedMovies;
        this.drawChart();
    }

}