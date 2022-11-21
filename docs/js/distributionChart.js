// Overview chart that shows distributions of movie
// characteristics (genre distribution, budget distribution, revenue distribution etc.)
// Clicking on a bar could filter the list of movies to contain only the ones in the selected distribution

class DistributionChart {
    constructor(globalMovieData) {
        console.log('Start Constructor of Distribution Chart', this.globalMovieData);
        this.globalMovieData = globalMovieData;
        
        this.CHART_WIDTH = 500;
        this.CHART_HEIGHT = 375;
        
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
        var tooltip = d3.select('#overview-chart').append('div')
            .style('visibility', 'hidden')
            .style('position', 'absolute')
            .style('background', '#fff')
            .style('border-radius', 5)
            .style('padding', "0.6em 1em")
            .style('box-shadow', '0 6px 8px rgba(52, 73, 94, .2), 0 1px 1px rgba(52, 73, 94, 0.1)')
            .style('z-index', 10)
            .style('text-align', 'center')
            .classed('tooltip', true)
            .attr('id', 'tooltip-barchart');
        tooltip.append('div')
            .attr('id', 'movie-amount');
        tooltip.append('div')
            .attr('id', 'movies');
        tooltip.append('div')
            .attr('id', 'percentage');
    }

    drawChart() {
        const MARGIN = { left: 50, bottom: 20, top: 20, right: 20 };
        // TODO: Fix when movies have multiple genres
        const currentDisplay = this.globalMovieData.displayedMovies
        const groupedData = d3.group(currentDisplay, d => d.genres[0].name);
        console.log('groupedData', groupedData);
        let data = groupedData; 
        const tooltip = d3.select('#tooltip-barchart');
        // Scales
        const xScale = d3.scaleBand()
            .domain(groupedData.keys())
            .range([MARGIN.left, this.CHART_WIDTH - MARGIN.right])
            .padding(.1);
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(groupedData, d => d[1].length)])
            .range([this.CHART_HEIGHT - MARGIN.bottom - MARGIN.top, 0])
            .nice();
        
        function onMouseEnter(e, datum) {
            tooltip.style('visibility', 'visible');
            // Outline Bar
            d3.select(e.path[0]).attr('fill', 'rgb(220, 119, 119)');
            // Edit Tooltip
            tooltip.select('#movie-amount')
                .text(`${datum[1].length} out of ${currentDisplay.length} movies`);
            console.log(datum);
            tooltip.select('#movies')
                .text(datum[1].map(d => d.title).join(' '));
            tooltip.select('#percentage')
                .text(`${d3.format(".0%")(datum[1].length/currentDisplay.length)} of movies`);
            // Set position
            const x = xScale(datum.x0)
                + (xScale(datum.x1) - xScale(datum.x0)) / 2
                + MARGIN.left;
            const y = yScale(datum)
                + MARGIN.top;
            tooltip.style('top', y+'px')
            .style('left', x+'px');
        }

        function onMouseLeave(e) {
            tooltip.style('visibility', 'hidden');
            d3.select(e.path[0]).attr('fill', 'lightgrey');
        }
        // X Axis
        let xAxis = d3.select('#x-axis')
            .attr('transform', `translate(0,${this.CHART_HEIGHT - MARGIN.bottom})`)
            .call(d3.axisBottom(xScale));
        // Y Axis
        d3.select('#y-axis')
            .call(d3.axisLeft(yScale))
            .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);
        // Draw Chart
        let bars = d3.select('#bars')
            .selectAll('rect')
            .data(data)
        
        bars.join('rect')
            .on('mouseenter', onMouseEnter)
            .on('mouseleave', onMouseLeave)
            .transition().duration(this.ANIMATION_DUATION)
            .attr('x', d => xScale(d[0]))
            .attr('y', d => this.CHART_HEIGHT - (this.CHART_HEIGHT - yScale(d[1].length)) + MARGIN.top)
            .attr('width', xScale.bandwidth())
            .attr('height', d => yScale(0) - yScale(d[1].length))
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