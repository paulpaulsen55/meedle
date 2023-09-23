const food = new Map([
    ["Essen und Trinken", "food_and_drinks"],
    ["Essen", "food"],
    ["Restaurant", "restaurant"],
    ["Fast Food", "fast_food"],
    ["Café", "cafe"],
    ["Bubble Tea", "bubble_tea"],
    ["Eisdiele", "ice_cream"],
    ["Bar", "bar"],
    ["Pub", "pub"],
    ["Club", "nightlife"],
    ["Karaoke Bar", "karaoke_bar"],
    ["Biergarten", "biergarten"]
]);

const activities = new Map([
    ["Touristenattraktion", "tourist_attraction"],
    ["Spielplatz", "playground"],
    ["Garten", "garden"],
    ["Monument", "monument"],
    ["Zoo", "zoo"],
    ["Aquarium", "aquarium"],
    ["Park", "park"],
    ["See", "lake"],
    ["Berg", "mountain"],
    ["Veranstaltungsfläche", "event_space"],
    ["Vergnügungspark", "theme_park_attraction"],
    ["Kino", "cinema"],
    ["Arkade", "arcade"],
    ["Museum", "museum"],
    ["Unterhaltung", "entertainment"],
    ["Musikveranstaltungen", "music_venue"]
]);

const sports = new Map([
    ["Schwimmbad", "swimming_pool"],
    ["Sportplatz", "field"],
    ["Basketball", "basketball_court"],
    ["Fussballplatz", "soccer_field"],
    ["Minigolf", "miniature_golf"],
    ["Go-Kart", "go_kart_racing"],
    ["Billard", "billiards"],
    ["Bowling", "bowling_alley"],
    ["Laser-Tag", "laser_tag"]
]);

const shopping = new Map([
    ["Einkaufen", "shopping"], 
    ["Einkaufszentrum", "shopping_mall"],
    ["Schuhladen", "shoe_store"],
    ["Kosmetik", "beauty_store"],
    ["Kleidung", "clothing_store"],
    ["Gebrauchtwarenladen", "thrift_shop"],
    ["Musikladen", "music_shop"],
    ["Buchhandlung", "book_store"],
    ["Sportgeschäft", "sports_shop"],
    ["Möbelgeschäft", "furniture_store"],
    ["Baumarkt", "hardware_store"],
    ["Geldautomat", "atm"]
]);

export const filters = {
    Essen: food, 
    Freizeit: activities,
    Sport: sports, 
    Einkaufen: shopping
};