// Here we'll load in the data from the json files, mount the application, and bind any events that have global impact ()


// ***** DATA LOADING *****
async function loadData() {
    const popularMovies = await d3.json('data/popular.json');
    const topRatedMovies = await d3.json('data/topRated.json');
    const nowPlayingMovies = await d3.json('data/nowPlaying.json');

    return{popularMovies, topRatedMovies, nowPlayingMovies};
}

// ***** STATE MANAGEMENT ******
const globalMovieData = {
    popularMovies: null,
    topRatedMovies: null,
    nowPlayingMovies: null,
    displayedMovies: null,
    selectedMovie: null,
    movieTable: null,
    moviePoster: null,
    distributionChart: null,
    dotplot: null,
};


// ***** APPLICATION MOUNTING *****
loadData().then((loadedData) => {
    console.log('Here is the loaded data', loadedData);

    // Setup global data
    globalMovieData.popularMovies = loadedData.popularMovies;
    globalMovieData.topRatedMovies = loadedData.topRatedMovies;
    globalMovieData.nowPlayingMovies = loadedData.nowPlayingMovies;
    
    // Combine all movies, then filter out duplicates by initializing a Set
    const allMovies = globalMovieData.popularMovies.concat(globalMovieData.topRatedMovies, globalMovieData.nowPlayingMovies);
    globalMovieData.displayedMovies = [...new Map(allMovies.map((movie) => [movie.id, movie])).values()];
    
    // Start poster as first movie on list
    globalMovieData.selectedMovie = globalMovieData.displayedMovies[0];
    // Create the visualiztions
    const movieTable = new MovieTable(globalMovieData);
    globalMovieData.movieTable = movieTable;
    
    const movieDetailCard = new MovieDetailCard(globalMovieData);
    globalMovieData.moviePoster = movieDetailCard;
    
    const distributionChart = new DistributionChart(globalMovieData);
    globalMovieData.distributionChart = distributionChart;

    const dotplot = new Dotplot(globalMovieData);
    globalMovieData.dotplot = dotplot;


    d3.selectAll('.change-movie-selection-btn')
    .on('click', (event) => {
        let value = event.target.value;
        
        // If all is selected, group all categories up
        if(value === "all") {
            const allMovies = globalMovieData.popularMovies.concat(globalMovieData.topRatedMovies, globalMovieData.nowPlayingMovies);
            globalMovieData.displayedMovies = [...new Map(allMovies.map((movie) => [movie.id, movie])).values()];
        } else {
            globalMovieData.displayedMovies = globalMovieData[value];
        }
        globalMovieData.selectedMovie = globalMovieData.displayedMovies[0];
        globalMovieData.movieTable.updateMovieList();
        globalMovieData.moviePoster.drawPoster();
        globalMovieData.distributionChart.drawChart();
        globalMovieData.dotplot.updateChart();        
    });
})

// ***** GLOBAL EVENT BINDING *****

