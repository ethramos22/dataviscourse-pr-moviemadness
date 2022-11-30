import requests
import json
import os.path


# Popular Movies
if(not os.path.isfile("docs/data/popular.json")):
    popular = []
    for page in range(1, 4):
        response = requests.get(f'https://api.themoviedb.org/3/movie/popular/?api_key=fbdfdfb1677b79c41f66c0aa9123b210&language=en-US&page={page}').json()
        for movie in response['results']:
            popular.append(movie)
    popular_details = []
    for idx, movie in enumerate(popular):
        print(f'Fetching data for #{idx} out of {len(popular)} popular movies')
        movie_details = requests.get(f'https://api.themoviedb.org/3/movie/{movie["id"]}?api_key=fbdfdfb1677b79c41f66c0aa9123b210&language=en-US').json()
        popular_details.append(movie_details)

    
    popular_details = json.dumps(popular_details, indent=4)
    with open("docs/data/popular.json", "w") as outfile:
        outfile.write(popular_details)

# Top Rated Movies
if(not os.path.isfile("docs/data/topRated.json")):
    topRated = []
    for page in range(1,4):
        response = requests.get(f'https://api.themoviedb.org/3/movie/top_rated?api_key=fbdfdfb1677b79c41f66c0aa9123b210&language=en-US&page={page}').json()
        for movie in response['results']:
            topRated.append(movie)
    topRated_details = []
    for idx, movie in enumerate(topRated):
        print(f'Fetching data for #{idx} out of {len(topRated)} top rated movies')
        movie_details = requests.get(f'https://api.themoviedb.org/3/movie/{movie["id"]}?api_key=fbdfdfb1677b79c41f66c0aa9123b210&language=en-US').json()
        topRated_details.append(movie_details)

    topRated_details = json.dumps(topRated_details, indent=4)
    with open("docs/data/topRated.json", "w") as outfile:
        outfile.write(topRated_details)

# Now Playing Movies
if(not os.path.isfile("docs/data/nowPlaying.json")):
    nowPlaying = []
    for page in range(1,4):
        response = requests.get(f'https://api.themoviedb.org/3/movie/now_playing?api_key=fbdfdfb1677b79c41f66c0aa9123b210&language=en-US&page={page}').json()
        for movie in response['results']:
            nowPlaying.append(movie)
    nowPlaying_details = []
    for idx, movie in enumerate(nowPlaying):
        print(f'Fetching data for #{idx} out of {len(nowPlaying)} now playign movies')
        movie_details = requests.get(f'https://api.themoviedb.org/3/movie/{movie["id"]}?api_key=fbdfdfb1677b79c41f66c0aa9123b210&language=en-US').json()
        nowPlaying_details.append(movie_details)

    nowPlaying_details = json.dumps(nowPlaying_details, indent=4)
    with open("docs/data/nowPlaying.json", "w") as outfile:
        outfile.write(nowPlaying_details)






