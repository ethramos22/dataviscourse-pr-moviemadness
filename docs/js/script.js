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
    budgetVsRevenueChart: null,
    budgetVsRatingChart: null,
    ratingVsRevenueChart: null
};

// have list of displayedMovies

// ***** APPLICATION MOUNTING *****
loadData().then((loadedData) => {
    console.log('Here is the loaded data', loadedData);

    // Setup global data
    globalMovieData.popularMovies = loadedData.popularMovies;
    globalMovieData.topRatedMovies = loadedData.topRatedMovies;
    globalMovieData.nowPlayingMovies = loadedData.nowPlayingMovies;
    
    // Combine all movies, then filter out duplicates by initializing a Set
    const allMovies = globalMovieData.popularMovies.concat(globalMovieData.topRatedMovies, globalMovieData.nowPlayingMovies);
    globalMovieData.displayedMovies = [...new Set(allMovies)];
    
    // Start poster as first movie on list
    globalMovieData.selectedMovie = globalMovieData.displayedMovies[0];
    // Create the visualiztions
    const movieTable = new MovieTable(globalMovieData);
    globalMovieData.movieTable = movieTable;
    
    const movieDetailCard = new MovieDetailCard(globalMovieData);
    globalMovieData.moviePoster = movieDetailCard;
    
    const distributionChart = new DistributionChart(globalMovieData);
    globalMovieData.distributionChart = distributionChart;

    const budgetVsRevenueChart = new BudgetVsRevenueChart(globalMovieData);
    globalMovieData.budgetVsRevenueChart = budgetVsRevenueChart;

    // const budgetVsRatingChart = new BudgetVsRatingChart(globalMovieData);
    // globalMovieData.budgetVsRatingChart = budgetVsRatingChart;

    // const ratingVsRevenueChart = new RatingVsRevenueChart(globalMovieData);
    // globalMovieData.ratingVsRevenueChart = ratingVsRevenueChart;



    d3.selectAll('.change-movie-selection-btn')
    .on('click', (event) => {
        let value = event.target.value;
        
        // If all is selected, group all categories up
        if(value === "all") {
            const allMovies = globalMovieData.popularMovies.concat(globalMovieData.topRatedMovies, globalMovieData.nowPlayingMovies);
            // console.log('Setting displayed movies to "all"', allMovies);
            globalMovieData.displayedMovies = [...new Set(allMovies)];
        } else {
            // console.log('Setting displayed movies to', globalMovieData[value]);
            globalMovieData.displayedMovies = globalMovieData[value];
        }
        // console.log('calling updateMovieList');
        globalMovieData.selectedMovie = globalMovieData.displayedMovies[0];
        globalMovieData.movieTable.updateMovieList();
        globalMovieData.moviePoster.drawPoster();
        globalMovieData.distributionChart.drawChart();
        globalMovieData.budgetVsRevenueChart.updateChart();
        // globalMovieData.budgetVsRatingChart.updateChart();
        // globalMovieData.ratingVsRevenueChart.updateChart();



        
    });
})

// ***** GLOBAL EVENT BINDING *****

