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
    nowPlayingMovies: null
};

// ***** APPLICATION MOUNTING *****
loadData().then((loadedData) => {
    console.log('Here is the loaded data', loadedData);

    // Setup global data
    globalMovieData.popularMovies = loadedData.popularMovies;
    globalMovieData.topRatedMovies = loadedData.topRatedMovies;
    globalMovieData.nowPlayingMovies = loadedData.nowPlayingMovies;

    // Create the visualiztions
    const movieTable = new MovieTable(globalMovieData);
    const movieDetailCard = new MovieDetailCard(globalMovieData);
    const distributionChart = new DistributionChart(globalMovieData);
})

// ***** GLOBAL EVENT BINDING *****