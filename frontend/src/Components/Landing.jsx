import React, { Component } from "react";
import "../../node_modules/bootstrap/dist/css/bootstrap.css";
import "./Styles/Landing.css";
class Landing extends Component {
  state = {
    CODIGOBARRAS: "",
    DESCRIPCION: "",
    OFERTA: "",
    DESCUENTO: "",
    PRECIO: ""
  };

  handleSubmit = e => {
    let conf = {
      method: "POST",
      body: JSON.stringify(this.state),
      headers: {
        "Content-Type": "application/json"
      }
    };
    e.preventDefault();

    fetch("localhost", conf).then(response => {
      response.json();
      console.log(response);
    });
  };
  handleLoad = e => {
    // let cabeceras = new Headers();
    // let conf = {
    //   method: "GET",
    //   headers: {'Access-Control-Allow-Origin':'*'},
    //   mode: "cors",
    //   cache: "default"
    // };
    // fetch("http://localhost:8080",conf).then(response => {
    //   response.json();
    //   console.log("GET");
    // });
  };

  handleChange = e => {
    e.preventDefault();
    this.setState({
      CODIGOBARRAS: e.target.value
    });
  };
  render() {
    return (
      <div className="container">
        <div id="uno" className="row">
          <div id="dos" className="col-lg-2 col-md-2 col-sm-2 col-xs-2"></div>
          <div id="tres" className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
            <h1 id="elH1">Ingrese código de barras</h1>
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                id="Barcode"
                autoFocus
                onChange={this.handleChange}
              />
            </form>
            <h1 id="descripcion"></h1>
            <h1 id="oferta"></h1>
            <h1 id="descuento"></h1>
            <h1 id="precio"></h1>
            <p id="Resultados"></p>
          </div>
        </div>
      </div>
    );
  }
}

export default Landing;
