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
import KSWO_UG from './images/KSWO 03 KSWO_UG.svg';
import maptilerlogo from './images/maptiler-logo-icon-color.svg';


//
// BASE MAP
//
const view = new View({
  center: fromLonLat([8.2697343, 47.3558335]),
  zoom: 18,
  maxZoom: 22
  //extent: []
})

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
  view: view,
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

    // Search input
    const searchInput = document.createElement('input');
    searchInput.id = 'search-input';
    searchInput.name = 'search';
    searchInput.placeholder = 'Suche...';
    searchInput.enterKeyHint = 'search';
    searchInput.autocomplete = 'off';
    searchInput.spellcheck = false;
    searchInput.autocorrect = 'off';
    searchInput.inputMode = 'text';
    searchInput.autofocus = false;
    container.appendChild(searchInput);

    // Clear button
    const clearButton = document.createElement('button');
    clearButton.id = 'clear-button';
    clearButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    clearButton.title = 'Clear search';
    clearButton.type = 'button';
    container.appendChild(clearButton);

    // Search proposals div
    const searchProposalsdiv = document.createElement('div');
    searchProposalsdiv.className = 'search-proposals';
    container.appendChild(searchProposalsdiv);

    // Add the vector layer to the map
    map.addLayer(roomLayer);

    // FUNCTIONS
    // TODO
    // Function for search proposals
    const fetchProposals = () => {
      const searchValue = searchInput.value.toUpperCase();
      if (searchValue) {
        fetch(`/api/rooms/search/${searchValue}`)
          .then(response => response.json())
          .then(proposals => {
            // TODO: NEEDS FIXING!!!!!!!!
            console.log(proposals);
            searchProposalsdiv.innerHTML = ''; // Clear the search proposals

            if (proposals.length === 0) {
              searchProposalsdiv.style.display = 'none'; // Hide box if no proposals
              return;
            }

            searchProposalsdiv.style.display = 'block'; // Show box if proposals

            // TODO: NEEDS FIXING!!!!!!!!
            proposals.forEach(proposal => {
              const item = document.createElement('div');
              item.className = 'proposal-item';
              item.textContent = proposal.name; // Display the room name
              item.addEventListener('click', () => {
                searchInput.value = proposal.name; // Set search input value
                searchProposalsdiv.style.display = 'none'; // Hide suggestions
                idSearch(proposal.id); // Handle the search
              });
              searchProposalsdiv.appendChild(item);
            });
          })
          .catch(error => {
            console.error('Error fetching search proposals:', error);
          });
      }
    };
    const idSearch = (id) => {
      fetch(`/api/rooms/${id}`)
        .then(response => response.json())
        .then(room => {
          if (room.geom) {
            const floor = room.floor;
            if (floor) {
              overlayControl.levelChangeHandler(floor + 1);
            }
          }
          highlightRoom(room); // Highlight the room
        });
    };

    // TODO: Cleanups
    // Function to handle search
    const handleSearch = () => {
      const searchValue = searchInput.value.toUpperCase();
      if (searchValue) {
        fetch(`/api/rooms/${searchValue}`)
          .then(response => response.json())
          .then(rooms => {
            if (rooms.length === 1) {
              const room = rooms[0];
              if (room.geom) {
                const coordinates = JSON.parse(rooms[0].geom).coordinates;
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
                highlightRoom(room); // Highlicht the room

              } else {
                alert(`Room "${searchValue}" not found.`);
              }
            } else if (rooms.length > 1) {
              const floor = rooms[0].floor;
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
              const roomsFiltered = rooms.filter(room => room.floor === floor);
              if (JSON.stringify(roomsFiltered) !== JSON.stringify(rooms)) {
                alert('Rooms are on different floors. Showing rooms on Floor ' + floor);
              }
              highlightRooms(roomsFiltered); // Highlight multiple rooms
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

    // Eventlisteners
    searchInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default action
        searchInput.blur(); // Remove focus from the input field
        handleSearch();
      }
    });
    searchInput.addEventListener('focusin', () => {
      roomSource.clear(); // Clear any existing room highlights
      roomOverlay.setPosition(undefined); // Clear the room overlay
      if (searchInput.value) {
        searchProposalsdiv.style.display = 'block'; // Show search proposals
      }
    });
    searchInput.addEventListener('blur', () => {
      setTimeout(() => {
        searchProposalsdiv.style.display = 'none'; // Hide search proposals
      }, 300);
      
    });
    searchInput.addEventListener('input', () => {
      clearButton.style.display = searchInput.value ? 'block' : 'none';
    });
    clearButton.addEventListener('mousedown', (event) => {
      event.preventDefault(); // Prevent the default action
    });
    clearButton.addEventListener('click', () => {
      searchInput.value = '';
      clearButton.style.display = 'none';
      searchInput.focus(); // Focus on the input field
      searchProposalsdiv.style.display = 'none'; // Hide search proposals
    });
    
    // Search proposals
    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      if (searchInput.value.length === 0) {
        console.log('Search input empty.');
        searchProposalsdiv.style.display = 'none';
        return;
      }

      debounceTimer = setTimeout(() => {
        fetchProposals();
      }, 300); // Delay by 300ms
    });

    super({
      element: container
    });
  }
}
const searchControl = new SearchControl(overlayControl);
map.addControl(searchControl);



//
// Room Events
//


//
// On Map Click Event
map.on('click', function (event) {
  const searchInput = document.getElementById('search-input');
  if (document.activeElement === searchInput) {
    searchInput.blur(); // Remove focus from the input 
    return;
  }

  const clickCoord = toLonLat(event.coordinate);
  console.log('Click coordinates:', clickCoord);
  const [lon, lat] = clickCoord;

  const currentFloor = overlayControl.getVisibleOverlay() - 1;

  // Fetch the nearest room
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


//
// Room Overlay
const roomOverlayElement = document.createElement('div');
roomOverlayElement.id = 'room-overlay';
roomOverlayElement.style.pointerEvents = 'none';
const roomOverlayHeader = document.createElement('h3');
roomOverlayHeader.className = 'room-overlay-header';
roomOverlayElement.appendChild(roomOverlayHeader);
const roomOverlayType = document.createElement('p');
roomOverlayType.className = 'room-overlay-type';
roomOverlayElement.appendChild(roomOverlayType);
const roomOverlayTeacher = document.createElement('p');
roomOverlayTeacher.className = 'room-overlay-teacher';
roomOverlayElement.appendChild(roomOverlayTeacher);

document.body.appendChild(roomOverlayElement);

const roomOverlay = new Overlay({
  element: document.getElementById('room-overlay'),
  positioning: 'top-center',
  offset: [-125, 10],
})
map.addOverlay(roomOverlay);


// Highlight one room
function highlightRoom(room) {
  const roomCoordinates = JSON.parse(room.geom).coordinates;

  // Clear any existing room highlights
  roomSource.clear();

  // Create a new feature for the room
  const feature = new Feature({
    geometry: new Point(fromLonLat(roomCoordinates)),
    name: room.name,
    type: room.type,
    teacher: room.teacher,
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
  

  // Center the map on the room
  view.animate({
    center: fromLonLat(roomCoordinates),
    duration: 800,
    zoom: 20,
  },
  () => { // After the animation
    roomOverlayHeader.innerHTML = room.name;
    roomOverlayType.innerHTML = room.type;
    roomOverlayTeacher.innerHTML = '';
    if (room.teacher) {
      roomOverlayTeacher.innerHTML = 'Lehrer:';
      const roomOverlayTeacherList = document.createElement('ul');
      roomOverlayTeacher.appendChild(roomOverlayTeacherList);
      room.teacher.forEach(element => {
        roomOverlayTeacherList.innerHTML += `<li>${element}</li>`;
      });
    }
    // Set the overlay position
    roomOverlay.setPosition(fromLonLat(roomCoordinates));
  });

}

// Highlight multiple rooms
function highlightRooms(rooms) {
  // Clear any existing room highlights
  roomSource.clear();
  
  // Clear the room overlay
  roomOverlay.setPosition(undefined);

  // Create a new feature for each room
  rooms.forEach(room => {
    const roomCoordinates = JSON.parse(room.geom).coordinates;
    const feature = new Feature({
      geometry: new Point(fromLonLat(roomCoordinates)),
      name: room.name,
      type: room.type,
      teacher: room.teacher,
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

    // Animate the map center on school
    view.animate({
      center: fromLonLat([8.2697343, 47.3558335]),
      zoom: 18,
      duration: 800,
    })
  });
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
