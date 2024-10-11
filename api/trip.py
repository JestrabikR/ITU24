import json
import uuid

class Trip:
    """
    Trip data class

    @type name: string
    @param name: Name of the trip

    @type from_date: datetime.date
    @param datetime.date from_date: Start date of the trip

    @type until_date: datetime.date
    @param until_date: End date of the trip

    @type budget: float
    @param budget: Either budget for future trip or cost of past trip

    @type description: str
    @param description: Description/notes for the trip

    @type subtrips: list.<Subtrip>
    @param substrips: Subtrips of the trip

    @type photos: list.<Photo>
    @param photos: Photos of the trip, encoded in base64

    @type advantages: list.<string>
    @param advantages

    @type disadvantages: list.<string>
    @param disadvantages

    @type id: string
    @param id: UUID4-type identifer [id=None]
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
        """
        Returns instance as JSON object
        """

        #! Let's keep it in english
        # Vytvoříme kopii slovníku atributů objektu
        trip_dict = self.__dict__.copy()

        # Nahradíme subtrips slovníky každého subtripu
        trip_dict["subtrips"] = [subtrip.__dict__ for subtrip in self.subtrips]

        return trip_dict


class Subtrip:
    """
    Subtrip data class.

    @type name: string
    @param name: Name of the subtrip

    @type description: string
    @param description: Description/notes for the subtrip

    @type gps: !TBD
    @param gps: GPS information for one location

    @type favourite: boolean
    @param favourite: Marked as favourite

    @type photos: list.<Photo>
    @param photos: List of photos from the subtrip
    """
    
    def __init__(self, name, description, gps, favourite, photos=[]):
        self.name = name
        self.description = description
        self.gps = gps
        self.favourite = favourite
        self.photos = photos

