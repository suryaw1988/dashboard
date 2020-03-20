import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import moment from "moment";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Assignment from "@material-ui/icons/Assignment";
import History from "@material-ui/icons/History";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";

import queryString from "query-string";

import MUIDataTable from "mui-datatables";

import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import avatar from "assets/img/faces/default.png";
import poinCheckIn from "assets/img/leaf-green.png";
import poinCheckOut from "assets/img/leaf-red.png";
import shadowPoin from "assets/img/leaf-shadow.png";

import config from "../../config";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
};
//const REACT_APP_SERVER_URL = "api.digas.id";

export const CheckinPoint = new L.Icon({
  iconUrl: poinCheckIn,
  shadowUrl: shadowPoin,
  iconSize: [38, 95], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});
export const CheckoutPoint = new L.Icon({
  iconUrl: poinCheckOut,
  shadowUrl: shadowPoin,
  iconSize: [38, 95], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});

class DetailSales extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latCi: 0,
      lngCi: 0,
      latCo: 0,
      lngCo: 0,
      zoom: 13,
      dataLast: [],
      dataToday: [],
      dataPoduct: [],
      errors: {},
      needRerender: false,
    };
  }

  async componentDidMount() {
    let token = localStorage.getItem(config.accessTokenKey);
    let params = queryString.parse(this.props.location.search);

    try {
      const [profilRequest, todayRequest, productRequest] = await axios.all([
        axios.get(
          `${config.apiDomain}/activity/last_activity?activity_id=` +
            params["activityId"],
          {
            headers: {
              "X-API-KEY": token,
            },
            withCredentials: false,
          },
        ),
        axios.get(
          `${config.apiDomain}/activity/checkin_today?activity_id=` +
            params["activityId"],
          {
            headers: {
              "X-API-KEY": token,
            },
            withCredentials: false,
          },
        ),
        axios.get(
          `${config.apiDomain}/survey/product_status?activity_id=` +
            params["activityId"],
          {
            headers: {
              "X-API-KEY": token,
            },
            withCredentials: false,
          },
        ),
      ]);

      const { data: profilRequestData } = profilRequest;
      //console.log(profilRequest);

      if (profilRequest.status) {
        this.setState({
          dataLast: profilRequestData.data[0],
          latCi: profilRequestData.data[0].checkin_lat,
          lngCi: profilRequestData.data[0].checkin_long,
          latCo: profilRequestData.data[0].checkout_lat,
          lngCo: profilRequestData.data[0].checkout_long,
        });
      }

      const todayActivity = Object.values(todayRequest.data.data);
      //console.log(todayRequest.data.data);
      const dataToday = [];
      todayActivity.map(x =>
        dataToday.push({
          Outlet: x.store_name,
          "Check In": x.checkin,
          Id: x.id,
        }),
      );
      if (todayRequest.status) {
        this.setState({ dataToday });
      }

      const productAcivity = Object.values(productRequest.data.data);
      console.log(todayRequest);
      const dataProduct = [];
      productAcivity.map(x =>
        dataProduct.push({
          Product: x.product_name + " " + x.variant,
          Size: x.size + " Gram",
          STI: x.kpi_1,
          STO: x.kpi_2,
          SLO: x.kpi_3,
          OOS: x.kpi_4,
        }),
      );
      if (productRequest.status) {
        this.setState({ dataProduct });
      }
    } catch ({ response }) {}
  }
  componentDidUpdate() {}

  onRowClick = (rowData, rowState) => {
    let _id = rowData[2];
    this.props.history.replace({
      pathname: "/admin/detailsales",
      search: `?activityId=${_id}`,
    });
  };

  render() {
    const { classes } = this.props;
    const positionCheckin = [this.state.latCi, this.state.lngCi];
    const positionCheckout = [this.state.latCo, this.state.lngCo];

    const columnsTableTodayVisit = [
      "Outlet",
      "Check In",
      {
        name: "Id",
        options: {
          display: false,
        },
      },
    ];
    const optionsTableTodayVisit = {
      filter: false,
      pagination: false,
      print: false,
      download: false,
      viewColumns: false,
      customToolbar: null,
      onRowClick: this.onRowClick,
      selectableRows: false,
    };

    const columnsTableStock = ["Product", "Size", "STI", "STO", "SLO", "OOS"];

    const optionsTableStock = {
      filter: true,
      pagination: true,
      print: false,
      download: false,
      viewColumns: false,
      customToolbar: null,
      selectableRows: false,
    };

    console.log(this.state.dataProduct);
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={3}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <Card profile>
                  <CardAvatar profile>
                    <a href="#pablo" onClick={e => e.preventDefault()}>
                      <img src={avatar} alt="..." />
                    </a>
                  </CardAvatar>
                  <CardBody profile>
                    <h4 className={classes.cardTitle}>
                      {this.state.dataLast.full_name}
                    </h4>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem xs={12} sm={12} md={12}>
                <Card>
                  <CardHeader color="info">
                    <h4 className={classes.cardTitleWhite}>Today's Visit</h4>
                  </CardHeader>
                  <CardBody>
                    <MUIDataTable
                      data={this.state.dataToday}
                      columns={columnsTableTodayVisit}
                      options={optionsTableTodayVisit}
                    />
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem xs={12} sm={12} md={9}>
            <Card>
              <CardHeader color="info">
                <h4 className={classes.cardTitleWhite}>
                  Sales Visits,{" "}
                  {moment(new Date(this.state.dataLast.checkout)).format(
                    "dddd, MMMM Do YYYY",
                    "Asia/Jakarta",
                  )}
                </h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <Map
                      center={positionCheckin}
                      zoom={this.state.zoom}
                      style={{ width: "100%", height: "400px" }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      />
                      {this.state.latCi !== 0 && this.state.lngCi !== 0 ? (
                        <Marker position={positionCheckin} icon={CheckinPoint}>
                          <Popup>
                            {this.state.latCo === this.state.latCi
                              ? "Check In and Check Out"
                              : "Check In"}
                          </Popup>
                        </Marker>
                      ) : (
                        ""
                      )}

                      {this.state.latCo !== 0 && this.state.lngCo !== 0 ? (
                        <Marker
                          position={positionCheckout}
                          icon={CheckoutPoint}
                        >
                          <Popup>
                            {this.state.latCo === this.state.latCi
                              ? "Check In and Check Out"
                              : "Check Out"}
                          </Popup>
                        </Marker>
                      ) : (
                        ""
                      )}
                    </Map>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <span
                      style={{
                        fontWeight: "bold",
                        textDecorationLine: "underline",
                      }}
                    >
                      {this.state.dataLast.store_name}
                    </span>
                    <p>{this.state.dataLast.address}</p>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={6}>
                        <span
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          Check-In (A)
                        </span>
                        <CardAvatar style={{ margin: "0" }} checkinout>
                          <a href="#pablo" onClick={e => e.preventDefault()}>
                            <img
                              src={`https://api.digas.id/upload/image/checkin/${this.state.dataLast.checkin_photo}`}
                              alt="..."
                            />
                          </a>
                        </CardAvatar>
                        <span
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          Time :{" "}
                          {this.state.latCi !== 0 && this.state.lngCi !== 0
                            ? moment(
                                new Date(this.state.dataLast.checkin),
                              ).format("HH:mm:ss", "Asia/Jakarta")
                            : "-"}
                        </span>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <span
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          Check-Out (B)
                        </span>
                        <CardAvatar style={{ margin: "0" }} checkinout>
                          <a href="#" onClick={e => e.preventDefault()}>
                            <img
                              src={`https://api.digas.id/upload/image/checkin/${this.state.dataLast.checkout_photo}`}
                              alt="..."
                            />
                          </a>
                        </CardAvatar>
                        <span
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          Time :{" "}
                          {this.state.latCo !== 0 && this.state.lngCo !== 0
                            ? moment(
                                new Date(this.state.dataLast.checkout),
                              ).format("HH:mm:ss", "Asia/Jakarta")
                            : "-"}
                        </span>
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomTabs
                      title=""
                      headerColor="info"
                      tabs={[
                        {
                          tabName: "Product Stock, Selling In, Slling Out",
                          tabIcon: Assignment,
                          tabContent: (
                            <MUIDataTable
                              data={this.state.dataProduct}
                              columns={columnsTableStock}
                              options={optionsTableStock}
                            />
                          ),
                        },
                      ]}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

DetailSales.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
  email: PropTypes.string,
};

export default withStyles(styles)(DetailSales);
