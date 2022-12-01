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
        selection.append('div')
            .attr('id', 'poster-genre');
        // Setup Subheader
        let subhead = selection.append('div')
            .attr('id', 'poster-subhead')
            .classed('card-alt', true);
        subhead.append('div')
            .attr('id', 'poster-runtime');
        subhead.append('div')
            .attr('id', 'poster-revenue');
        // Budget
        selection.append('div')
            .attr('id', 'poster-budget');
        // Setup Image section
        selection.append('svg')
            .attr('id', 'poster-svg')
            .attr('height', 300)
            .append('image')
            .attr('id', 'poster-image');
        // Overview    
        selection.append('div')
            .attr('id', 'poster-overview');  
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
        // Revenue
        d3.select('#poster-revenue')
            .text(d.revenue == "0" ? "" : 'Revenue: $' + d3.format(".3~s")(d.revenue));
        // Budget
        d3.select('#poster-budget')
            .text(d.budget == "0" ? "" : 'Budget: $' + d3.format(".3~s")(d.budget));
        // Image of poster
        d3.select('#poster-image')
            .attr('href', base_image_url + d.poster_path);
        // Text overview
        d3.select('#poster-overview').text(d.overview);
    }
}