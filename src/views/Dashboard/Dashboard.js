import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
//import Warning from "@material-ui/icons/vWarning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import Accessibility from "@material-ui/icons/Accessibility";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import MUIDataTable from "mui-datatables";
import { Line } from "react-chartjs-2";

import dashboardStyle from "assets/jss/dgs-dashboard/views/dashboardStyle.js";

import config from "../../config";

const dataChart = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "SOS",
      fill: false,
      lineTension: 0.1,
      backgroundColor: "#EC932F",
      borderColor: "#EC932F",
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: "#EC932F",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "#EC932F",
      pointHoverBorderColor: "#EC932F",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40]
    },
    {
      label: "OOS",
      fill: false,
      lineTension: 0.1,
      backgroundColor: "#71B37C",
      borderColor: "#71B37C",
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: "#71B37C",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "#71B37C",
      pointHoverBorderColor: "#71B37C",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [85, 69, 90, 61, 56, 55, 90]
    }
  ]
};

class Dashboard extends React.Component {
  state = {
    value: 0,
    persons: [],
    data: [],
    isLoading: false
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    let token = localStorage.getItem(config.accessTokenKey);
    axios
      .get(`${config.apiDomain}/activity/last_activity?last=1`, {
        headers: {
          "X-API-KEY": token
        },
        withCredentials: false
      })
      .then((res) => {
        const persons = Object.values(res.data.data);
        //console.log(persons);
        const data = [];
        persons.map((x) =>
          data.push({ Name: x.full_name, "Last Check In": x.checkin })
        );
        this.setState({ data, isLoading: false });
      });
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = (index) => {
    this.setState({ value: index });
  };
  render() {
    const { classes } = this.props;

    const columnsCheckinToday = ["Name", "Last Check In"];
    const options = {
      filter: false,
      pagination: false,
      print: false,
      download: false,
      viewColumns: false,
      customToolbar: null,
      selectableRows: false
    };

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  <Icon>assessment</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Sales Person</p>
                <h3 className={classes.cardTitle}>0</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    Learn More
                  </a>
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <Store />
                </CardIcon>
                <p className={classes.cardCategory}>Laporan 1</p>
                <h3 className={classes.cardTitle}>0</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <DateRange />
                  Learn More
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="danger" stats icon>
                <CardIcon color="danger">
                  <Icon>info_outline</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Laporan 2</p>
                <h3 className={classes.cardTitle}>0</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <LocalOffer />
                  Learn More
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                  <Accessibility />
                </CardIcon>
                <p className={classes.cardCategory}>Laporan 3</p>
                <h3 className={classes.cardTitle}>0</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Update />
                  Learn More
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={9}>
            <Card>
              <CardHeader color="danger" stats icon>
                <CardIcon color="danger">
                  <Icon>insert_chart</Icon>
                </CardIcon>
                =<h3 className={classes.cardTitle}>History</h3>
              </CardHeader>
              <CardBody>
                <Line data={dataChart} />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={3}>
            <Card>
              <CardHeader color="warning">
                <h4 className={classes.cardTitleWhite}>Today's Checked In</h4>
              </CardHeader>
              <CardBody>
                <MUIDataTable
                  data={this.state.data}
                  columns={columnsCheckinToday}
                  options={options}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
