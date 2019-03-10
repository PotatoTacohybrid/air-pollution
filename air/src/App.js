import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      info: '',
      aqius: '',
      cityInput: '',
      stateInput: '',
      states: ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'],
      cities: [],
    };

    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.getData = this.getData.bind(this);
    this.renderResults = this.renderResults.bind(this);
  }

  handleCityChange(event) {
    this.setState({
      cityInput: event.target.value,
    });
  };

  handleStateChange(event) {
    this.setState({
      stateInput: event.target.value,
    }, async function() {
      if (!this.state.states.includes(this.state.stateInput)) { 
        this.setState({
          cities: [],
        });
        return false; 
      };
  
      const res = await fetch(`https://api.airvisual.com/v2/cities?state=${this.state.stateInput}&country=USA&key=CPaiW6P6xGxFyrP3D`);
  
      const data = await res.json();
  
  
      if (data.status === 'success') {
  
        let Arr = [];
        
        for (let i of data.data) {
          Arr.push(i.city)
        };
  
        this.setState({
          cities: Arr
        });
      };
    }.bind(this));
    
  
  };



  async getData() {


    if (!this.state.cityInput || !this.state.stateInput) {
      this.setState({
        aqius: ''
      });
      return false;
    }

    else if (!this.state.states.includes(this.state.stateInput)) {
      this.setState({
        info: 'State is not valid',
        aqius: ''
      });

      return false;
    };

    this.setState({info: ''});
    this.forceUpdate();

    const res = await fetch(`https://api.airvisual.com/v2/city?city=${this.state.cityInput}&state=${this.state.stateInput}&country=USA&key=CPaiW6P6xGxFyrP3D`);

    const data = await res.json();

    if (!data.data.current) {
      this.setState({
        info: 'Either the info was incorrect or the city is not supported'
      });

      return false;
    }

    const aqius = data.data.current.pollution.aqius;

    this.setState({
      info: `The aqius of ${data.data.city} is ${aqius}`,
      stateInput: '',
      cityInput: '',
      aqius: aqius
    });
  };

  renderResults(data) {

    let extraClass;

    const aqius = this.state.aqius;

    if (aqius !== '') {
      if (aqius <= 50) { extraClass = 'green'; }
      else if (aqius <= 100) { extraClass = 'yellow'; }
      else if (aqius < 150) { extraClass = 'orange'; }
      else { extraClass = 'red'; }
    }

 


    if (data) {
      return (
        <div className="results"><span className={extraClass}>{data}</span></div>
      )
    }
  }


  render() {
    return (
      <div className="container">
          <p>
          Get the air quality of any city in the US
          </p>

          <div className="row">

            <input list="states" value={this.state.stateInput} onChange={this.handleStateChange} placeholder="State"/>
            <datalist id="states">
              {this.state.states.map((state, index) => {
                return(
                  <option value={state} key={index}/>
                )
              })}
            </datalist>
          </div>

          <div className="row">
            <input list="cities" value={this.state.cityInput} onChange={this.handleCityChange} placeholder="City"/>
            <datalist id="cities">
            {this.state.cities.map((city, index) => {
                return(
                  <option value={city} key={index}/>
                )
              })}
            </datalist>
          </div>

          <button onClick={this.getData}>Get Info</button>

          {this.renderResults(this.state.info)}
      </div>
    );
  }
}

export default App;