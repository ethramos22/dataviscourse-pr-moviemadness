// This is the table we'll use to display the list of movies and some details about each (popular, topRated, nowPlaying)

class MovieTable {
    constructor(globalMovieData) {
        this.globalMovieData = globalMovieData;
        console.log('Start Constructor of Movie Table', this.globalMovieData);

        // Combine all movies, then filter out duplicates by initializing a Set
        const allMovies = this.globalMovieData.popularMovies.concat(this.globalMovieData.topRatedMovies, this.globalMovieData.nowPlayingMovies);
        this.movieData = [...new Set(allMovies)];
        console.log('All movies', this.movieData);

        this.drawMovieList();
    }


    drawMovieList() {
        let rowSelection = d3.select('#movie-list-body')
            .selectAll('tr')
            .data(this.movieData)
            .join('tr');

        let cellSelection = rowSelection.selectAll('td')
            .data(this.rowToCellDataTransform)
            .join('td');

        let textSelection = cellSelection.filter(d => d.type === 'text');
        let vizSelection = cellSelection.filter(d => d.type === 'viz');

        textSelection.selectAll('text')
            .data(d => [d])
            .join('text')
            .text(d => d.value);


    }

    rowToCellDataTransform(movie) {
        // Need to return array with 5 objects on it, so that we draw 5 coluns
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
            type: 'viz'
        };

        let languageNames = new Intl.DisplayNames(['en'], {type: 'language'});
        const language = {
            value: languageNames.of(movie.original_language),
            type: 'text'
        };

        const revenue = {
            value: movie.revenue,
            type: 'viz'
        };
        return [movieName, genre, rating, language, revenue];
    };
}