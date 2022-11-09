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


        this.drawChart();
    }


    drawChart() {

        // draw axis
        this.drawAxis();

        //TODO: Draw circles
    }

    drawAxis() {
        // Tranlate axis to correct position
        let xAxisSelect = d3.select('#bvrev-x-axis')
            .attr('transform', `translate(0, ${this.CHART_HEIGHT - this.MARGIN.bottom})`)
        let yAxisSelect = d3.select('#bvrev-y-axis')
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

}