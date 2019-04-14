import React, { Component, createElement } from 'react'
import SeatingGrid from './SeatingGrid.jsx'
import Cart from './Cart.jsx'
import seatDataJSON from './seatChart.json'
import dateDataJSON from './dates.json'
import swal from 'bootstrap-sweetalert'

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
    }

    this.showDates = this.showDates.bind(this)
    this.handleDateSubmit = this.handleDateSubmit.bind(this)
    this.handleBookNow = this.handleBookNow.bind(this)
  }

  componentDidMount() {
    const seatChartData = seatDataJSON
    const dateData = dateDataJSON
    this.setState({
      seatData: seatChartData,
      seatLayout: seatChartData.seatLayout,
      dates: dateData.dates
    })
    this.setState({
      isLoaded: true
    })
  }

  showDates() {
    const dates = this.state.dates
    let htmlDates = []
    for (let date = 0; date < dates.length; date++) {
      htmlDates.push(
        createElement('option', {}, dates[date])
      )
    }
    return htmlDates
  }

  handleDateSubmit(event) {
    const selectElement = document.getElementById('datePickSelect')
    let date = selectElement.options[selectElement.options.selectedIndex].text
    console.log('User picked ' + date)
    this.setState({
      userPicksDate: date
    })
    event.preventDefault();
  }

  handleBookNow() {
    let rawTickets = document.getElementsByClassName('current-selected')
    if (rawTickets.length === 0) {
      swal('You haven\'t selected any tickets!')
      console.log('')
    }
    else {
      let tempCartInfo = []
      for (let i = 0; i < rawTickets.length; i++) {
        tempCartInfo.push({
          id: rawTickets[i].id,
          desc: rawTickets[i].getAttribute(['area-desc']),
          cost: rawTickets[i].getAttribute(['cost'])
        })
      }
      console.log('User picked seats:')
      console.log(tempCartInfo)
      this.setState({
        userPicksSelectedTickets: tempCartInfo
      })
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
    } = this.state

    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div>Loading...</div>
    } else if (!userPicksDate) {
      return (
        <div className="col-50">
          <div className="mx-auto" style={{ width: 'auto' }}>
            <div className="container">
              <form onSubmit={this.handleDateSubmit}>
                <label htmlFor="datePickSelect">Dates and times</label>
                <div className="row">
                  <div className="col-sm-8">
                    <select className="form-control" id="datePickSelect">
                      {this.showDates()}
                    </select></div>
                  <div className="col-sm-4">
                    <button type="submit" className="btn btn-primary">Get tickets</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )
    }
    else if (!userPicksSelectedTickets) {
      return (
        <div className='container'>
          <div className='row'>
            <div className="col-md-8 order-md-1">
              <SeatingGrid seatingData={seatData}></SeatingGrid>
            </div>
            <div className="col-md-4 order-md-2 ">
              <Cart></Cart>
              <button className="btn btn-success" onClick={this.handleBookNow}>Book Now</button>
            </div>
          </div>
        </div>
      )
    }
    else {
      return (
        <div className="container">
          <div className="py-5 text-center">
            <h2>Checkout form</h2>
            <p className="lead">Fill this out to countinue to checkout.</p>
          </div>

          <div className="row">
            <div className="col-md-4 order-md-2 mb-4">
              <Cart cartInfo={userPicksSelectedTickets}></Cart>
            </div>


            <div className="col-md-8 order-md-1">
              <h4 className="mb-3">Billing address</h4>
              <form className="needs-validation" novalidate>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label for="firstName">First name</label>
                    <input type="text" className="form-control" id="firstName" placeholder="" value="" required />
                    <div className="invalid-feedback">
                      Valid first name is required.
                </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label for="lastName">Last name</label>
                    <input type="text" className="form-control" id="lastName" placeholder="" value="" required />
                    <div className="invalid-feedback">
                      Valid last name is required.
                </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label for="username">Username</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">@</span>
                    </div>
                    <input type="text" className="form-control" id="username" placeholder="Username" required />
                    <div className="invalid-feedback" style={{ width: "100%" }}>
                      Your username is required.
                </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label for="email">Email <span className="text-muted">(Optional)</span></label>
                  <input type="email" className="form-control" id="email" placeholder="you@example.com" />
                  <div className="invalid-feedback">
                    Please enter a valid email address for shipping updates.
              </div>
                </div>

                <div className="mb-3">
                  <label for="address">Address</label>
                  <input type="text" className="form-control" id="address" placeholder="1234 Main St" required />
                  <div className="invalid-feedback">
                    Please enter your shipping address.
              </div>
                </div>

                <div className="mb-3">
                  <label for="address2">Address 2 <span className="text-muted">(Optional)</span></label>
                  <input type="text" className="form-control" id="address2" placeholder="Apartment or suite" />
                </div>

                <div className="row">
                  <div className="col-md-5 mb-3">
                    <label for="country">Country</label>
                    <select className="custom-select d-block w-100" id="country" required>
                      <option value="">Choose...</option>
                      <option>United States</option>
                    </select>
                    <div className="invalid-feedback">
                      Please select a valid country.
                </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label for="state">State</label>
                    <select className="custom-select d-block w-100" id="state" required>
                      <option value="">Choose...</option>
                      <option>California</option>
                    </select>
                    <div className="invalid-feedback">
                      Please provide a valid state.
                </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <label for="zip">Zip</label>
                    <input type="text" className="form-control" id="zip" placeholder="" required />
                    <div className="invalid-feedback">
                      Zip code required.
                </div>
                  </div>
                </div>
                <hr className="mb-4" />
                <div className="custom-control custom-checkbox">
                  <input type="checkbox" className="custom-control-input" id="same-address" />
                  <label className="custom-control-label" for="same-address">Shipping address is the same as my billing address</label>
                </div>
                <div className="custom-control custom-checkbox">
                  <input type="checkbox" className="custom-control-input" id="save-info" />
                  <label className="custom-control-label" for="save-info">Save this information for next time</label>
                </div>
                <hr className="mb-4" />

                <h4 className="mb-3">Payment</h4>

                <div className="d-block my-3">
                  <div className="custom-control custom-radio">
                    <input id="credit" name="paymentMethod" type="radio" className="custom-control-input" checked required />
                    <label className="custom-control-label" for="credit">Credit card</label>
                  </div>
                  <div className="custom-control custom-radio">
                    <input id="debit" name="paymentMethod" type="radio" className="custom-control-input" required />
                    <label className="custom-control-label" for="debit">Debit card</label>
                  </div>
                  <div className="custom-control custom-radio">
                    <input id="paypal" name="paymentMethod" type="radio" className="custom-control-input" required />
                    <label className="custom-control-label" for="paypal">Paypal</label>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label for="cc-name">Name on card</label>
                    <input type="text" className="form-control" id="cc-name" placeholder="" required />
                    <small className="text-muted">Full name as displayed on card</small>
                    <div className="invalid-feedback">
                      Name on card is required
                </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label for="cc-number">Credit card number</label>
                    <input type="text" className="form-control" id="cc-number" placeholder="" required />
                    <div className="invalid-feedback">
                      Credit card number is required
                </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label for="cc-expiration">Expiration</label>
                    <input type="text" className="form-control" id="cc-expiration" placeholder="" required />
                    <div className="invalid-feedback">
                      Expiration date required
                </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <label for="cc-expiration">CVV</label>
                    <input type="text" className="form-control" id="cc-cvv" placeholder="" required />
                    <div className="invalid-feedback">
                      Security code required
                </div>
                  </div>
                </div>
                <hr className="mb-4" />
                <button className="btn btn-primary btn-lg btn-block" type="submit">Continue to checkout</button>
              </form>
            </div>
          </div>

        </div>
      )
    }
  }
}

/*(
<div>
        <SeatingGrid seatingData={this.data}></SeatingGrid>
        <Cart intMaxSeatId={this.intMaxSeatId}></Cart>
      </div>
      )*/
/*
<form>
        <div className="form-group">

          <button type="submit" className="btn btn-primary">Book now</button>
        </div>
        <div className="form-group row">
          <label for="inputEmail3" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input type="email" className="form-control" id="inputEmail3" placeholder="Email" />
          </div>
        </div>
      </form>

      */
export default SeatSelector;
