// This is the table we'll use to display the list of movies and some details about each (popular, topRated, nowPlaying)

class MovieTable {
    constructor(globalMovieData) {
        this.globalMovieData = globalMovieData;
        console.log('Start Constructor of Movie Table', this.globalMovieData);

        // Combine all movies, then filter out duplicates by initializing a Set
        const allMovies = this.globalMovieData.popularMovies.concat(this.globalMovieData.topRatedMovies, this.globalMovieData.nowPlayingMovies);
        this.movies = [...new Set(allMovies)];
        console.log('All movies', this.movies);
    }
}