import React, { Component, createElement } from 'react';
import './seatLayout.css'
import './cursors.css'

class Seat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isChosen: false,
            GridSeatNum: props['grid-seat-num'],
            SeatNumber: props['seat-number'],
            SeatStatus: props['seat-status']
        }

        this.handleClick = this.handleClick.bind(this)
        this.getClassName = this.getClassName.bind(this)
    }

    handleClick() {
        if (this.state.SeatStatus === '0') {
            this.setState(state => ({
                isChosen: !state.isChosen
            }))
        }
    }

    getClassName() {
        let baseName = 'seat-row-seat seat-yes'
        if (this.state.SeatStatus === '0') {
            baseName += '  can-select'
        }
        else {
            baseName += ' not-allowed'
        }

        if (this.state.isChosen) {
            baseName += ' current-selected'
        }
        return baseName
    }

    /*myFunc() {
        createElement(
            'li',
            {
                class: (seat.SeatStatus == 1 ? 'seat-row-seat seat-yes' : 'seat-row-seat seat-yes can-select'),
                'seat-data': {
                    "GridSeatNum": seatRow.GridRowId,
                    "SeatStatus": seat.SeatStatus,
                    "seatNumber": seat.SeatNumber,
                    "GridRowId": seatRow.GridRowId,
                    "PhyRowId": seatRow.PhyRowId,
                    "AreaNum": AreaNum,
                    "AreaCode": AreaCode,
                    "AreaDesc": AreaDesc
                }
            },
            [createElement('span', {})]
        ) 
    }*/

    render() {
        return (
            <li className={this.getClassName()} grid-seat-num={this.state.GridSeatNum} seat-number={this.state.SeatNumber} seat-status={this.state.SeatStatus}>
                <span onClick={this.handleClick}></span>
            </li>
        )
    }
}

class SeatingGrid extends Component {
    constructor(props) {
        super(props)

        this.seatLayout = props.seatingData.seatLayout

        this.intMaxSeatId = this.seatLayout.colAreas.intMaxSeatId
        this.intMinSeatId = this.seatLayout.colAreas.intMinSeatId

        this.makeSeatRow = this.makeSeatRow.bind(this)
        this.makeSeatArea = this.makeSeatArea.bind(this)
        this.makeFullSeatGrid = this.makeFullSeatGrid.bind(this)
    }

    makeSeatRow(rowInfo) {
        const {
            AreaDesc,
            AreaCode,
            AreaNum,
            seatRow
        } = rowInfo


        let row = []
        let realSeatIndex = 0

        for (let seatGridNum = this.intMinSeatId; seatGridNum <= this.intMaxSeatId; seatGridNum++) {
            console.log(seatRow.objSeat[realSeatIndex])

            let seat = seatRow.objSeat[realSeatIndex]

            if (seat == null) {
                row.push(createElement(
                    'li',
                    { class: 'seat-row-seat', },
                ))
            }
            else if (seat.GridSeatNum === seatGridNum) {
                let seatData = {
                    "GridSeatNum": seatRow.GridRowId,
                    "SeatStatus": seat.SeatStatus,
                    "seatNumber": seat.SeatNumber,
                    "GridRowId": seatRow.GridRowId,
                    "PhyRowId": seatRow.PhyRowId,
                    "AreaNum": AreaNum,
                    "AreaCode": AreaCode,
                    "AreaDesc": AreaDesc
                }

                row.push(<Seat grid-seat-num={seatRow.GridRowId} seat-number={seat.SeatNumber} seat-status={seat.SeatStatus} ></Seat>)
                realSeatIndex++
            }
            else {
                row.push(createElement(
                    'li',
                    { class: 'seat-row-seat', },
                ))
            }
        }

        return (
            <ul className="seat-area-row ">
                <li className="seat-row-seat row-indicator">{seatRow.PhyRowId}</li>
                {row}
            </ul>
        )

    }

    makeSeatArea(objArea) {
        let seatRows = []
        for (const seatRow in objArea.objRow) {
            let tempSeatRow = {
                "AreaDesc": objArea.AreaDesc,
                "AreaCode": objArea.AreaCode,
                "AreaNum": objArea.AreaNum,
                'seatRow': objArea.objRow[seatRow]
            }
            seatRows.push(this.makeSeatRow(tempSeatRow))
        }
        return (
            <div className="seat-area">
                <div className="seat-area-desc">{objArea.AreaDesc}</div>
                {seatRows}
            </div>
        )
    }

    makeFullSeatGrid(seatLayout) {
        let seatAreas = []

        for (const seatArea of seatLayout.colAreas.objArea) {
            seatAreas.push(this.makeSeatArea(seatArea))
        }
        return (
            <div className='seat-selection' style={{ width: (this.intMaxSeatId + 1) * 25.5 + 'px' }}>
                {seatAreas}
                <div className="movie-screen ">-- Screen --</div>
                <div className="seat-proccess-panel">
                    <button type="button" className="layout-action-btn layout-btn-cancel">
                        Cancel
                </button>
                    <button type="button" className="layout-action-btn layout-btn-done" disabled="">
                        Done
                </button>
                </div>
            </div>
        )
    }

    render() {
        const { seatingData } = this.props
        const seatLayout = seatingData.seatLayout
        //console.log(seatingData.seatLayout.colAreas.objArea[0])
        return (
            <div>
                {this.makeFullSeatGrid(seatLayout)}
            </div>
        )
    }
}

export default SeatingGrid;