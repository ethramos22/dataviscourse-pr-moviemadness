// Overview chart that shows distributions of movie
// characteristics (genre distribution, budget distribution, revenue distribution etc.)
// Clicking on a bar could filter the list of movies to contain only the ones in the selected distribution

class DistributionChart {
    constructor(globalMovieData) {
        this.globalMovieData = globalMovieData;
        this.CHART_WIDTH = 500;
        this.CHART_HEIGHT = 375;
        this.MARGIN = { left: 50, bottom: 20, top: 20, right: 20 };
        this.ANIMATION_DUATION = 300;
        
        this.setupTooltip();
        this.drawLabelsAndTitles();
        this.drawChart();
    }

    setupTooltip() {
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
    }

    drawChart() {
        let _this = this;
        const currentDisplay = this.globalMovieData.displayedMovies
        const groupedData = d3.group(currentDisplay, d => d.genres.length === 0 ? 'None' : d.genres[0].name)
        let data = groupedData; 
        const tooltip = d3.select('#tooltip-barchart');
        // Scales
        const xScale = d3.scaleBand()
            .domain(groupedData.keys())
            .range([this.MARGIN.left, this.CHART_WIDTH - this.MARGIN.right])
            .padding(.1);
        
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(groupedData, d => d[1].length)])
            .range([this.CHART_HEIGHT - this.MARGIN.bottom - this.MARGIN.top, 0])
            .nice();
        
        function onMouseEnter(e, datum) {
            tooltip.style('visibility', 'visible');
            // Edit Tooltip
            let percentage = d3.format(".0%")(datum[1].length/currentDisplay.length);
            tooltip.select('#movie-amount')
                .text(`${percentage} of movies`);
            tooltip.select('#movies')
                .text(datum[1].map(d => d.title).join(' '));
            // Set position
            const x = xScale(datum[0]) - _this.MARGIN.left;
            const y = yScale(datum[1].length) - (2*_this.MARGIN.bottom);
            tooltip.style('top', y + 'px')
            .style('left', x+'px');
        }

        function onMouseLeave(e) {
            tooltip.style('visibility', 'hidden');
        }

        function onMouseClick(e, datum) {

            // check if selected was clicked again
            let clickedSelected = d3.select(this).attr('id') === 'selected-bar';

            // reset color styling on previously selected bar
            d3.select('#selected-bar').attr('id', null);

            if (clickedSelected) {
                _this.globalMovieData.displayedMovies = currentDisplay;

            } 
            else {
                _this.globalMovieData.displayedMovies = datum[1];
                // style newly selected bar
                 d3.select(this).attr('id', 'selected-bar')                
            }
            // Update charts
            _this.globalMovieData.dotplot.updateChart();
            _this.globalMovieData.movieTable.updateMovieList();
        }

        // X Axis
        let xAxis = d3.select('#x-axis')
            .attr('transform', `translate(0,${this.CHART_HEIGHT - this.MARGIN.bottom})`)
            .call(d3.axisBottom(xScale));
        // Y Axis
        d3.select('#y-axis')
            .call(d3.axisLeft(yScale))
            .attr('transform', `translate(${this.MARGIN.left}, ${this.MARGIN.top})`);
        // Draw Chart
        let bars = d3.select('#bars')
            .selectAll('rect')
            .data(data)
        
        bars.join('rect')
            .on('mouseenter', onMouseEnter)
            .on('mouseleave', onMouseLeave)
            .on('click', onMouseClick)
            .transition().duration(this.ANIMATION_DUATION)
            .attr('x', d => xScale(d[0]))
            .attr('y', d => this.CHART_HEIGHT - (this.CHART_HEIGHT - yScale(d[1].length)) + this.MARGIN.top)
            .attr('width', xScale.bandwidth())
            .attr('height', d => yScale(0) - yScale(d[1].length))
            .attr('class', 'bar')
            .attr('id', null);

            // Tick rotate: https://bl.ocks.org/mbostock/4403522
        xAxis.selectAll('.tick text')
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(55)")
            .style("text-anchor", "start");
    }

    drawLabelsAndTitles() {
        // Y axis label
        d3.select('#barchart-labelY').append('text')
            .text("Movie Count")
            .attr("fill", 'lightgrey')
            .attr('transform', `translate(20, ${this.CHART_HEIGHT/2 + this.MARGIN.top + 25}) rotate(-90)`);

        // X axis lable
        d3.select('#barchart-labelX').append('text')
            .text('Genre')
            .attr('fill', 'lightgrey')
            .attr('x', this.CHART_WIDTH/2 + 10)
            .attr('y', this.CHART_HEIGHT + 40);

        // Title
        d3.select('#barchart-title').append('text')
            .text('Genre Distribution')
            .attr('x', this.CHART_WIDTH/2 - 25)
            .attr('y', 15)
            .attr('fill', 'lightgrey')
            .attr('font-size', 18);
    }
}