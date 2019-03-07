import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      info: '',
      aqius: '',
      cityInput: '',
      stateInput: '',
      states: ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming'],
      cities: [],
    }

    this.handleCityChange = this.handleCityChange.bind(this)
    this.handleStateChange = this.handleStateChange.bind(this)
    this.getData = this.getData.bind(this)
  }

  handleCityChange(event) {
    this.setState({
      cityInput: event.target.value,
    })
  }

  handleStateChange(event) {
    this.setState({
      stateInput: event.target.value,
    }, async function() {
      if (!this.state.states.includes(this.state.stateInput)) { 
        this.setState({
          cities: [],
        })
        return false; 
      }
  
      const res = await fetch(`https://api.airvisual.com/v2/cities?state=${this.state.stateInput}&country=USA&key=CPaiW6P6xGxFyrP3D`)
  
      const data = await res.json()
  
  
      if (data.status === 'success') {
  
        let Arr = [];
        
        for (let i of data.data) {
          Arr.push(i.city)
        }
  
        this.setState({
          cities: Arr
        })
      }
    }.bind(this))
    
  
  }



  async getData() {


    if (!this.state.cityInput || !this.state.stateInput) {
      return false;
    }

    else if (!this.state.states.includes(this.state.stateInput)) {
      this.setState({
        info: 'State is not valid'
      })

      return false;
    }

    this.setState({info: ''})
    this.forceUpdate()

    const res = await fetch(`https://api.airvisual.com/v2/city?city=${this.state.cityInput}&state=${this.state.stateInput}&country=USA&key=CPaiW6P6xGxFyrP3D`)

    const data = await res.json()

    if (!data.data.current) {
      this.setState({
        info: 'Sorry, either the info you inputted was incorrect or the city is not supported'
      })

      return false;
    }

    const aqius = data.data.current.pollution.aqius;

    this.setState({
      info: `The aqius of ${data.data.city} is ${aqius}`,
      aqius: aqius
    })
  }

  

  render() {
    return (
      <div className="container">
          <p>
          Get the air quality of any city in the US
          </p>

          <div className="row">

            <input list="states" onChange={this.handleStateChange} placeholder="State"/>
            <datalist id="states">
              {this.state.states.map((state, index) => {
                return(
                  <option value={state} key={index}/>
                )
              })}
            </datalist>
          </div>

          <div className="row">
            <input list="cities" onChange={this.handleCityChange} placeholder="City"/>
            <datalist id="cities">
            {this.state.cities.map((city, index) => {
                return(
                  <option value={city} key={index}/>
                )
              })}
            </datalist>
          </div>

          <button onClick={this.getData}>Get Info</button>

          {() => {
            if (this.state.info) {
              return (<div className="results">{this.state.info}</div>)
            }
          }}
      </div>
    );
  }
}

export default App;