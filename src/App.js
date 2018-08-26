import React, { Component } from 'react';
import './map.css';
import * as mapAPIs from './mapAPIs.js'


class App extends Component {
  state = {
    rawLocations:[],
    locations:[],
    markers:[]

  }

renderMap(){
  loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBoHaelOvjdG2OCpBs-sBLxzKeDrHKZ_xQ&callback=initMap")
  window.initMap = this.initMap
}

componentWillMount(){
  let locations;
  mapAPIs.getAll()
    .then(res => this.setState({rawLocations:res}))
    .then(res => locations = this.state.rawLocations.map(obj => ({
      name:obj.name,
      location:{
        lat:obj.location.lat,
        lng:obj.location.lng
      }
    })))
    .then(res => this.setState({locations}))
    .then(res => this.renderMap())
    .catch(res => console.log('Error :',res))
    
}



initMap = ()=>{
console.log( 'loca',this.state.locations);
    const map = new window.google.maps.Map(document.getElementById('map'), {
      
      center: {lat: 40.7243, lng: -74.0018},
      zoom: 14
    });

    let infowindow = new window.google.maps.InfoWindow()
        this.state.locations.map((coffee) => {
            const position = coffee.location
            // Create Markers
            let marker = new window.google.maps.Marker({
                position,
                map,
                animation: window.google.maps.Animation.DROP,
                title: coffee.name
            })

            // Add each created marker to the 'markers' array
            this.state.markers.push(marker)

            // Display the InfoWindow after clicking on the Marker
            marker.addListener('click', function() {
              infowindow.setContent(`<h1>${coffee.name}</h1>`)
              infowindow.open(map, marker)
                if (marker.getAnimation() !== null) {
                    marker.setAnimation(null);
                } else {
                    marker.setAnimation(window.google.maps.Animation.BOUNCE);
                }
            })
        })
}




  render() {
    console.log('raw',this.state.rawLocations);
    console.log(this.state.locations);
    return (
      <div className="App">
        <div id="map"></div>
      </div>

    );
  }
}

export default App;


function loadScript(url) {
  var index  = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}