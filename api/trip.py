import json

class Trip:
    """
    Trip encapsulation class
    """

    def __init__(self, name, from_date, until_date, budget, description, subtrips=[], photos=[], advantages=[], disadvantages=[]):
        self.name = name
        self.from_date = from_date
        self.until_date = until_date
        self.budget = budget
        self.description = description
        self.subtrips = subtrips
        self.photos = photos
        self.advantages = advantages
        self.disadvantages = disadvantages

    def to_json(self):
        return json.dumps(self.__dict__, indent=4, sort_keys=True, default=str)

class Subtrip:
    
    def __init__(self, name, description, gps, favourite, photos=[]):
        self.name = name
        self.description = description
        self.gps = gps
        self.favourite = favourite
        self.photos = photos

