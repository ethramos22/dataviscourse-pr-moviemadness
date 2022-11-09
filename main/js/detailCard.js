// This is the detail card we'll display in the middle of the screen with movie specifics, 
// similar/recommended movies, and the movie banner image.

class MovieDetailCard {
    constructor(globalMovieData) {
        this.globalMovieData = globalMovieData;
        console.log('Start Constructor of Movie Detail Card', this.globalMovieData);
        
        console.log('selected movie: ', this.globalMovieData.selectedMovie);
        this.posterSetup();
        this.drawPoster();
    }

    posterSetup() {
        let selection = d3.select('#movie-poster');
        selection.append('div')
            .attr('id', 'poster-title');
        // Setup Subheader
        let subhead = selection.append('div')
            .attr('id', 'poster-subhead');
        subhead.append('div')
            .attr('id', 'poster-runtime');
        subhead.append('div')
            .attr('id', 'poster-genre');
        subhead.append('div')
            .attr('id', 'poster-revenue');
        // Setup Image section
        selection.append('svg')
            .attr('id', 'poster-svg')
            .attr('height', 300)
            .append('image')
            .attr('id', 'poster-image');
        // Overview    
        selection.append('div')
            .attr('id', 'poster-overview');    
        // Footing
        let footing = selection.append('div')
            .attr('id', 'poster-footing');
        footing.append('div')
            .attr('id', 'poster-related');
    }

    drawPoster() {
        let d = this.globalMovieData.selectedMovie;
        if (d == null) {
            return;
        }
        let base_image_url = 'https://image.tmdb.org/t/p/w200';
        // Title
        d3.select('#poster-title')
            .attr('href', d.homepage)
            .text(d.title);            
        // Runtime
        d3.select('#poster-runtime')
            .text(d.runtime+' minutes');
        // Genre
        d3.select('#poster-genre')
            .text(d.genres.map(d => d.name).toString());
        // TODO: format revenue
        d3.select('#poster-revenue')
            .text(d.revenue == "0" ? "" : '$' + d3.format("~s")(d.revenue));
        // Image of poster
        d3.select('#poster-image')
            .attr('href', base_image_url + d.poster_path);
        // Text overview
        d3.select('#poster-overview').text(d.overview);
    }
}