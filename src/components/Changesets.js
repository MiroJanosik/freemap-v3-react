import React from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-leaflet';
import strftime from 'strftime';
import Button from 'react-bootstrap/lib/Button';
import PropTypes from 'prop-types';

import MarkerWithInnerLabel from 'fm3/components/leaflet/MarkerWithInnerLabel';
import { toastsAdd } from 'fm3/actions/toastsActions';

function Changesets({ changesets, onShowChangesetDetail }) {
  return (
    <div>
      { changesets.map(changeset => (
        <MarkerWithInnerLabel
          faIcon="pencil"
          key={changeset.id}
          faIconLeftPadding="2px"
          position={L.latLng(changeset.centerLat, changeset.centerLon)}
          onClick={() => onShowChangesetDetail(changeset)}
        >
          <Tooltip className="compact" offset={new L.Point(9, -25)} direction="right" permanent>
            <span>
              {changeset.userName}: {(changeset.description || '/bez popisu/').substring(0, 20)} {changeset.description && changeset.description.length >= 20 ? '...' : ''}
            </span>
          </Tooltip>
        </MarkerWithInnerLabel>
      )) }
    </div>
  );
}

Changesets.propTypes = {
  changesets: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    centerLat: PropTypes.number.isRequired,
    centerLon: PropTypes.number.isRequired,
    userName: PropTypes.string.isRequired,
    description: PropTypes.string,
    closedAt: PropTypes.instanceOf(Date).isRequired,
  })),
  onShowChangesetDetail: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    changesets: state.changesets.changesets,
  }),
  dispatch => ({
    onShowChangesetDetail(changeset) {
      const message = (
        <div>
          <div><span style={{ fontWeight: '500' }} >autor:</span> {changeset.userName}</div>
          <div><span style={{ fontWeight: '500' }} >popis:</span> {changeset.description || '/bez popisu/'}</div>
          <div><span style={{ fontWeight: '500' }} >čas:</span> {strftime('%d. %m. %H:%M', changeset.closedAt)}</div>
          <div>
            <Button bsSize="small" onClick={() => window.open(`https://www.openstreetmap.org/changeset/${changeset.id}`)}>Viac detailov na osm.org</Button>
          </div>
        </div>
      );

      dispatch(toastsAdd({
        collapseKey: 'changeset.detail',
        message,
        cancelType: ['SET_TOOL'],
        style: 'info',
      }));
    },
  }),
)(Changesets);