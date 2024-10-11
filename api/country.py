class Country:
    """
    Visited/want to visit country information

    @type name: string
    @param name: Name of country

    @type visited: boolean
    @param visited: Symbolizes whether the country was already visited by user (True: visited, False: not visited)

    @type wanted: boolean
    param wanted: Symbolizes whether user wants to visit the country (True: wants to visit, False: does not want to visit)
    """

    def __init__(self, name, visited, wanted, code):
        self.name = name
        self.wanted = wanted
        self.visited = visited
        self.code = code

