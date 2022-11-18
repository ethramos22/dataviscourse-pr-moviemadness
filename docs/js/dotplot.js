class Dotplot {
    constructor(globalMovieData) {
        this.globalMovieData = globalMovieData;
        this.movieData = this.globalMovieData.displayedMovies;

        this.MARGIN = {top: 25, right: 10, bottom: 60, left: 75}
        this.CHART_WIDTH = 500;
        this.CHART_HEIGHT = 400;

        this.chartTitle = 'Revenue vs Budget';
        this.xAxisData = {
            key: 'budget',
            text: 'Budget'
        };
        this.yAxisData = {
            key: 'revenue',
            text: 'Revenue'
        };


        // Initialize xScale as budget
        this.xScale = d3.scaleLinear()
            .domain(d3.extent(this.movieData.map(d => d.budget)))
            .range([this.MARGIN.left, this.CHART_WIDTH - this.MARGIN.right]);

        // Initialize yScale as revenue
        this.yScale = d3.scaleLinear()
            .domain(d3.extent(this.movieData.map(d => d.revenue)))
            .range([this.CHART_HEIGHT - this.MARGIN.bottom, this.MARGIN.top])

        // position axis
        d3.select('#dotplot-x-axis')
            .attr('transform', `translate(0, ${this.CHART_HEIGHT - this.MARGIN.bottom})`)
        d3.select('#dotplot-y-axis')
            .attr('transform', `translate(${this.MARGIN.left}, 0)`)

        this.drawChart();
        this.attachSelectHandlers();
    }


    drawChart() {

        // draw axis
        this.drawAxis();

        //TODO: Draw circles
        this.drawCircles();
    }

    drawAxis() {
        // Change domain to be specific to displayed data
        console.log('new x domain is for', this.xAxisData.key, 'and it is ', d3.extent(this.movieData.map(d => d[this.xAxisData.key])));

        this.xScale
            .domain(d3.extent(this.movieData.map(d => d[this.xAxisData.key])));

        this.yScale
            .domain(d3.extent(this.movieData.map(d => d[this.yAxisData.key])))

        // draw xAxis
        let xAxis = d3.axisBottom()
            .scale(this.xScale)
            .tickFormat(d => {
                // console.log('logging in tick', this.xAxisData);
                if(this.xAxisData.key === 'runtime'|| this.xAxisData.key == 'vote_average')
                    return d;
                return d/1000000;
            });
        d3.select('#dotplot-x-axis').call(xAxis);

        // draw yAxis
        let yAxis = d3.axisLeft()
            .scale(this.yScale)
            .tickFormat(d => {
                if(this.yAxisData.key === 'runtime' || this.yAxisData.key == 'vote_average')
                    return d;
                return d/1000000;
            });

        d3.select('#dotplot-y-axis').call(yAxis);

        //TODO: FORMAT AXIS AND DRAW LABELS
        d3.select('#dotplot-x-axis').selectAll('.tick text')
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(55)")
            .style("text-anchor", "start");

        this.drawLabelsAndTitles(); 
    }

    drawCircles() {
        let _this = this;

        let circleSelection = d3.select('#dotplot-content')
            .selectAll('circle')
            .data(this.movieData)
            .join('circle')
            .on('mouseover', function(event, d ) {
                console.log('in highlight selected:', event, d, this)
        
                // Get x and y position of circle
                const cx = parseFloat(d3.select(this).attr('cx'));
                const cy = parseFloat(d3.select(this).attr('cy'));
                // Adjust x and y position of tooltip based on position of circle
                let tooltip = d3.select('#dotplot-tooltip');
                let tooltipEnter = tooltip.selectAll('text')
                    .data([d])
                    .enter();

                tooltipEnter.append('text')
                    .text(d => d.title)
                    .attr('x', cx)
                    .attr('y', d => cy > 300 ? cy - 50 : cy + 30)
                    .attr('class', 'tooltip-label')
                    .attr('text-anchor', d => cx < 250 ? 'start' : 'end');

                // y axis info
                tooltipEnter.append('text')
                    .text(d => {
                        let label = _this.yAxisData.text + ': ';

                        if(_this.yAxisData.key === 'runtime')
                            return label + d[_this.yAxisData.key] + ' minutes'

                        if(_this.yAxisData.key == 'vote_average')
                            return label + d[_this.yAxisData.key]


                        return label + d3.format("$,")(d[_this.yAxisData.key]);
                    })
                    .attr('x', cx)
                    .attr('y', d => cy > 300 ? cy - 35 : cy + 45)
                    .attr('class', 'tooltip-label')
                    .attr('text-anchor', d => cx < 250 ? 'start' : 'end');

                // X axis info
                tooltipEnter.append('text')
                    .text(d => {
                        let label = _this.xAxisData.text + ': ';

                        if(_this.xAxisData.key === 'runtime')
                            return label + d[_this.xAxisData.key] + ' minutes'

                        if(_this.xAxisData.key == 'vote_average')
                            return label + d[_this.xAxisData.key]


                        return label + d3.format("$,")(d[_this.xAxisData.key]);
                    })
                    .attr('x', cx)
                    .attr('y', d => cy > 300 ? cy - 20 : cy + 60)
                    .attr('class', 'tooltip-label')
                    .attr('text-anchor', d => cx < 250 ? 'start' : 'end');
            })
            .on('mouseout', (event, d) => {
                d3.select('#dotplot-tooltip')
                    .selectAll('text')
                    .remove();
                // d3.select('#dotplot-tooltip')
                //     .selectAll('rect')
                //     .remove();
            })
            .transition().duration(300)
            .attr('cx', d => this.xScale(d[this.xAxisData.key]))
            .attr('cy', d => this.yScale(d[this.yAxisData.key]))
            .attr('r', 5)
            .attr('class', 'movie-dot');
    }

    drawLabelsAndTitles() {

        // change .data binding to be information about what the label says

        // Y axis label
        d3.select('#dotplot-labelY').selectAll('text')
            .data([this.yAxisData])
            .join('text')
            .text(d => {
                if(this.yAxisData.key === 'runtime')
                    return d.text + ' in minutes';
                
                if(this.yAxisData.key === 'vote_average')
                    return d.text;

                return d.text + ' in millions'
            })
            .attr('fill', 'white')
            .attr('transform', `translate(20, ${this.yAxisData.key === 'vote_average' ? this.CHART_HEIGHT/2 :this.CHART_HEIGHT/2 + this.MARGIN.top + 25}) rotate(-90)`);

        // X axis label
        d3.select('#dotplot-labelX').selectAll('text')
            .data([this.xAxisData])
            .join('text')       
            .text(d => {
                if(this.xAxisData.key === 'runtime')
                    return d.text + ' in minutes';
                if(this.xAxisData.key === 'vote_average')
                    return d.text;
                return d.text + ' in millions';
            })
            .attr('x', d => this.xAxisData.key === 'vote_average' ? this.CHART_WIDTH/2 + 10 :this.CHART_WIDTH/2 - 25)
            .attr('y', this.CHART_HEIGHT)
            .attr('fill', 'white');
        
        // Chart title
        d3.select('#dotplot-title').selectAll('text')
            .data([this.movieData])
            .join('text')       
            .text(d => this.chartTitle)
            .attr('x', this.CHART_WIDTH/2 - 25)
            .attr('y', 15)
            .attr('fill', 'white')
            .attr('font-size', 18);
    }

    attachSelectHandlers() {
        d3.select('#x-axis-select')
            .on('change', (event) => {
                let selectedKey = event.target.value;

                if(selectedKey === 'vote_average')
                    this.xAxisData.text = 'Rating';
                else 
                    this.xAxisData.text = selectedKey.charAt(0).toUpperCase() + selectedKey.slice(1);
                
                this.xAxisData.key = selectedKey;
                this.updateChart();
            })

        d3.select('#y-axis-select')
            .on('change', (event) => {
                let selectedKey = event.target.value;

                if(selectedKey === 'vote_average')
                    this.yAxisData.text = 'Rating';
                else 
                    this.yAxisData.text = selectedKey.charAt(0).toUpperCase() + selectedKey.slice(1);
                
                this.yAxisData.key = selectedKey;
                this.updateChart();
            })
    }

    updateChart() {
        // set movie data
        this.movieData = this.globalMovieData.displayedMovies;
        this.chartTitle = this.yAxisData.text + ' vs ' + this.xAxisData.text;
        this.drawChart();
    }
}