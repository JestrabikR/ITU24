import json
import uuid

class Trip:
    """
    Trip encapsulation class
    """

    def __init__(self, name, from_date, until_date, budget, description, subtrips=[], photos=[], advantages=[], disadvantages=[], id=None):
        self.id = uuid.uuid4() if id is None else id
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
        # Vytvoříme kopii slovníku atributů objektu
        trip_dict = self.__dict__.copy()

        # Nahradíme subtrips slovníky každého subtripu
        trip_dict["subtrips"] = [subtrip.__dict__ for subtrip in self.subtrips]

        return trip_dict


class Subtrip:
    
    def __init__(self, name, description, gps, favourite, photos=[]):
        self.name = name
        self.description = description
        self.gps = gps
        self.favourite = favourite
        self.photos = photos

