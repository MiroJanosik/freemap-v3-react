import React from 'react';
import PropTypes from 'prop-types';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Button from 'react-bootstrap/lib/Button';
import Alert from 'react-bootstrap/lib/Alert';

import 'fm3/styles/toasts.scss';

export default class Toast extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    message: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.element.isRequired]),
    style: PropTypes.string,
    onAction: PropTypes.func.isRequired,
    onTimeoutStop: PropTypes.func.isRequired,
    onTimeoutRestart: PropTypes.func.isRequired,
    actions: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      action: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
      style: PropTypes.string,
    })).isRequired,
  }

  handleMouseEnter = () => {
    this.props.onTimeoutStop(this.props.id);
  }

  handleMouseLeave = () => {
    this.props.onTimeoutRestart(this.props.id);
  }

  handleAlertDismiss = () => {
    this.props.onAction(this.props.id);
  }

  render() {
    const {
      message, actions, onAction, id, style,
    } = this.props;
    const defaultAction = actions.find(({ name }) => !name);
    const clickHandler = defaultAction ? () => onAction(id, defaultAction.action) : undefined;
    const buttonActions = actions.filter(({ name }) => name);

    return (
      <Alert
        className="toast"
        bsStyle={style}
        onClick={clickHandler}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onDismiss={this.handleAlertDismiss}
      >
        <div className="toast-message">{message}</div>
        {buttonActions.length > 0 &&
          <div>
            <br />
            <ButtonToolbar>
              {
                buttonActions.map(({ name, action, style: buttonStyle }) => (
                  <Button key={name} bsStyle={buttonStyle} onClick={() => onAction(id, action)}>{name}</Button>
                ))
              }
            </ButtonToolbar>
          </div>
        }
      </Alert>
    );
  }
}
