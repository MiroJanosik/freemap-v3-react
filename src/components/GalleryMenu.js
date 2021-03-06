import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { galleryShowFilter, galleryShowUploadModal, galleryList } from 'fm3/actions/galleryActions';

import Button from 'react-bootstrap/lib/Button';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Form from 'react-bootstrap/lib/Form';

import FontAwesomeIcon from 'fm3/components/FontAwesomeIcon';

function GalleryMenu({
  onUpload, onFilterShow, filterIsActive, onOrderSelect,
}) {
  return (
    <Form inline>
      <span className="fm-label"><FontAwesomeIcon icon="picture-o" /><span className="hidden-xs"> Fotografie</span></span>
      {' '}
      <Button onClick={onFilterShow} active={filterIsActive}>
        <FontAwesomeIcon icon="filter" />
        <span className="hidden-xs"> Filter</span>
      </Button>
      {' '}
      <DropdownButton id="all-pics" title="Všetky fotky" onSelect={onOrderSelect}>
        <MenuItem eventKey="+createdAt">od prvej nahranej</MenuItem>
        <MenuItem eventKey="-createdAt">od posledne nahranej</MenuItem>
        <MenuItem eventKey="+takenAt">od najstaršie odfotenej</MenuItem>
        <MenuItem eventKey="-takenAt">od najnovšie odfotenej</MenuItem>
        <MenuItem eventKey="+rating">od najmenšieho hodnotenia</MenuItem>
        <MenuItem eventKey="-rating">od najväčšieho hodnotenia</MenuItem>
      </DropdownButton>
      {' '}
      <Button onClick={onUpload}>
        <FontAwesomeIcon icon="upload" />
        <span className="hidden-xs"> Nahrať</span>
      </Button>
    </Form>
  );
}

GalleryMenu.propTypes = {
  onUpload: PropTypes.func.isRequired,
  onFilterShow: PropTypes.func.isRequired,
  onOrderSelect: PropTypes.func.isRequired,
  filterIsActive: PropTypes.bool,
};

export default connect(
  state => ({
    filterIsActive: Object.keys(state.gallery.filter).some(key => state.gallery.filter[key]),
  }),
  dispatch => ({
    onUpload() {
      dispatch(galleryShowUploadModal());
    },
    onFilterShow() {
      dispatch(galleryShowFilter());
    },
    onOrderSelect(order) {
      dispatch(galleryList(order));
    },
  }),
)(GalleryMenu);
