// This is the table we'll use to display the list of movies and some details about each (popular, topRated, nowPlaying)

class MovieTable {
    constructor(globalMovieData) {
        this.globalMovieData = globalMovieData;
        console.log('Start Constructor of Movie Table', this.globalMovieData);

        this.movieData = this.globalMovieData.displayedMovies;
        console.log('All movies', this.movieData);

        this.vizHeight = 60;
        this.vizWidth = 70;
        this.radius = 14;
        this.fontSize = 10;

        this.headerInfo = {
            'MovieName': {
                sorted: false,
                ascending: false,
                key:'title',
                type: 'text'
            },
            'Genre': {
                sorted: false,
                ascending: false,
                key:'genres',
                type: 'arr'

            },
            'Rating': {
                sorted: false,
                ascending: false,
                key:'vote_average'
            },
            'Language': {
                sorted: false,
                ascending: false,
                key: 'original_language',
                type: 'lang'
            },
            'Revenue': {
                sorted: false,
                ascending: false,
                key: 'revenue'
            }

        }

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
        this.attachSortHandlers();
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

        revenueSelection.selectAll('rect')
            .data(d => [d])
            .join('rect')
            .attr('height', this.vizHeight)
            .attr('width', d => this.revenueScale(d.value))
            .attr('y', 5)
            .attr('fill', 'lightgrey');

        revenueSelection.selectAll('text')
            .data(d => [d])
            .join('text')
            .text(d => d3.format("$,")(d.value))
            .attr('x', 5)
            .attr('y', this.vizHeight/1.75)
            .attr('fill', 'red');
    }

    drawRatingCircles(ratingSelection) {
        let ratingGroup = ratingSelection.selectAll('g')
            .data(d => [d])
            .join('g')
            .attr('transform', (d,i) => {
                return "translate(" + (this.vizWidth/2 ) + "," + (this.vizHeight/2 ) + ")";
            });

        ratingGroup.selectAll('circle')
            .data(d => [d])
            .join('circle')
            .attr('r', this.radius)
            .attr('stroke', d => {
                let rating = parseFloat(d.value);
                if(rating < 6)
                    return 'red';
                if(rating < 7.4)
                    return 'yellow';
                return 'green';
            })
            .attr('stroke-width', '3')
            .attr('stroke-dasharray', d => {
                const rating = parseFloat(d.value);
                return(`${this.ratingScale(rating)},${this.circumference}`);
            })
            .attr('fill', 'none')
            .attr('transform', 'rotate(-90)');
        
        ratingGroup.selectAll('text')
            .data(d=> [d])
            .join('text')
            .attr("text-anchor", "middle")
            .text(d => {
                const rating = d3.format(".0%")(parseFloat(d.value) / 10);
                return rating;
            })
            .attr('dy', '.3em')
            .attr('fill', 'white');

    }
    drawText(textSelection) {
        textSelection.selectAll('text')
            .data(d => [d])
            .join('text')
            .text(d => d.value);
    }

    attachSortHandlers() {
        d3.select('#movie-list-table').selectAll('th')
            .on('click', (event) => {
                console.log();
                const headerName = event.target.textContent.replace(/[^a-zA-Z]+/g, '');
                let info = this.headerInfo[headerName];

                // If it's already been sorted reverse it, set it to 'descending' and return
                if(info.sorted) {
                    console.log("we've already sorted by", headerName, "so we're going to reverse the list, and set ascending to opposite of what it was");
                    info.ascending = !info.ascending;
                    this.movieData.reverse();

                } else {
                    console.log(headerName, "hasn't been sorted yet. Sorting, and setting sorted and asending to true")
                    // If sorted is false, reset all other sort data and sort it. Then set sorted to true and ascending to true
                    for(let [_, value] of Object.entries(this.headerInfo)) {
                        value.sorted = false;
                        value.ascending = false;
                    }
                    console.log('headerinfo', this.headerInfo)

                    if(info.type === 'text')
                        // Alphabetical
                        this.movieData.sort((a,b) => a[info.key] < b[info.key] ? -1 : 1);
                    else if(info.type == 'lang') {
                        // Sort Language Values
                        let languageNames = new Intl.DisplayNames(['en'], {type: 'language'});
                        this.movieData.sort((a,b) => languageNames.of(a[info.key]) < languageNames.of(b[info.key]) ? -1 : 1);
                    } else if(info.type == 'arr'){
                        // Sort Genre Array
                        this.movieData.sort((a,b) => a[info.key][0].name < b[info.key][0].name ? -1 : 1);
                    }else {
                        // Sort Numerical Values
                        this.movieData.sort((a,b) => a[info.key] > b[info.key] ? -1 : 1);
                    }
                    info.sorted = true;
                    info.ascending = true;
                }

                this.drawMovieList();
            });

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

    updateMovieList() {
        this.movieData = this.globalMovieData.displayedMovies;
        this.drawMovieList();
    }
}