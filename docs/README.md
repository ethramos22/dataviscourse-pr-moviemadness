# Movie Madness
> Final project for CS 5630, Visualization for Data Science. A comprehensive and interactive visualization using data from [The Movie Database - TMDB](https://www.themoviedb.org/?language=en-US)  

> See Website [Here](https://ethramos22.github.io/dataviscourse-pr-moviemadness/)

> See Project Screencast [Here](http://example.com)

## General Information
This data visualization consolidates and displays data about _now playing_, _popular_, and _top rated_ movies, to help users easily understand how a movie's quantitative attributes (revenue, budget, runtime, etc.) are related and how they compare to other movies.

// INSERT PICTURE OF WEBSITE HERE

The project website is hosted using GitHub pages by serving the `docs/index.html` file, which imports a number of javascript files from the `docs/js` directory - one for each data visualization component. Each js file uses the `d3.js` library to draw and manipulate the DOM.

## Features
The data visualization contains 4 distinct components:

### Movie List
The movie list displays a few data points about each movie, most notably:
- The rating circle - whose outer ring circumference and color scale to the rating value
- The revenue bar - whose rectangles scale to revenue between $1 million and $1 billion. Movies with revenue outside the range are marked with an asterik and offer more detail when hovered over.

When a row is selected, the detail card and dotplot are updated to display the selected movie.

// INSERT PICTURE OF MOVIE LIST

### Detail Card
The detail card displays more detailed information on the selected movie

// INSERT PICTURE OF DETAIL CARD

### Distribution Chart
The distribution chart shows how many movies are in each genre

//INSERT PICTURE OF CHART

### Dotplot
The dotplot plots movies given two attributes. This visualization includes:
- Customizable axis values
- Hovering over a circle displays a tooltip that contains movie name and relevant axis data
- Clicking on a circle selects it in the movie list and displays it on the detail card
- Using the brush to select a group of circles updates the movies in the list as well as the distribution chart

//INSERT PICTURE OF DOTPLOT


## Data
The dataset was retrieved from [TMDB v3](https://developers.themoviedb.org/3) using the data retrieval python script located in `docs/data/` 

### Data Format
The data consists of an array of movie object, that contain the following fields.
```json
{
        "adult": boolean,
        "backdrop_path": "string",
        "belongs_to_collection": {
            "id": integer,
            "name": "string",
            "poster_path": "string",
            "backdrop_path": "string"
        },
        "budget": integer,
        "genres": [
            {
                "id": integer,
                "name": "string"
            },
        ],
        "homepage": "string",
        "id": integer,
        "imdb_id": "string",
        "original_language": "string",
        "original_title": "string",
        "overview": "string",
        "popularity": float,
        "poster_path": "string",
        "production_companies": [
            {
                "id": integer,
                "logo_path": null,
                "name": "string",
                "origin_country": "string"
            },
        ],
        "production_countries": [
            {
                "iso_3166_1": "string",
                "name": "string"
            }
        ],
        "release_date": "string",
        "revenue": integer,
        "runtime": integer,
        "spoken_languages": [
            {
                "english_name": "string",
                "iso_639_1": "string",
                "name": "string"
            }
        ],
        "status": "string",
        "tagline": "string",
        "title": "string",
        "video": boolean,
        "vote_average": float,
        "vote_count": integer
    },
```







