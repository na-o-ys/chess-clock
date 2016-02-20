import React    from "react"
import ReactDom from "react-dom"
import docReady from "doc-ready"

//
// turn: 'init' -> 'friend' <-> 'enemy'
//
const Clock = React.createClass({
  getInitialState() {
    return {
      turn: 'init'
    }
  },
  render() {
    return (
      <div className="clock">
        <TimeFriend
          leftMs={this.props.leftMsFriend}
          countStartTime={Date.now()}
          active={this.status.turn == 'friend'}
        />
        <TimeEnemy time={this.props.timeEnemy} />
        <Button active={this.props.buttonActive} />
      </div>
    )
  }
})

const TimeFriend = React.createClass({
  getInitialState() {
    return {
      crrLeftMs: this.props.leftMs
    }
  },
  updateTimer() {
    const elapsedMs = Date.now() - this.props.countStartTime,
          crrLeftMs    = this.props.leftMs - elapsedMs
    if (crrLeftMs <= 0) this.lose()
    else this.setState({ crrLeftMs })
  },
  lose() {
    clearInterval(this.interval);
    this.setState({ crrLeftMs: 0 })
  },
  componentDidMount() {
    if (this.props.active) {
      this.interval = setInterval(this.updateTimer, 20)
    }
  },
  render() {
    return (
      <div className="time-friend">
        {this.state.crrLeftMs}
      </div>
    )
  }
})

const TimeEnemy = React.createClass({
  render() {
    return (
      <div className="time-enemy">
        {this.props.time}
      </div>
    )
  }
})

const Button = React.createClass({
  render() {
    return (
      <div className="button">
        stop
      </div>
    )
  }
})

export function renderClock(dom) {
  ReactDom.render(
    <Clock
      leftMsFriend={10000}
      timeEnemy={100}
    />,
    dom
  )
}
