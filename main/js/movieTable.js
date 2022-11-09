// This is the table we'll use to display the list of movies and some details about each (popular, topRated, nowPlaying)

class MovieTable {
    constructor(globalMovieData) {
        this.globalMovieData = globalMovieData;
        console.log('Start Constructor of Movie Table', this.globalMovieData);

        this.movieData = this.globalMovieData.allMovies;
        console.log('All movies', this.movieData);

        this.vizHeight = 25;
        this.vizWidth = 50;
        this.radius = 10;
        this.fontSize = 10;

        this.circumference = this.radius * 2 * Math.PI;
        this.ratingScale = d3.scaleLinear()
            .domain([0, 10])
            .range([0, this.circumference]);

        this.revenueScale = d3.scaleLinear()
            .domain(d3.extent(this.movieData.map(d => d.revenue)))
            .range([1, this.vizWidth]);

        let revenueAxis = d3.axisTop()
            .scale(this.revenueScale)
            .tickFormat(d3.format(d3.format("$,")))
            .ticks(2);
        
            
        d3.select('#revenue-header')
            .append('svg')
            .attr('width', this.vizWidth)
            .attr('height', 20) 
            .append('g')
            .attr('id', 'revenue-axis')
            .attr('transform', 'translate(0, 20)');
            
        d3.select('#revenue-header')
                .select('svg g')
                .call(revenueAxis)




        this.drawMovieList();
    }


    drawMovieList() {
        let rowSelection = d3.select('#movie-list-body')
            .selectAll('tr')
            .data(this.movieData)
            .join('tr')
            .on('click', (_, d) => this.selectMovie(_, d));

        let cellSelection = rowSelection.selectAll('td')
            .data(this.rowToCellDataTransform)
            .join('td');

        // Draw text items
        let textSelection = cellSelection.filter(d => d.type === 'text');
        this.drawText(textSelection);

        let vizSelection = cellSelection.filter(d => d.type === 'viz');
        let svgSelection = vizSelection.selectAll('svg')
            .data(d => [d])
            .join('svg')
            .attr('width', this.vizWidth)
            .attr('height', this.vizHeight);

        // Draw rating circles
        let ratingSelection = svgSelection.filter(d => d.viz === 'rating');
        this.drawRatingCircles(ratingSelection);

        // Draw revenue
        let revenueSelection = svgSelection.filter(d => d.viz === 'revenue');
        this.drawRevenueBars(revenueSelection);
        

    }

    drawRevenueBars(revenueSelection) {
        // let revenueGroups = revenueSelection.selectAll('g')
        //     .data(d => [d, d])
        //     .join('g');

        // let revenueTextGroup = revenueGroups.filter((d,i) => i === 0);
        // let revenueBarGroup = revenueGroups.filter((d,i) => i === 1);
        revenueSelection.selectAll('rect')
            .data(d => [d])
            .join('rect')
            .attr('height', this.vizHeight)
            .attr('width', d => this.revenueScale(d.value));

        revenueSelection.selectAll('text')
            .data(d => [d])
            .join('text')
            .text(d => d3.format("$,")(d.value))
            .attr('x', this.vizWidth/10)
            .attr('y', this.vizHeight/2)
            .attr('fill', 'red');

            

        

        // revenueSelection
    }

    drawRatingCircles(ratingSelection) {
        let ratingGroup = ratingSelection.selectAll('g')
            .data(d => [d])
            .join('g')
            .attr('transform', (d,i) => {
                return "translate(" + (this.vizWidth/2 ) + "," + (this.vizHeight/2 ) + ")";
            });

        ratingGroup.append('circle')
            .attr('r', this.radius)
            .attr('stroke', 'green')
            .attr('stroke-width', '3')
            .attr('stroke-dasharray', d => {
                const rating = parseFloat(d.value);
                return(`${this.ratingScale(rating)},${this.circumference}`);
            })
            .attr('fill', 'none')
            .attr('transform', 'rotate(-90)');
        
        ratingGroup.append('text')
            .attr("text-anchor", "middle")
            .text(d => {
                const rating = d3.format(".0%")(parseFloat(d.value) / 10);
                return rating;
            })
            // .attr('font-size', this.fontSize)
            .attr('dy', '.3em');

    }
    drawText(textSelection) {
        textSelection.selectAll('text')
            .data(d => [d])
            .join('text')
            .text(d => d.value);
    }

    selectMovie(_, d) {
        this.globalMovieData.selectedMovie = d;
        this.globalMovieData.moviePoster.drawPoster();
    }

    rowToCellDataTransform(movie) {
        // Need to return array with 5 objects on it, so that we draw 5 columns
        // Each object needs to contain the data relevant to the column, as well as the type of content that it is (ie. text or viz)

        const movieName = {
            value: movie.title,
            type: 'text'
        };
        
        let genres = movie.genres.map(g => g.name).join(', ');
        const genre = {
            value: genres,
            type: 'text'
        };

        // Rating is 'vote_average' * 100
        const rating = {
            value: `${movie.vote_average}`,
            type: 'viz',
            viz: 'rating'
        };

        let languageNames = new Intl.DisplayNames(['en'], {type: 'language'});
        const language = {
            value: languageNames.of(movie.original_language),
            type: 'text'

        };

        const revenue = {
            value: movie.revenue,
            type: 'viz',
            viz: 'revenue'
        };
        return [movieName, genre, rating, language, revenue];
    };
}