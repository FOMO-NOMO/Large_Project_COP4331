import requests
import json

api_url = "https://knightconnect.campuslabs.com/engage/api/discovery/event/search?endsAfter=2025-10-09T15%3A45%3A05-04%3A00&orderByField=endsOn&orderByDirection=ascending&status=Approved&take=298&query=&skip=0"
response = requests.get(api_url)
data = response.json()

with open('rso_events.json', 'w') as f:
    json.dump(data, f, indent=4)
print("Data written to rsos.json")