import React, { Component, createElement } from 'react';
import SeatingGrid from './SeatingGrid.jsx';
import Cart from './Cart.jsx';
import seatDataJSON from './seatChart.json';
import dateDataJSON from './dates.json';

class SeatSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      seatLayout: null,
      dates: null,
      seatData: null,
      userPicksDate: null,
      userPicksSelectedTickets: null
    };
    this.showDates = this.showDates.bind(this);
    this.handleDateSubmit = this.handleDateSubmit.bind(this);
    this.handleBookNow = this.handleBookNow.bind(this);
  }

  componentDidMount() {
    const seatChartData = seatDataJSON;
    const dateData = dateDataJSON;
    this.setState({
      seatData: seatChartData,
      seatLayout: seatChartData.seatLayout,
      dates: dateData.dates
    });
    this.setState({
      isLoaded: true
    });
  }

  showDates() {
    const dates = this.state.dates;
    let htmlDates = [];

    for (let date = 0; date < dates.length; date++) {
      htmlDates.push(createElement('option', {}, dates[date]));
    }

    return htmlDates;
  }

  handleDateSubmit(event) {
    const selectElement = document.getElementById('datePickSelect');
    let date = selectElement.options[selectElement.options.selectedIndex].text;
    console.log('User picked ' + date);
    this.setState({
      userPicksDate: date
    });
    event.preventDefault();
  }

  handleBookNow() {
    let rawTickets = document.getElementsByClassName('current-selected');

    if (rawTickets.length === 0) {
      alert('You haven\'t selected any tickets!');
      console.log('');
    } else {
      let tempCartInfo = [];

      for (let i = 0; i < rawTickets.length; i++) {
        tempCartInfo.push({
          id: rawTickets[i].id,
          desc: rawTickets[i].getAttribute(['area-desc']),
          cost: rawTickets[i].getAttribute(['cost'])
        });
      }

      console.log('User picked seats:');
      console.log(tempCartInfo);
      this.setState({
        userPicksSelectedTickets: tempCartInfo
      });
    }
  }

  render() {
    //const { data, numberOfSeats } = this.state
    const {
      error,
      isLoaded,
      //seatLayout,
      //intMaxSeatId,
      //intMinSeatId,
      //dates,
      seatData,
      userPicksDate,
      userPicksSelectedTickets
    } = this.state;

    if (error) {
      return React.createElement("div", null, "Error: ", error.message);
    } else if (!isLoaded) {
      return React.createElement("div", null, "Loading...");
    } else if (!userPicksDate) {
      return React.createElement("div", {
        className: "col-50"
      }, React.createElement("div", {
        className: "mx-auto",
        style: {
          width: 'auto'
        }
      }, React.createElement("div", {
        className: "container"
      }, React.createElement("form", {
        onSubmit: this.handleDateSubmit
      }, React.createElement("label", {
        htmlFor: "datePickSelect"
      }, "Dates and times"), React.createElement("div", {
        className: "row"
      }, React.createElement("div", {
        className: "col-sm-8"
      }, React.createElement("select", {
        className: "form-control",
        id: "datePickSelect"
      }, this.showDates())), React.createElement("div", {
        className: "col-sm-4"
      }, React.createElement("button", {
        type: "submit",
        className: "btn btn-primary"
      }, "Get tickets")))))));
    } else if (!userPicksSelectedTickets) {
      return React.createElement("div", {
        className: "container"
      }, React.createElement("div", {
        className: "row"
      }, React.createElement("div", {
        className: "col-md-8 order-md-1"
      }, React.createElement(SeatingGrid, {
        seatingData: seatData
      })), React.createElement("div", {
        className: "col-md-4 order-md-2 "
      }, React.createElement(Cart, null), React.createElement("button", {
        className: "btn btn-success",
        onClick: this.handleBookNow
      }, "Book Now"))));
    } else {
      return React.createElement("div", {
        className: "container"
      }, React.createElement("div", {
        className: "py-5 text-center"
      }, React.createElement("h2", null, "Checkout form"), React.createElement("p", {
        className: "lead"
      }, "Fill this out to countinue to checkout.")), React.createElement("div", {
        className: "row"
      }, React.createElement("div", {
        className: "col-md-4 order-md-2 mb-4"
      }, React.createElement(Cart, {
        cartInfo: userPicksSelectedTickets
      })), React.createElement("div", {
        className: "col-md-8 order-md-1"
      }, React.createElement("h4", {
        className: "mb-3"
      }, "Billing address"), React.createElement("form", {
        className: "needs-validation",
        novalidate: true
      }, React.createElement("div", {
        className: "row"
      }, React.createElement("div", {
        className: "col-md-6 mb-3"
      }, React.createElement("label", {
        for: "firstName"
      }, "First name"), React.createElement("input", {
        type: "text",
        className: "form-control",
        id: "firstName",
        placeholder: "",
        value: "",
        required: true
      }), React.createElement("div", {
        className: "invalid-feedback"
      }, "Valid first name is required.")), React.createElement("div", {
        className: "col-md-6 mb-3"
      }, React.createElement("label", {
        for: "lastName"
      }, "Last name"), React.createElement("input", {
        type: "text",
        className: "form-control",
        id: "lastName",
        placeholder: "",
        value: "",
        required: true
      }), React.createElement("div", {
        className: "invalid-feedback"
      }, "Valid last name is required."))), React.createElement("div", {
        className: "mb-3"
      }, React.createElement("label", {
        for: "username"
      }, "Username"), React.createElement("div", {
        className: "input-group"
      }, React.createElement("div", {
        className: "input-group-prepend"
      }, React.createElement("span", {
        className: "input-group-text"
      }, "@")), React.createElement("input", {
        type: "text",
        className: "form-control",
        id: "username",
        placeholder: "Username",
        required: true
      }), React.createElement("div", {
        className: "invalid-feedback",
        style: {
          width: "100%"
        }
      }, "Your username is required."))), React.createElement("div", {
        className: "mb-3"
      }, React.createElement("label", {
        for: "email"
      }, "Email ", React.createElement("span", {
        className: "text-muted"
      }, "(Optional)")), React.createElement("input", {
        type: "email",
        className: "form-control",
        id: "email",
        placeholder: "you@example.com"
      }), React.createElement("div", {
        className: "invalid-feedback"
      }, "Please enter a valid email address for shipping updates.")), React.createElement("div", {
        className: "mb-3"
      }, React.createElement("label", {
        for: "address"
      }, "Address"), React.createElement("input", {
        type: "text",
        className: "form-control",
        id: "address",
        placeholder: "1234 Main St",
        required: true
      }), React.createElement("div", {
        className: "invalid-feedback"
      }, "Please enter your shipping address.")), React.createElement("div", {
        className: "mb-3"
      }, React.createElement("label", {
        for: "address2"
      }, "Address 2 ", React.createElement("span", {
        className: "text-muted"
      }, "(Optional)")), React.createElement("input", {
        type: "text",
        className: "form-control",
        id: "address2",
        placeholder: "Apartment or suite"
      })), React.createElement("div", {
        className: "row"
      }, React.createElement("div", {
        className: "col-md-5 mb-3"
      }, React.createElement("label", {
        for: "country"
      }, "Country"), React.createElement("select", {
        className: "custom-select d-block w-100",
        id: "country",
        required: true
      }, React.createElement("option", {
        value: ""
      }, "Choose..."), React.createElement("option", null, "United States")), React.createElement("div", {
        className: "invalid-feedback"
      }, "Please select a valid country.")), React.createElement("div", {
        className: "col-md-4 mb-3"
      }, React.createElement("label", {
        for: "state"
      }, "State"), React.createElement("select", {
        className: "custom-select d-block w-100",
        id: "state",
        required: true
      }, React.createElement("option", {
        value: ""
      }, "Choose..."), React.createElement("option", null, "California")), React.createElement("div", {
        className: "invalid-feedback"
      }, "Please provide a valid state.")), React.createElement("div", {
        className: "col-md-3 mb-3"
      }, React.createElement("label", {
        for: "zip"
      }, "Zip"), React.createElement("input", {
        type: "text",
        className: "form-control",
        id: "zip",
        placeholder: "",
        required: true
      }), React.createElement("div", {
        className: "invalid-feedback"
      }, "Zip code required."))), React.createElement("hr", {
        className: "mb-4"
      }), React.createElement("div", {
        className: "custom-control custom-checkbox"
      }, React.createElement("input", {
        type: "checkbox",
        className: "custom-control-input",
        id: "same-address"
      }), React.createElement("label", {
        className: "custom-control-label",
        for: "same-address"
      }, "Shipping address is the same as my billing address")), React.createElement("div", {
        className: "custom-control custom-checkbox"
      }, React.createElement("input", {
        type: "checkbox",
        className: "custom-control-input",
        id: "save-info"
      }), React.createElement("label", {
        className: "custom-control-label",
        for: "save-info"
      }, "Save this information for next time")), React.createElement("hr", {
        className: "mb-4"
      }), React.createElement("h4", {
        className: "mb-3"
      }, "Payment"), React.createElement("div", {
        className: "d-block my-3"
      }, React.createElement("div", {
        className: "custom-control custom-radio"
      }, React.createElement("input", {
        id: "credit",
        name: "paymentMethod",
        type: "radio",
        className: "custom-control-input",
        checked: true,
        required: true
      }), React.createElement("label", {
        className: "custom-control-label",
        for: "credit"
      }, "Credit card")), React.createElement("div", {
        className: "custom-control custom-radio"
      }, React.createElement("input", {
        id: "debit",
        name: "paymentMethod",
        type: "radio",
        className: "custom-control-input",
        required: true
      }), React.createElement("label", {
        className: "custom-control-label",
        for: "debit"
      }, "Debit card")), React.createElement("div", {
        className: "custom-control custom-radio"
      }, React.createElement("input", {
        id: "paypal",
        name: "paymentMethod",
        type: "radio",
        className: "custom-control-input",
        required: true
      }), React.createElement("label", {
        className: "custom-control-label",
        for: "paypal"
      }, "Paypal"))), React.createElement("div", {
        className: "row"
      }, React.createElement("div", {
        className: "col-md-6 mb-3"
      }, React.createElement("label", {
        for: "cc-name"
      }, "Name on card"), React.createElement("input", {
        type: "text",
        className: "form-control",
        id: "cc-name",
        placeholder: "",
        required: true
      }), React.createElement("small", {
        className: "text-muted"
      }, "Full name as displayed on card"), React.createElement("div", {
        className: "invalid-feedback"
      }, "Name on card is required")), React.createElement("div", {
        className: "col-md-6 mb-3"
      }, React.createElement("label", {
        for: "cc-number"
      }, "Credit card number"), React.createElement("input", {
        type: "text",
        className: "form-control",
        id: "cc-number",
        placeholder: "",
        required: true
      }), React.createElement("div", {
        className: "invalid-feedback"
      }, "Credit card number is required"))), React.createElement("div", {
        className: "row"
      }, React.createElement("div", {
        className: "col-md-3 mb-3"
      }, React.createElement("label", {
        for: "cc-expiration"
      }, "Expiration"), React.createElement("input", {
        type: "text",
        className: "form-control",
        id: "cc-expiration",
        placeholder: "",
        required: true
      }), React.createElement("div", {
        className: "invalid-feedback"
      }, "Expiration date required")), React.createElement("div", {
        className: "col-md-3 mb-3"
      }, React.createElement("label", {
        for: "cc-expiration"
      }, "CVV"), React.createElement("input", {
        type: "text",
        className: "form-control",
        id: "cc-cvv",
        placeholder: "",
        required: true
      }), React.createElement("div", {
        className: "invalid-feedback"
      }, "Security code required"))), React.createElement("hr", {
        className: "mb-4"
      }), React.createElement("button", {
        className: "btn btn-primary btn-lg btn-block",
        type: "submit"
      }, "Continue to checkout")))));
    }
  }

}

export default SeatSelector;