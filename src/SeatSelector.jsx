import React, { Component } from 'react';
import SeatingGrid from './SeatingGrid.jsx'
import seatData from './seatChart.json';

class SeatSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: seatData,
      numberOfSeats: 3
    }
  }

  render() {
    const { data, numberOfSeats } = this.state
    return (
      <div>
        <SeatingGrid seatingData={data}></SeatingGrid>
      </div>
    )
  }
}

export default SeatSelector;
