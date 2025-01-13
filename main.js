import './style.css';
import {Map, Overlay, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import ImageStatic from 'ol/source/ImageStatic';
import { fromLonLat, toLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import {circular} from 'ol/geom/Polygon';
import {Control, defaults as defaultControls} from 'ol/control.js';
import XYZ from 'ol/source/XYZ';
import KSWO_EG from './images/KSWO 01 KSWO_EG.svg';
import KSWO_OG from './images/KSWO 02 KSWO_OG.svg';
import KSWO_UG from './images/DSC_5757.jpg';
import maptilerlogo from './images/maptiler-logo-icon-color.svg';


//
// BASE MAP
//

const map = new Map({
  target: 'map',
  keyboardEventTarget: document,
  layers: [
    new TileLayer({
      source: new XYZ({
        url: 'https://api.maptiler.com/maps/ch-swisstopo-lbm-dark/{z}/{x}/{y}.png?key=nvq0pz6dEivNRJmSl3lD',
        //url: 'https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe.wmts/default/current/3857/{z}/{x}/{y}.png',
        crossOrigin: 'anonymous',
        attributions: '© <a href="https://www.swisstopo.admin.ch" target="_blank">swisstopo</a>  © MapTiler  © OpenStreetMap contributors'
      })
    })
  ],
  view: new View({
    center: fromLonLat([8.2697343, 47.3558335]),
    zoom: 18,
    maxZoom: 22
    //extent: []
  })
});



//
// CUSTOM LAYERS
//


// Calculating the extent of the image
const imageExtent = [920277.4603228115, 6000131.838362963, 920887.7622205259, 6000567.768289902];

// Defining custom image overlay
const customImageOverlay1 = new ImageLayer({
  source: new ImageStatic({
    url: KSWO_EG,
    imageExtent: imageExtent
  })
});

const customImageOverlay2 = new ImageLayer({
  source: new ImageStatic({
    url: KSWO_OG,
    imageExtent: imageExtent
  })
});

const customImageOverlay3 = new ImageLayer({
  source: new ImageStatic({
    url: KSWO_UG,
    imageExtent: imageExtent
  })
});
 
// adding the costum layer ontop of the base map
map.addLayer(customImageOverlay1);
map.addLayer(customImageOverlay2);
map.addLayer(customImageOverlay3);

// setting visibility
customImageOverlay2.setVisible(false);
customImageOverlay3.setVisible(false);



//
// CUSTOM CONTROLS
//


//
// Overlaycontrol
class OverlayControl extends Control {
  constructor () {
    const container = document.createElement('div');
    container.className = 'ol-control ol-unselectable overlay-control';

    const level1button = document.createElement('button');
    level1button.innerHTML = '1';
    level1button.title = '1. Obergeschoss';
    level1button.className = 'level1button';
    container.appendChild(level1button);

    const level0button = document.createElement('button');
    level0button.innerHTML = '0';
    level0button.title = 'Erdgeschoss';
    level0button.className = 'level0button';
    level0button.classList.add('active-button');
    container.appendChild(level0button);

    const levelm1button = document.createElement('button');
    levelm1button.innerHTML = '-1';
    levelm1button.title = "Untergeschoss";
    levelm1button.className = 'levelm1button';
    container.appendChild(levelm1button);

    super({
      element: container
    });

    // Button functions
    const overlays = [customImageOverlay3, customImageOverlay1, customImageOverlay2];
    const buttons = [levelm1button, level0button, level1button]

    this.getVisibleOverlay = () => { // Getting the currently visible Overlay
      for (let i = 0; i < overlays.length; i++) {
        if (overlays[i].getVisible()) {
          return i;
        }
      }
      return null;
    }

    this.levelChangeHandler = (level) => {
      // Overlay change
      const visibleOverlay = this.getVisibleOverlay();
      if (visibleOverlay !== level) {
        overlays[visibleOverlay].setVisible(false)
        overlays[level].setVisible(true);
      }

      // Button style
      buttons.forEach((button, index) => {
        if (index === level) {
          button.classList.add('active-button'); 
        } else {
          button.classList.remove('active-button');
        }

      });

      // Clear highlight and overlay
      roomSource.clear();
      roomOverlay.setPosition(undefined);
      
    }

    // Eventlisteners
    level1button.addEventListener('click', () => {this.levelChangeHandler(2);});
    level0button.addEventListener('click', () => {this.levelChangeHandler(1)});
    levelm1button.addEventListener('click', () => {this.levelChangeHandler(0)});
  }
}
const overlayControl = new OverlayControl();
map.addControl(overlayControl);

// Create a vector source and layer for the room
const roomSource = new VectorSource();
const roomLayer = new VectorLayer({
  source: roomSource,
});

//
// Searchcontrol
class SearchControl extends Control {
  constructor(overlayControl) {
    const container = document.createElement('div');
    container.className = 'ol-control ol-unselectable search-control';

    const searchInput = document.createElement('input');
    searchInput.type = 'search';
    searchInput.name = 'search';
    searchInput.placeholder = 'Suche...';
    container.appendChild(searchInput);

    const searchButton = document.createElement('button');
    searchButton.innerHTML = '<i class="fa-solid fa-search"></i>';
    container.appendChild(searchButton);

    // Add the vector layer to the map
    map.addLayer(roomLayer);

    // Function to handle search
    const handleSearch = () => {
      const searchValue = searchInput.value.toUpperCase();
      if (searchValue) {
        fetch(`/api/rooms/${searchValue}`)
          .then(response => response.json())
          .then(room => {
            if (room.geom) {
              const coordinates = JSON.parse(room.geom).coordinates;
              const floor = room.floor;
              if (floor) {
                switch (floor) {
                  case 0:
                    overlayControl.levelChangeHandler(1);
                    break;
                  case 1:
                    overlayControl.levelChangeHandler(2);
                    break;
                  case -1:
                    overlayControl.levelChangeHandler(0);
                    break;
                  default:
                    alert('Floor not found.');
                    break;
                }
              }
              map.getView().setCenter(fromLonLat(coordinates));
              map.getView().setZoom(20);
              
              roomSource.clear(); // Clear existing features
              highlightRoom(room); // Highlicht the room

            } else {
              alert(`Room "${searchValue}" not found.`);
            }
          })
          .catch(error => {
            console.error('Error searching room:', error);
            alert('Error searching room. See console for details.');
          });
      } else {
        alert('Please enter a room name.');
      }
    };

    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        handleSearch();
      }
    });

    super({
      element: container
    });
  }
}
const searchControl = new SearchControl(overlayControl);
map.addControl(searchControl);


//
// MapTiler Logo
class MapTilerLogo extends Control {
  constructor() {
    const element = document.createElement('div');
    element.className = 'maptiler-logo';

    const image = document.createElement('img');
    image.src = maptilerlogo;
    image.alt = 'MapTiler logo';
    element.appendChild(image);

    image.addEventListener('click', () => {
      window.open('https://www.maptiler.com/', '_blank');
    });

    super({
      element: element
    });
  }
}
const mapTilerLogo = new MapTilerLogo();
map.addControl(mapTilerLogo);



//
// Room Events
//


//
// On Map Click Event
map.on('click', function (event) {
  const clickCoord = toLonLat(event.coordinate);
  console.log('Click coordinates:', clickCoord);
  const [lon, lat] = clickCoord;

  const currentFloor = overlayControl.getVisibleOverlay() - 1;

  fetch(`/api/nearest-room?floor=${currentFloor}&lon=${lon}&lat=${lat}`)
    .then(response => {
      if (!response.ok){
        console.log('HTTP error:', response.status);
        roomSource.clear();
        roomOverlay.setPosition(undefined);
      } else {
        return response.json();
      }
    })
    .then(room => {
      if (room) {
        highlightRoom(room);
      } else {
        console.log('No room found.');
      }
    })
    .catch(error => {
      console.error('Error fetching nearest room:', error);
    });
});


// Room Overlay
const roomOverlayElement = document.createElement('div');
roomOverlayElement.id = 'room-overlay';
roomOverlayElement.style.position = 'absolute';
roomOverlayElement.style.backgroundColor = 'rgb(39, 39, 39)';
roomOverlayElement.style.border = '1px solid rgb(132, 132, 132)';
roomOverlayElement.style.borderRadius = '5px';
roomOverlayElement.style.padding = '0.2em';
roomOverlayElement.style.fontSize = '1.2em';
roomOverlayElement.style.color = 'white';
roomOverlayElement.style.boxShadow = '0 2px 5px rgba(132, 132, 132, 0.3)';
roomOverlayElement.style.pointerEvents = 'none';
document.body.appendChild(roomOverlayElement);

const roomOverlay = new Overlay({
  element: document.getElementById('room-overlay'),
  positioning: 'top-center',
  offset: [-30, 10],
})
map.addOverlay(roomOverlay);


// Highlight room
function highlightRoom(room) {
  const roomCoordinates = JSON.parse(room.geom).coordinates;

  // Clear any existing room highlights
  roomSource.clear();

  // Create a new feature for the room
  const feature = new Feature({
    geometry: new Point(fromLonLat(roomCoordinates)),
    name: room.name,
    type: room.type,
    metadata: room.metadata,
  });

  // Apply a highlight style
  feature.setStyle(
    new Style({
      image: new Circle({
        radius: 8,
        fill: new Fill({ color: 'yellow' }),
        stroke: new Stroke({ color: 'black', width: 2 }),
      }),
    })
  );

  // Add the feature to the vector source
  roomSource.addFeature(feature);
  
  
  roomOverlayElement.innerHTML = `
    <strong style="fontSize: 1.3em; text-decoration: underline">${room.name}</strong><br>
    ${room.type}
  `;

  // Set the overlay position
  roomOverlay.setPosition(fromLonLat(roomCoordinates));
}




//
// GPS LOCATION
//

// adding GPS location to the map
const source = new VectorSource();
const layer = new VectorLayer({
  source: source,
});
map.addLayer(layer);

navigator.geolocation.watchPosition(
  function (pos) {
    const coords = [pos.coords.longitude, pos.coords.latitude];
    const accuracy = circular(coords, pos.coords.accuracy);
    source.clear(true);
    source.addFeatures([
      new Feature(
        accuracy.transform('EPSG:4326', map.getView().getProjection()),
      ),
      new Feature(new Point(fromLonLat(coords))),
    ]);
  },
  function (error) {
    alert(`ERROR: ${error.message}`);
  },
  {
    enableHighAccuracy: true,
  },
);

// adding "center on user" option
const locate = document.createElement('div');
locate.className = 'ol-control ol-unselectable locate';
locate.innerHTML = '<button title="Locate me"><i class="fa-solid fa-location-arrow"></i></button>';
locate.addEventListener('click', function () {
  if (!source.isEmpty()) {
    map.getView().fit(source.getExtent(), {
      maxZoom: 18,
      duration: 500,
    });
  } else {
    alert(`ERROR: No Location found.`)
  }
});
map.addControl(
  new Control({
    element: locate,
  }),
);
