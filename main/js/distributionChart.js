// Overview chart that shows distributions of movie
// characteristics (genre distribution, budget distribution, revenue distribution etc.)
// Clicking on a bar could filter the list of movies to contain only the ones in the selected distribution

class DistributionChart {
    constructor(globalMovieData) {
        console.log('Start Constructor of Distribution Chart', this.globalMovieData);
        this.globalMovieData = globalMovieData;
        
        this.CHART_WIDTH = 500;
        this.CHART_HEIGHT = 250;
        this.MARGIN = { left: 50, bottom: 20, top: 20, right: 20 };
        this.ANIMATION_DUATION = 300;

        // TODO: Fix when movies have multiple genres
        let groupedData = d3.group(this.globalMovieData.allMovies, d => d.genres[0].name);
        console.log('groupedData', groupedData);

        // Scales
        this.xScale = d3.scaleBand()
            .domain(groupedData.keys())
            .range([this.MARGIN.left, this.CHART_WIDTH - this.MARGIN.right])
            .padding(.1);
        this.yScale = d3.scaleLinear()
            .domain([0, d3.max(groupedData, d => d[1].length)])
            .range([this.CHART_HEIGHT - this.MARGIN.bottom - this.MARGIN.top, 0])
            .nice();
        
        this.setupChart();
        this.drawChart(groupedData);
    }

    setupChart() {
    }

    drawChart(data) {
        // X Axis
        d3.select('#x-axis')
            .attr('transform', `translate(0,${this.CHART_HEIGHT - this.MARGIN.bottom})`)
            .call(d3.axisBottom(this.xScale));
        // Y Axis
        d3.select('#y-axis')
            .call(d3.axisLeft(this.yScale))
            .attr('transform', `translate(${this.MARGIN.left}, ${this.MARGIN.top})`);
        // Draw Chart
        let bars = d3.select('#bars')
            .selectAll('rect')
            .data(data);
        bars.join('rect')
            .transition().duration(this.ANIMATION_DUATION)
            .attr('x', d => this.xScale(d[0]))
            .attr('y', d => this.CHART_HEIGHT - (this.CHART_HEIGHT - this.yScale(d[1].length)) + this.MARGIN.top)
            .attr('width', this.xScale.bandwidth())
            .attr('height', d => this.yScale(0) - this.yScale(d[1].length));
    }
}