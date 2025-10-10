import requests
import json

api_url = "https://knightconnect.campuslabs.com/engage/api/discovery/search/organizations?orderBy%5B0%5D=UpperName%20asc&top=722&filter=&query=&skip=0"
response = requests.get(api_url)
data = response.json()

with open('rsos.json', 'w') as f:
    json.dump(data, f, indent=4)
print("Data written to rsos.json")