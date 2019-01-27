import React, { PureComponent } from "react";
import classnames from "classnames";
import ReactDOM from "react-dom";

class Suggestions extends PureComponent {
  state = {
    positionTop: -10000,
    positionLeft: -10000,
    focused: null,
    focusShift: 0
  };

  componentDidMount = () => {
    this.updatePosition();
  };

  componentDidUpdate = () => {
    this.updatePosition();
  };

  render() {
    const root = window.document.getElementById("root");
    const { focused, positionTop, positionLeft } = this.state;

    const style = {
      top: positionTop,
      left: positionLeft
    };

    return ReactDOM.createPortal(
      <ul className="suggestion-ul" style={style}>
        {this.props.terms.map(term => (
          <li
            key={term.code}
            className={classnames("suggestion-li", {
              focused: focused === term.code
            })}
            onClick={() => this.props.onSelect(term)}
          >
            <span>{term.text}</span>
          </li>
        ))}
      </ul>,
      root
    );
  }

  updatePosition() {
    const { anchor, terms } = this.props;
    const anchorElement = window.document.querySelector(anchor);

    if (!anchorElement) {
      return this.setState({
        positionLeft: -10000,
        positionTop: -10000,
        focused: null
      });
    }

    const anchorRect = anchorElement.getBoundingClientRect();
    const focused = terms.length > 0 ? terms[0].code : null;

    this.setState({
      positionTop: anchorRect.bottom,
      positionLeft: anchorRect.left,
      focused
    });
  }
}

export default Suggestions;
