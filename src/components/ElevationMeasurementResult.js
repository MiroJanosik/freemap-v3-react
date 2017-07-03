import React from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'react-leaflet';
import { connect } from 'react-redux';
import { elevationMeasurementSetPoint, elevationMeasurementSetElevation } from 'fm3/actions/elevationMeasurementActions';
import MarkerWithAutoOpeningPopup from 'fm3/components/leaflet/MarkerWithAutoOpeningPopup';
import { formatGpsCoord } from 'fm3/geoutils';
import mapEventEmitter from 'fm3/emitters/mapEventEmitter';
import * as FmPropTypes from 'fm3/propTypes';

const nf1 = Intl.NumberFormat('sk', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

class ElevationMeasurementResult extends React.Component {

  static propTypes = {
    onPointSet: PropTypes.func.isRequired,
    onElevationClear: PropTypes.func.isRequired,
    point: FmPropTypes.point,
    elevation: PropTypes.number,
  }

  state = {};

  componentWillMount() {
    mapEventEmitter.on('mapClick', this.handlePoiAdd);
  }

  componentWillUnmount() {
    mapEventEmitter.removeListener('mapClick', this.handlePoiAdd);
  }

  handlePoiAdd = (lat, lon) => {
    this.setState({ point: undefined });
    this.props.onPointSet({ lat, lon });
  }

  handleDragStart = () => {
    this.props.onElevationClear(null);
  }

  handleDragEnd = (event) => {
    const { lat, lng: lon } = event.target.getLatLng();
    this.setState({ point: undefined });
    this.props.onPointSet({ lat, lon });
  }

  handleDrag = (event) => {
    const { lat, lng: lon } = event.target.getLatLng();
    this.setState({ point: { lat, lon } });
  }

  render() {
    const { point, elevation } = this.props;
    const { point: tmpPoint } = this.state;

    const p = tmpPoint || point;

    return point && (
      <MarkerWithAutoOpeningPopup
        position={L.latLng(p.lat, p.lon)}
        onDragstart={this.handleDragStart}
        onDragend={this.handleDragEnd}
        onDrag={this.handleDrag}
        draggable
      >

        <Popup closeButton={false} autoClose={false} autoPan={false}>
          <span>
            {['D', 'DM', 'DMS'].map(format => <div key={format}>{formatGpsCoord(p.lat, 'SN', format)} {formatGpsCoord(p.lon, 'WE', format)}</div>)}
            {typeof elevation === 'number' && <div>Nadmorská výška: {nf1.format(elevation)} m. n. m.</div>}
          </span>
        </Popup>
      </MarkerWithAutoOpeningPopup>
    );
  }

}

export default connect(
  state => ({
    elevation: state.elevationMeasurement.elevation,
    point: state.elevationMeasurement.point,
  }),
  dispatch => ({
    onPointSet(point) {
      dispatch(elevationMeasurementSetPoint(point));
    },
    onElevationClear() {
      dispatch(elevationMeasurementSetElevation(null));
    },
  }),
)(ElevationMeasurementResult);
