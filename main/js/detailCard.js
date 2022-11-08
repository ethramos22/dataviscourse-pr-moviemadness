// This is the detail card we'll display in the middle of the screen with movie specifics, 
// similar/recommended movies, and the movie banner image.

class MovieDetailCard {
    constructor(globalMovieData) {
        this.globalMovieData = globalMovieData;
        console.log('Start Constructor of Movie Detail Card', this.globalMovieData);
        // Testing purposes, remove with interaction
        this.globalMovieData.selectedMovie = this.globalMovieData.popularMovies[0];
        console.log('selected movie: ', this.globalMovieData.selectedMovie);
        
        this.drawPoster();
    }

    drawPoster() {
        let d = this.globalMovieData.selectedMovie;
        let base_image_url = 'https://image.tmdb.org/t/p/w500';
        let selection = d3.select('#movie-poster');
        selection.append('div')
            .attr('id', 'poster-title')
            .attr('href', d.homepage)
            .text(d.title);
        
        let subhead = selection.append('div')
            .attr('id', 'poster-subhead');
        subhead.append('div')
            .attr('id', 'poster-runtime')
            .text(d.runtime+' minutes');
        subhead.append('div')
            .attr('id', 'poster-genre')
            .text(d.genres.map(d => d.name).toString());
        // TODO: format revenue
        subhead.append('div')
            .attr('id', 'poster-revenue')
            .text('$'+d.revenue);
        
        let body = selection.append('div')
            .attr('id', 'poster-body');
        body.append('div')
            .attr('id', 'poster-overview')
            .text(d.overview);
        body.append('svg')
            .attr('id', 'poster-image')
            .append('image')
            .attr('href', base_image_url + d.poster_path);
        
        let footing = selection.append('div')
            .attr('id', 'poster-footing');
        footing.append('div')
            .attr('id', 'poster-related');
    }
}