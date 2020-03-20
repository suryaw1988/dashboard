import React, { Component } from "react";
import axios from "axios";

import moment from "moment";
//import 'moment/locale/zh-cn';
import "react-big-scheduler/lib/css/style.css";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import "react-big-scheduler/lib/css/antd-globals-hiding-hack.css";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import GridItem from "components/Grid/GridItem.js";

import config from "../../config";

import Scheduler, { SchedulerData, ViewTypes } from "react-big-scheduler";
import withDragDropContext from "components/withDndContext.js";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

class SalesPerson extends Component {
  constructor(props) {
    super(props);

    let currentDate = moment().format("YYYY-MM-01");

    let schedulerData = new SchedulerData(
      currentDate,
      ViewTypes.Month,
      false,
      false,
      {
        startResizable: false,
        endResizable: false,
        movable: false,
        creatable: false,
        eventGroupsAutoGenerated: false,
        views: [
          {
            viewName: "Month",
            viewType: ViewTypes.Month,
            showAgenda: false,
            isEventPerspective: true
          },
          {
            viewName: "Week",
            viewType: ViewTypes.Week,
            showAgenda: false,
            isEventPerspective: true
          },
          {
            viewName: "Day",
            viewType: ViewTypes.Day,
            showAgenda: false,
            isEventPerspective: true
          }
        ],
        schedulerWidth: "70%",
        resourceName: "Manpower",
        taskName: "Manpower"
      }
    );

    schedulerData.localeMoment.locale("en");
    this.state = {
      viewModel: schedulerData,
      resources: [],
      events: []
    };
  }

  async componentDidMount() {
    let token = localStorage.getItem(config.accessTokenKey);
    try {
      const [resourceRequest, eventsRequest] = await axios.all([
        axios.get(`${config.apiDomain}/activity/person_activity`, {
          headers: {
            "X-API-KEY": token
          },
          withCredentials: false
        }),
        axios.get(`${config.apiDomain}/activity/event_activity`, {
          headers: {
            "X-API-KEY": token
          },
          withCredentials: false
        })
      ]);

      const resourcesActivity = Object.values(resourceRequest.data.data);
      //console.log(resourcesActivity);
      const resources = [];
      resourcesActivity.map((x) => resources.push({ id: x.id, name: x.name }));
      this.setState({ resources });

      const eventsActivity = Object.values(eventsRequest.data.data);
      //console.log(eventsActivity);
      const events = [];
      eventsActivity.map((x) =>
        events.push({
          id: x.id,
          start: x.start,
          end: x.end,
          resourceId: x.resourceId,
          title: x.title,
          groupName: x.groupName,
          groupId: x.groupID,
          bgColor: x.bgColor,
          storeName: x.storeName
        })
      );
      this.setState({ events });

      if (resourceRequest.status && eventsRequest.status) {
        this.props.schedulerData.setResources({ resources });
        this.props.schedulerData.setEvents({ events });
      }
    } catch ({ response }) {}
  }

  componentDidUpdate() {}
  handleGoto = (id) => {
    this.props.history.push({
      pathname: "/admin/detailsales",
      search: `?activityId=${id}`
    });
    // this.props.history.push(`detailsales/${userId}`);
  };
  render() {
    const { viewModel } = this.state;
    //console.log(viewModel);
    //console.log(this.state.resources);
    //console.log(this.state.events);
    return (
      <div>
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={styles.cardTitleWhite}>Sales Persons</h4>
                </CardHeader>
                <CardBody>
                  <h4 style={{ textAlign: "right" }}>
                    Please Click Types (Month/Week/Day)
                  </h4>
                  <Scheduler
                    schedulerData={viewModel}
                    prevClick={this.prevClick}
                    nextClick={this.nextClick}
                    onSelectDate={this.onSelectDate}
                    onViewChange={this.onViewChange}
                    eventItemClick={this.eventClicked}
                    onScrollLeft={this.onScrollLeft}
                    onScrollRight={this.onScrollRight}
                    onScrollTop={this.onScrollTop}
                    onScrollBottom={this.onScrollBottom}
                    eventItemPopoverTemplateResolver={
                      this.eventItemPopoverTemplateResolver
                    }
                    toggleExpandFunc={this.toggleExpandFunc}
                  />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }
  prevClick = (schedulerData) => {
    schedulerData.prev();
    schedulerData.setEvents(this.state.events);
    this.setState({
      viewModel: schedulerData
    });
  };

  nextClick = (schedulerData) => {
    schedulerData.next();
    schedulerData.setEvents(this.state.events);
    this.setState({
      viewModel: schedulerData
    });
  };

  onViewChange = (schedulerData, view) => {
    schedulerData.setViewType(
      view.viewType,
      view.showAgenda,
      view.isEventPerspective
    );
    schedulerData.config.creatable = !view.isEventPerspective;
    schedulerData.setEvents(this.state.events);
    this.setState({
      viewModel: schedulerData
    });
  };

  onSelectDate = (schedulerData, date) => {
    schedulerData.setDate(date);
    schedulerData.setEvents(this.state.events);
    this.setState({
      viewModel: schedulerData
    });
  };

  eventClicked = (schedulerData, event) => {
    return this.handleGoto(event.id);
  };

  onScrollRight = (schedulerData, schedulerContent, maxScrollLeft) => {
    if (schedulerData.ViewTypes === ViewTypes.Day) {
      schedulerData.next();
      schedulerData.setEvents(this.state.events);
      this.setState({
        viewModel: schedulerData
      });

      schedulerContent.scrollLeft = maxScrollLeft - 10;
    }
  };
  eventItemPopoverTemplateResolver = (
    schedulerData,
    eventItem,
    title,
    start,
    end,
    statusColor
  ) => {
    return (
      // <React.Fragment>
      //     <h3>{title}</h3>
      //     <h5>{start.format("HH:mm")} - {end.format("HH:mm")}</h5>
      //     <img src="./icons8-ticket-96.png" />
      // </React.Fragment>
      <div style={{ width: "300px" }}>
        <Row type="flex" align="middle">
          <Col span={2}>
            <div
              className="status-dot"
              style={{ backgroundColor: statusColor }}
            />
          </Col>
          <Col span={22} className="overflow-text">
            <span className="header2-text" title={title}>
              {title}
            </span>
          </Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span={2}>
            <div />
          </Col>
          <Col span={22}>
            <span className="header3-text">
              {start.format("HH:mm") !== end.format("HH:mm")
                ? "Last Check In: " +
                  start.format("HH:mm") +
                  " - Last Check Out: " +
                  end.format("HH:mm")
                : "Check In: " + start.format("HH:mm")}
            </span>
          </Col>
        </Row>
      </div>
    );
  };

  onScrollLeft = (schedulerData, schedulerContent, maxScrollLeft) => {
    if (schedulerData.ViewTypes === ViewTypes.Day) {
      schedulerData.prev();
      schedulerData.setEvents(this.state.events);
      this.setState({
        viewModel: schedulerData
      });

      schedulerContent.scrollLeft = 10;
    }
  };

  onScrollTop = (schedulerData, schedulerContent, maxScrollTop) => {
    console.log("onScrollTop");
  };

  onScrollBottom = (schedulerData, schedulerContent, maxScrollTop) => {
    console.log("onScrollBottom");
  };

  toggleExpandFunc = (schedulerData, slotId) => {
    schedulerData.toggleExpandStatus(slotId);
    this.setState({
      viewModel: schedulerData
    });
  };
}

export default withDragDropContext(SalesPerson);