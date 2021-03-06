import axios from 'axios';
import { createLogic } from 'redux-logic';

import { mapSetTileFormat, mapSetOverlayOpacity } from 'fm3/actions/mapActions';
import { startProgress, stopProgress, setHomeLocation, setActiveModal, setExpertMode } from 'fm3/actions/mainActions';
import { toastsAdd, toastsAddError } from 'fm3/actions/toastsActions';
import { trackViewerSetEleSmoothingFactor } from 'fm3/actions/trackViewerActions';
import { authSetUser } from 'fm3/actions/authActions';
import { tipsPreventNextTime } from 'fm3/actions/tipsActions';

export const saveSettingsLogic = createLogic({
  type: 'SAVE_SETTINGS',
  cancelType: ['SET_ACTIVE_MODAL', 'SAVE_SETTINGS'],
  process({ getState, action, cancelled$, storeDispatch }, dispatch, done) {
    const { tileFormat, homeLocation, nlcOpacity, touristOverlayOpacity, cycloOverlayOpacity,
      expertMode, trackViewerEleSmoothingFactor, user, preventTips } = action.payload;

    const dispatchRest = () => {
      dispatch(mapSetTileFormat(tileFormat));
      dispatch(setHomeLocation(homeLocation));
      dispatch(mapSetOverlayOpacity('N', nlcOpacity));
      dispatch(mapSetOverlayOpacity('t', touristOverlayOpacity));
      dispatch(mapSetOverlayOpacity('c', cycloOverlayOpacity));
      dispatch(setExpertMode(expertMode));
      dispatch(trackViewerSetEleSmoothingFactor(trackViewerEleSmoothingFactor));
      dispatch(tipsPreventNextTime(preventTips));
      dispatch(toastsAdd({
        collapseKey: 'settings.saved',
        message: 'Zmeny boli uložené.',
        style: 'info',
        timeout: 5000,
      }));
      setTimeout(() => { // hack to prevent self-cancelling
        storeDispatch(setActiveModal(null));
      });
    };

    // TODO also don't save user if not changed
    if (getState().auth.user) {
      const pid = Math.random();
      dispatch(startProgress(pid));
      const source = axios.CancelToken.source();
      cancelled$.subscribe(() => {
        source.cancel();
      });

      axios.patch(
        `${process.env.API_URL}/auth/settings`,
        Object.assign(
          { name: user.name, email: user.email },
          homeLocation ? { lat: homeLocation.lat, lon: homeLocation.lon } : {},
        ),
        {
          headers: {
            Authorization: `Bearer ${getState().auth.user.authToken}`,
          },
          validateStatus: status => status === 204,
          cancelToken: source.token,
        },
      )
        .then(() => {
          dispatch(authSetUser(Object.assign({}, getState().auth.user, { name: user.name, email: user.email })));
          dispatchRest();
        })
        .catch((e) => {
          dispatch(toastsAddError(`Nastala chyba pri načítavaní fotiek: ${e.message}`));
        })
        .then(() => {
          storeDispatch(stopProgress(pid));
          done();
        });
    } else {
      dispatchRest();
      done();
    }
  },
});

export default saveSettingsLogic;
