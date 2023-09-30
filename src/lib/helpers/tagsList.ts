const food = new Map([
	['food_and_drink', 'Essen und Trinken' ],
	['food', 'Essen' ],
	['restaurant', 'Restaurant' ],
	['fast_food', 'Fast Food' ],
	['cafe', 'Café'],
	['bubble_tea', 'Bubble Tea'],
	['ice_cream', 'Eisdiele'],
	['bar', 'Bar'],
	['pub', 'Pub'],
	['nightlife', 'Club'],
	['karaoke_bar', 'Karaoke Bar'],
	['biergarten', 'Biergarten']
	
]);

const activities = new Map([
	["tourist_attraction", "Touristenattraktion"],
	["playground", "Spielplatz"],
	["garden", "Garten"],
	["monument", "Monument"],
	["zoo", "Zoo"],
	["aquarium", "Aquarium"],
	["park", "Park"],
	["lake", "See"],
	["mountain", "Berg"],
	["event_space", "Veranstaltungsfläche"],
	["theme_park_attraction", "Vergnügungspark"],
	["cinema", "Kino"],
	["arcade", "Arkade"],
	["museum", "Museum"],
	["entertainment", "Unterhaltung"],
	["music_venue", "Musikveranstaltungen"]
]);

const sports = new Map([
	["swimming_pool", "Schwimmbad"],
	["field", "Sportplatz"],
	["basketball_court", "Basketball"],
	["soccer_field", "Fussballplatz"],
	["miniature_golf", "Minigolf"],
	["go_kart_racing", "Go-Kart"],
	["billiards", "Billard"],
	["bowling_alley", "Bowling"],
	["laser_tag", "Laser-Tag"]
]);

const shopping = new Map([
	["shopping", "Einkaufen"],
	["shopping_mall", "Einkaufszentrum"],
	["shoe_store", "Schuhladen"],
	["beauty_store", "Kosmetik"],
	["clothing_store", "Kleidung"],
	["thrift_shop", "Gebrauchtwarenladen"],
	["music_shop", "Musikladen"],
	["book_store", "Buchhandlung"],
	["sports_shop", "Sportgeschäft"],
	["furniture_store", "Möbelgeschäft"],
	["hardware_store", "Baumarkt"],
	["atm", "Geldautomat"]
]);

export const tagsList = {
	Essen: food,
	Freizeit: activities,
	Sport: sports,
	Einkaufen: shopping
};
