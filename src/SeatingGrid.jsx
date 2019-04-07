import React, { Component, createElement } from 'react';
import './seatLayout.css'
import './cursors.css'

class Seat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isChosen: false,
            PhyRowId: this.props['phy-row-id'],
            GridSeatNum: props['grid-seat-num'],
            SeatNumber: props['seat-number'],
            SeatStatus: props['seat-status'],
            AreaDesc: props['area-desc'],
            cost: 2.5
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

        console.log(`Seat ${this.state.PhyRowId}${this.state.SeatNumber} is ${!this.state.isChosen ? 'chosen' : 'removed'}`)
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

    render() {
        return (
            <li id={`${this.state.PhyRowId}${this.state.SeatNumber}`} area-desc={this.state.AreaDesc} cost={this.state.cost} className={this.getClassName()}>
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

        this.state = {
            cartHTML: null
        }

        this.makeSeatRow = this.makeSeatRow.bind(this)
        this.makeSeatArea = this.makeSeatArea.bind(this)
        this.makeFullSeatGrid = this.makeFullSeatGrid.bind(this)
        this.updateCart = this.updateCart.bind(this)
    }

    componentDidMount() {
        const mutationObserver = new MutationObserver(this.updateCart)
        mutationObserver.observe(document.body, {
            subtree: true,
            attributeOldValue: false,
        })

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
            //console.log(seatRow.objSeat[realSeatIndex])

            let seat = seatRow.objSeat[realSeatIndex]

            if (seat == null) {
                row.push(createElement(
                    'li',
                    {
                        className: 'seat-row-seat'
                    },
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
                //console.log(seatData)

                row.push(<Seat phy-row-id={seatRow.PhyRowId} grid-seat-num={seatRow.GridRowId} seat-number={seat.SeatNumber} seat-status={seat.SeatStatus} area-desc={seatData.AreaDesc} ></Seat>)
                realSeatIndex++
            }
            else {
                row.push(createElement(
                    'li',
                    { className: 'seat-row-seat', },
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
                "AreaId": objArea.AreaId,
                'seatRow': objArea.objRow[seatRow]
            }
            seatRows.push(this.makeSeatRow(tempSeatRow))
        }
        return (
            <div id={objArea.AreaId} className="seat-area">
                <div className="seat-area-desc">{objArea.AreaDesc}</div>
                {seatRows}
            </div>
        )
    }

    updateCart() {
        let rawTickets = document.getElementsByClassName('current-selected')
        let tempCartInfo = []
        for (let i = 0; i < rawTickets.length; i++) {
            tempCartInfo.push({
                id: rawTickets[i].id,
                desc: rawTickets[i].getAttribute(['area-desc']),
                cost: rawTickets[i].getAttribute(['cost'])
            })
        }
        //this.setState({ cartInfo: tempCartInfo })
        if (tempCartInfo) {
            const cartInfo = tempCartInfo//this.state.cartInfo
            let cost = 0.0
            let items = []
            for (let i = 0; i < cartInfo.length; i++) {
                items.push(
                    createElement(
                        'li',
                        { className: 'list-group-item d-flex justify-content-between lh-condensed' },
                        [
                            createElement(
                                'div',
                                {},
                                [
                                    createElement('h6', { className: 'my-0' }, cartInfo[i].id),
                                    createElement('small', { className: 'text-muted' }, cartInfo[i].desc)
                                ]
                            ),
                            createElement('span', { className: 'text-muted' }, '$' + parseFloat(cartInfo[i].cost).toFixed(2))
                        ]
                    )

                )
                cost += parseFloat(cartInfo[i].cost)
            }
            
            this.setState({ cartHTML:  
             (
                <div>
                    <h4 className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-muted">Your cart</span>
                        <span className="badge badge-secondary badge-pill">{cartInfo.length}</span>
                    </h4>

                    <ul className="list-group mb-3">

                        {items}

                        <li className="list-group-item d-flex justify-content-between">
                            <span>Total (USD)</span>
                            <strong>${cost.toFixed(2)}</strong>
                        </li>
                    </ul>
                </div>
            )})
        }
        return null

    }

    makeFullSeatGrid(seatLayout) {
        let seatAreas = []

        for (const seatArea of seatLayout.colAreas.objArea) {
            seatAreas.push(this.makeSeatArea(seatArea))
        }
        //style={{ width: (this.intMaxSeatId + 1) * 30 + 'px' }}
        return (
            <div>
                <div className='seat-selection' style={{ width: (this.intMaxSeatId + 1) * 30 + 'px' }}>
                    {seatAreas}
                    <div className="movie-screen ">Stage</div>
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
                <div className="col-50">
                    <div className="mx-auto" style={{ width: (this.intMaxSeatId + 1) * 30 + 'px' }}>
                        {this.state.cartHTML}
                    </div>
                </div>
            </div>

        )
    }
}

export default SeatingGrid;