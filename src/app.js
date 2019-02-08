import React from "react";
import ReactDOM from "react-dom";
import Axios from 'axios'
import Url from 'domurl'

class App extends React.Component{
    constructor(props) {
        super(props);

        var url = new Url;
        this.state = {
            search : url.query.city ? url.query.city : 'Copenhagen',
            hasError : false,
            weather : {
                city: '',
                temperature : '',
                humidity : '',
                wind : {
                    deg:'',
                    speed:''
                }
            }
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleSubmit(event) {
        this.searchWeather(this.state.search);
        event.preventDefault();
    }
    handleChange(event) {        
        this.setState({ search: event.target.value, showError:false});
    }
    getDirection(degree) {
        var directions = ['North', 'North-West', 'West', 'South-West', 'South', 'South-East', 'East', 'North-East'];
        return directions[Math.round(((degree %= 360) < 0 ? degree + 360 : degree) / 45) % 8];
    }
    searchWeather(city){   
        Axios.get('https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=166d00e26d3ff2c6149e89feccc5c59a&units=metric')
        .then(response => {
            let weather = {}
            weather.city = response.data.name;
            weather.temperature = response.data.main.temp;
            weather.humidity = response.data.main.humidity;
            weather.wind = {}
            weather.wind = {
                deg : response.data.wind.deg,
                speed : response.data.wind.speed
            }
            this.setState({
                search:'',
                weather:weather,
                hasError: false                
            });
        }).catch(error=>{
            this.setState({
                hasError: true
            })
        });
        var url = new Url();
        url.query.city = city;
        history.replaceState({},"",url.toString())
    }
    componentDidMount() {
        this.searchWeather(this.state.search)
    }
    render(){
      return(
        <div className="panel panel-info">
            <div className="panel-heading">Weather in <b>{this.state.weather.city}</b></div>
            <ul className="list-group">
                <li className="list-group-item">Temperature: <b>{Math.round(this.state.weather.temperature)}°C</b></li>
                <li className="list-group-item">Humidity: <b>{this.state.weather.humidity}</b></li>
                <li className="list-group-item">Wind: <b>{this.state.weather.wind.speed} m/s {this.state.weather.wind.deg ? this.getDirection(this.state.weather.wind.deg) : 'N/A'}</b></li>
                <li className="list-group-item">
                    <form className="form-inline" onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <input type="text" className="form-control" id="city" placeholder="City" value={this.search} onChange={this.handleChange}></input>
                        </div>
                        <button type="submit" className="btn btn-default">Search</button>
                    </form>
                </li>
            </ul>
            { this.state.hasError && (
                <div className="alert alert-danger" role="alert">
                    Could not find weather for city
                </div>
                )
            }
        </div>
      );
    }
  }
  
ReactDOM.render(<App />, document.getElementById("weather-app"));