// Inicjalizacja mapy Leaflet
var map = L.map('map').setView([50.7, 17.9], 9);

// Dodanie warstwy OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// URL do pliku GeoJSON (zmień na swój)
var geojsonUrl = "https://raw.githubusercontent.com/promo-2/mapa_opolskie/main/OpolskieLGD.geojson";

// Definicja 10 grup gmin i ich kolorów
var grupy = {
    "Partnerstwo Borów Niemodlińskich": { gminy: ["Dąbrowa", "Komprachcice", "Niemodlin", "Prószków", "Tułowice", "Strzeleczki", "Biała", "Łambinowice"], color: "red", tel: "Tel.: (77) 460 63 51", opis: "ul. Rynek 52, 49-100 Niemodlin", link: "https://boryniemodlinskie.pl/", obrazek: "https://raw.githubusercontent.com/promo-2/mapa_opolskie/main/Partnerstwo.jpg" },

    "Stowarzyszenie Lokalna Grupa Działania „Płaskowyż Dobrej Ziemi”": { gminy: ["Baborów", "Branice", "Głubczyce", "Kietrz", "Głogówek", "Lubrza", "Prudnik"], color: "yellow",tel: "Tel.: (77) 485 43 04",  opis: "ul. Wojska Polskiego 21, 48-130 Kietrz", link: "https://plaskowyz.pl/", obrazek: "https://raw.githubusercontent.com/promo-2/mapa_opolskie/main/Plaskowyz.jpg" },

    "Stowarzyszenie „Brzesko-Oławska Wieś Historyczna”": { gminy: ["Grodków", "Lewin Brzeski", "Olszanka", "Oława", "Skarbimierz"], color: "gray", tel: "Tel.: (77) 412 90 21", opis: "Krzyżowice 72, 49-332 Olszanka", link: "https://wieshistoryczna.pl/", obrazek: "https://raw.githubusercontent.com/promo-2/mapa_opolskie/main/BOWH.jpg" },

    "Stowarzyszenie Lokalna Grupa Działania „Dolina Stobrawy”": { gminy: ["Byczyna", "Kluczbork", "Lasowice Wielkie", "Wołczyn", "Olesno", "Pokój"], color: "pink", tel: "Tel.: (77) 413 11 38", opis: "ul. Moniuszki 4, 46-200 Kluczbork", link: "https://dolinastobrawy.pl/", obrazek: "https://raw.githubusercontent.com/promo-2/mapa_opolskie/main/Dolina.jpg" },

    "Stowarzyszenie Nyskie Księstwo Jezior i Gór": { gminy: ["Głuchołazy", "Kamiennik", "Korfantów", "Nysa", "Otmuchów", "Paczków", "Pakosławice", "Skoroszyce"], color: "seagreen", opis: "ul. Bracka 7, 48-300 Nysa", link: "https://ksiestwo.nysa.pl/", obrazek: "https://raw.githubusercontent.com/promo-2/mapa_opolskie/main/Nyskie.jpg", tel: "Tel.: (77) 433 55 99" },

    "Lokalna Grupa Działania „Górna Prosna”": { gminy: ["Gorzów Śląski", "Praszka", "Rudniki", "Radłów"], color: "sienna", opis: "ul. Oleska 5, 46-331 Radłów", link: "https://gornaprosna.pl/", obrazek: "https://raw.githubusercontent.com/promo-2/mapa_opolskie/main/GornaProsna.jpg", tel: "Tel.: (34) 354 53 02" },

    "Stowarzyszenie Lokalna Grupa Działania Stobrawski Zielony Szlak": { gminy: ["Dobrzeń Wielki", "Popielów", "Murów", "Łubniany", "Lubsza", "Domaszowice", "Namysłów", "Świerczów"], color: "lightgreen", opis: "ul. Kościelna 5, 46-081 Dobrzeń Wielki", link: "https://stobrawskiszlak.pl/536/lokalna-grupa-dzialania-stobrawski-zielony-szlak.html", obrazek: "https://raw.githubusercontent.com/promo-2/mapa_opolskie/main/Stobrawski.jpg", tel: "Tel.: 667 983 637" },

    "Stowarzyszenie Kraina św. Anny": { gminy: ["Gogolin", "Krapkowice", "Zdzieszowice", "Walce", "Tarnów Opolski", "Izbicko", "Jemielnica", "Leśnica", "Strzelce Opolskie", "Ujazd"], color: "darkorange", opis: "ul. Kilińskiego 1, 47-303 Krapkowice", link: "https://annaland.pl/14/kraina-sw-anny-home.html", obrazek: "https://raw.githubusercontent.com/promo-2/mapa_opolskie/main/Anna.jpg", tel: "Tel.: (77) 446 71 30; (77) 446 71 31" },

    "Stowarzyszenie Lokalna Grupa Działania „Kraina Dinozaurów”": { gminy: ["Chrząstowice", "Dobrodzień", "Kolonowskie", "Ozimek", "Turawa", "Zawadzkie", "Zębowice"], color: "skyblue", opis: "ul. J. Słowackiego 18, 46-040 Ozimek", link: "https://krainadinozaurow.pl/7/strona-glowna.html", obrazek: "https://raw.githubusercontent.com/promo-2/mapa_opolskie/main/Dino.jpg", tel: "Tel.: (77) 465 12 13" },

    "Stowarzyszenie „Euro-Country”": { gminy: ["Bierawa", "Cisek", "Pawłowiczki", "Polska Cerekiew", "Reńska Wieś"], color: "purple", opis: "ul. Karola Miarki 2, 47-260 Polska Cerekiew", link: "https://www.euro-country.pl/", obrazek: "https://raw.githubusercontent.com/promo-2/mapa_opolskie/main/euro.jpg", tel: "(77) 887 30 27" },

    "Gmina nie przynależy do żadnej ": { gminy: ["Opole", "Brzeg", "Wilków", "Kędzierzyn-Koźle"], color: "white", opis: "opolskiej Lokalnej Grupy Działania", link: " ", obrazek: " ", tel: " " }
};

// Pobranie pliku GeoJSON
fetch(geojsonUrl)
    .then(response => response.json())
    .then(data => {
        console.log("Wczytane dane GeoJSON:", data);

        // Iteracja po grupach i dodanie ich do mapy
        Object.keys(grupy).forEach(grupa => {
            var kolor = grupy[grupa].color;
            var gminy = grupy[grupa].gminy;
            var opis = grupy[grupa].opis;
            var tel = grupy[grupa].tel;
            var link = grupy[grupa].link;
            var obrazek = grupy[grupa].obrazek;

            var features = data.features.filter(feature =>
                feature.properties && gminy.includes(feature.properties.nazwaGM)
            );

            console.log(`Grupa ${grupa}:`, features.map(f => f.properties.nazwaGM));

            // Stylizacja poligonów
            function style(feature) {
                return {
                    color: "black",
                    weight: 1,
                    fillColor: kolor,
                    fillOpacity: 0.5
                };
            }

            // Flaga sprawdzająca, czy poligon został kliknięty
            var clicked = false;

            // Obsługa zdarzeń na poligonach
            function onEachFeature(feature, layer) {
                // Tworzenie popupContent z unikalnymi informacjami dla całej grupy ++++++++++++++++++++++++

var popupContent = `
    <div style="text-align: left;">
        <b style="font-size: 12px;">${grupa}</b><br>
        ${opis}<br>
        ${tel}<p>
        <a href="${link}" target="_blank" style="color: blue; text-decoration: none;">
            
       
        <img src="${obrazek}" alt="Obraz" 
             style="width: 200px; height: auto; border-radius: 1px; cursor: pointer;"
             onclick="window.open('${link}', '_blank')"
             onerror="this.onerror=null; this.src='https://raw.githubusercontent.com/promo-2/mapa_opolskie/main/opolskie_uproszczone.jpg';">
    </div>
`;



                // Obsługa kliknięcia - wyświetlanie popupa
                layer.on('click', function () {
                    // Ustawiamy flagę, że poligon został kliknięty
                    clicked = true;
                    // Dodanie popupa, który pozostanie otwarty do momentu zamknięcia przez użytkownika
                    layer.bindPopup(popupContent).openPopup();
                });

                // Wyświetlanie popupa po najechaniu myszką tylko w przypadku, gdy poligon nie został kliknięty
                layer.on('mouseover', function (e) {
                    if (!clicked) {
                        var popup = L.popup()
                            .setLatLng(e.latlng)
                            .setContent(`Gmina ${feature.properties.nazwaGM}`)
                            .openOn(map);
                        // Zmieniamy kolor na biały przy najechaniu
                        this.setStyle({ fillColor: "white" });
                    }
                });

                // Przywrócenie koloru po opuszczeniu myszką
                layer.on('mouseout', function () {
                    if (!clicked) {
                        // Przywracamy oryginalny kolor
                        this.setStyle({ fillColor: kolor });
                        // Usuwamy popup po opuszczeniu myszką (jeśli jest)
                        map.closePopup();
                    }
                });

                // Obsługa zamknięcia popupa
                layer.on('popupclose', function () {
                    // Po zamknięciu popupa, resetujemy stan flagi i kolor
                    clicked = false;
                    this.setStyle({ fillColor: kolor });
                });
            }

            // Dodanie warstwy GeoJSON do mapy
            L.geoJSON({ "type": "FeatureCollection", "features": features }, {
                style: style,
                onEachFeature: onEachFeature
            }).addTo(map);
        });
    })
    .catch(error => console.error("Błąd wczytywania GeoJSON:", error));
