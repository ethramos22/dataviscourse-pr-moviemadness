// Overview chart that shows distributions of movie
// characteristics (genre distribution, budget distribution, revenue distribution etc.)

// Clicking on a bar could filter the list of movies to contain only the ones in the selected distribution

class DistributionChart {
    constructor(globalMovieData) {
        this.globalMovieData = globalMovieData;
        console.log('Start Constructor of Distribution Chart', this.globalMovieData);
        // TODO: Fix when movies have multiple genres
        let groupedData = d3.group(this.globalMovieData.allMovies, d => d.genres[0].name);
        console.log('groupedData', groupedData);
        this.setupChart();
        this.drawChart();
    }

    setupChart() {

    }

    drawChart() {

    }
}