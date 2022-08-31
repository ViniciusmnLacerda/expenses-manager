import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import BarLoader from 'react-spinners/BarLoader';
import Sidebar from '../components/Sidebar';
import Table from '../components/Table';
import WalletForm from '../components/WalletForm';
import '../styles/BarLoader.css';
import '../styles/Wallet.css';

class Wallet extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
    };
    this.fakeLoading = this.fakeLoading.bind(this);
  }

  componentDidMount() {
    this.fakeLoading();
  }

  fakeLoading() {
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 1500);
  }

  render() {
    const { isLoading } = this.state;
    const { areYouAdding } = this.props;
    return (
      <div className="body-wallet">
        {isLoading ? (
          <div className="loader">
            <BarLoader color="#F23D4C" width={300} />
          </div>
        ) : (
          <div className="wallet">
            {areYouAdding && <WalletForm />}
            <Sidebar />
            <Table />
          </div>
        )}
      </div>
    );
  }
}

Wallet.propTypes = {
  areYouAdding: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  areYouAdding: state.wallet.areYouAdding,
});

export default connect(mapStateToProps)(Wallet);
