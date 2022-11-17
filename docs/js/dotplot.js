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
        d3.select('#bvrev-x-axis')
            .attr('transform', `translate(0, ${this.CHART_HEIGHT - this.MARGIN.bottom})`)
        d3.select('#bvrev-y-axis')
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
        d3.select('#bvrev-x-axis').call(xAxis);

        // draw yAxis
        let yAxis = d3.axisLeft()
            .scale(this.yScale)
            .tickFormat(d => {
                if(this.yAxisData.key === 'runtime' || this.yAxisData.key == 'vote_average')
                    return d;
                return d/1000000;
            });

        d3.select('#bvrev-y-axis').call(yAxis);

        //TODO: FORMAT AXIS AND DRAW LABELS
        d3.select('#bvrev-x-axis').selectAll('.tick text')
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(55)")
            .style("text-anchor", "start");

        this.drawLabelsAndTitles(); 
    }

    drawCircles() {
        let circleSelection = d3.select('#bvrev-content')
            .selectAll('circle')
            .data(this.movieData)
            .join('circle')
            .transition().duration(300)
            .attr('cx', d => this.xScale(d[this.xAxisData.key]))
            .attr('cy', d => this.yScale(d[this.yAxisData.key]))
            .attr('r', 3)
            .attr('stroke', 'black')
            .attr('fill', 'red');
    }

    drawLabelsAndTitles() {

        // change .data binding to be information about what the label says

        // Y axis label
        d3.select('#dot-plot-labelY').selectAll('text')
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
        d3.select('#dot-plot-labelX').selectAll('text')
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
        d3.select('#dot-plot-title').selectAll('text')
            .data([this.movieData])
            .join('text')       
            .text(d => this.chartTitle)
            .attr('x', this.CHART_WIDTH/2 - 25)
            .attr('y', 30)
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