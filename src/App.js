import React, { Component } from 'react';
import './map.css';
import * as mapAPIs from './mapAPIs.js'
import {DebounceInput} from 'react-debounce-input';

class App extends Component {
  state = {
    rawLocations:[],
    locations:[],
    markers:[],
    query:''

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
      address:obj.location.formattedAddress.toString(),
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

    const map = new window.google.maps.Map(document.getElementById('map'), {
      
      center: {lat:27.279717, lng:33.821343},
      zoom: 16
    });

    let infowindow = new window.google.maps.InfoWindow()
    let bounds = new window.google.maps.LatLngBounds();
        this.state.locations.map((hotel) => {
            const position = hotel.location
            let myLatLng = new window.google.maps.LatLng(position.lat, position.lng)
            // Create Markers
            let marker = new window.google.maps.Marker({
                position,
                map,
                animation: window.google.maps.Animation.DROP,
                title: hotel.name,
                address:hotel.address
            })
            bounds.extend(myLatLng);
            // Add each created marker to the 'markers' array
            this.state.markers.push(marker)

            // Display the InfoWindow after clicking on the Marker
            marker.addListener('click', function() {
              if (infowindow.marker !== marker) {
                infowindow.marker = marker;               
                infowindow.setContent(`
                <h3>${marker.title}</h3>
                <p><b>address:</b> ${marker.address}</p>
                `);
                infowindow.open(map, marker);
                // marker.getAnimation()?marker.setAnimation(null):marker.setAnimation(window.google.maps.Animation.BOUNCE)
                // Make sure the marker property is cleared if the infowindow is closed.
                infowindow.addListener('closeclick',function(){
                  infowindow.setMarker = null;
                });
              }

            })
        })
        map.fitBounds(bounds)
}


filterhotels = ()=>{
  // let filter;
  // filter = this.state.locations.filter(H => H.name === "Diana Hotel" )
  // this.setState({locations:filter})
  
  // console.log('after',this.state.locations);


  var promise1 = new Promise((res,rej)=>{
    let filter;
    filter = this.state.locations.filter(H => H.name === "Hotel Beirut" )
    this.setState({locations:filter})
    res('Success!')
  }).then((res)=>{
    this.initMap()
  });
}

searchQuery(query){
  this.setState({query:query})
  
}
  render() {
    const {query} = this.state
    return (
      <div className="App">
        <div id="map"></div>
        <div className="list-view">
          <h1>Hotels Guide</h1>
          <hr/>
          <div>
          <DebounceInput 
                    className='search-input'
                    minLength={3}
                    debounceTimeout={300}
                    type="text" 
                    placeholder="Search by Hotel Name"
                    value ={query}
                    onChange ={(e)=> this.searchQuery(e.target.value)}                    
                    />
          {/* <button  onClick={this.filterhotels}>click</button> */}
        </div>
      </div>
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