class RatingVsRevenueChart {
    constructor(globalMovieData) {
        this.globalMovieData = globalMovieData;
        this.movieData = this.globalMovieData.displayedMovies;

        this.MARGIN = {top: 10, right: 10, bottom: 20, left: 80}

        this.CHART_HEIGHT = 360;
        this.CHART_WIDTH = 420;

        this.xScale = d3.scaleLinear()
            .domain(d3.extent(this.movieData.map(d => d.revenue)))
            .range([this.MARGIN.left, this.CHART_WIDTH - this.MARGIN.right]);

        this.yScale = d3.scaleLinear()
            .domain(d3.extent(this.movieData.map(d => d.vote_average)))
            .range([this.CHART_HEIGHT - this.MARGIN.bottom, this.MARGIN.top])

        d3.select('#rvr-x-axis')
            .attr('transform', `translate(0, ${this.CHART_HEIGHT - this.MARGIN.bottom})`)
        d3.select('#rvr-y-axis')
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
        this.xScale
        .domain(d3.extent(this.movieData.map(d => d.revenue)));
        this.yScale
            .domain(d3.extent(this.movieData.map(d => d.vote_average)));
        
        // xAxis
        let xAxis = d3.axisBottom()
            .scale(this.xScale);
            d3.select('#rvr-x-axis').call(xAxis);

        // yAxis
        let yAxis = d3.axisLeft()
            .scale(this.yScale);
        d3.select('#rvr-y-axis').call(yAxis);

        //TODO: FORMAT AXIS AND DRAW LABELS
    }

    drawCircles() {
        let circleSelection = d3.select('#rvr-content')
            .selectAll('circle')
            .data(this.movieData)
            .join('circle')
            .transition().duration(300)
            .attr('cx', d => this.xScale(d.revenue))
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