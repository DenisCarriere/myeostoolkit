/**
 *
 * Scatter
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import {makeSelectScatter} from './selectors';
import {makeSelectEosClient} from './selectors';
import {makeSelectEosAccount} from './selectors';
import {makeSelectEosAuthority} from './selectors';
import {scatterLoaded} from './actions';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

export class Scatter extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentDidMount(){
    if(window.scatter) {
      this.props.onScatterLoaded(window.scatter);
      window.scatter = null;
    }
    document.addEventListener('scatterLoaded', scatterExtension => {
      //console.log('Scatter connected')
      this.props.onScatterLoaded(window.scatter);
      // Scatter will now be available from the window scope.
      // At this stage the connection to Scatter from the application is
      // already encrypted.

      // It is good practice to take this off the window once you have
      // a reference to it.
      window.scatter = null;
    })
  }

  render() {
    if(this.props.scatter) {
      if(this.props.eosAccount)
        return (<span>{this.props.eosAccount}<small>{this.props.eosAuthority ? ('@' + this.props.eosAuthority) : ('') }</small></span>);
      else {
        return ('Attach an Account')
      }
    } else {
      return ('Please install Scatter');
    }
  }
}

//TODO: Add prop types
Scatter.propTypes = {
  //dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  scatter: makeSelectScatter(),
  eosClient: makeSelectEosClient(),
  eosAccount: makeSelectEosAccount(),
  eosAuthority: makeSelectEosAuthority(),
});

function mapDispatchToProps(dispatch) {
  return {
    onScatterLoaded: (scatter) => dispatch(scatterLoaded(scatter)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'scatter', reducer });
const withSaga = injectSaga({ key: 'scatter', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Scatter);
