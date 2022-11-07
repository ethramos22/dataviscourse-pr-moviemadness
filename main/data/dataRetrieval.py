import requests
import json
import os.path


# Popular Movies
if(not os.path.isfile("main/data/popular.json")):
    popular = requests.get('https://api.themoviedb.org/3/movie/popular/?api_key=fbdfdfb1677b79c41f66c0aa9123b210&language=en-US&page=1').json()
    popular_details = []
    for movie in popular['results']:
        movie_details = requests.get(f'https://api.themoviedb.org/3/movie/{movie["id"]}?api_key=fbdfdfb1677b79c41f66c0aa9123b210&language=en-US').json()
        popular_details.append(movie_details)

    
    popular_details = json.dumps(popular_details, indent=4)
    with open("main/data/popular.json", "w") as outfile:
        outfile.write(popular_details)

# Top Rated Movies
if(not os.path.isfile("main/data/topRated.json")):
    topRated = requests.get('https://api.themoviedb.org/3/movie/top_rated?api_key=fbdfdfb1677b79c41f66c0aa9123b210&language=en-US&page=1').json()
    topRated_details = []
    for movie in topRated['results']:
        movie_details = requests.get(f'https://api.themoviedb.org/3/movie/{movie["id"]}?api_key=fbdfdfb1677b79c41f66c0aa9123b210&language=en-US').json()
        topRated_details.append(movie_details)

    topRated_details = json.dumps(topRated_details, indent=4)
    with open("main/data/topRated.json", "w") as outfile:
        outfile.write(topRated_details)

# Now Playing Movies
if(not os.path.isfile("main/data/nowPlaying.json")):
    nowPlaying = requests.get('https://api.themoviedb.org/3/movie/now_playing?api_key=fbdfdfb1677b79c41f66c0aa9123b210&language=en-US&page=1').json()
    nowPlaying_details = []
    for movie in nowPlaying['results']:
        movie_details = requests.get(f'https://api.themoviedb.org/3/movie/{movie["id"]}?api_key=fbdfdfb1677b79c41f66c0aa9123b210&language=en-US').json()
        nowPlaying_details.append(movie_details)

    nowPlaying_details = json.dumps(nowPlaying_details, indent=4)
    with open("main/data/nowPlaying.json", "w") as outfile:
        outfile.write(nowPlaying_details)






