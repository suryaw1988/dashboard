import React from "react";
import PropTypes from "prop-types";
import axios from "axios";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";

// @material-ui/icons
//import Email from "@material-ui/icons/Email";
import Icon from "@material-ui/core/Icon";
import Person from "@material-ui/icons/Person";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";

import loginPageStyle from "assets/jss/dgs-dashboard/views/loginPageStyle.js";

import config from "../../config";

//localStorage.removeItem(config.accessTokenKey);

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {
        status: true,
        message: ""
      }
    };
  }

  login = async (e) => {
    e.preventDefault();

    const { history } = this.props;

    const fields = ["username", "password"];
    const formElements = e.target.elements;

    const formValues = fields
      .map((field) => ({
        [field]: formElements.namedItem(field).value
      }))
      .reduce((current, next) => ({ ...current, ...next }));

    let loginRequest;
    try {
      loginRequest = await axios.post(
        `${config.apiDomain}/user/login`,
        {
          ...formValues
        },
        {
          withCredentials: false
        }
      );

      const { data: loginRequestData } = loginRequest;
      //console.log(loginRequestData.data.api_key);

      if (loginRequestData.status) {
        localStorage.setItem(
          config.accessTokenKey,
          loginRequestData.data.api_key
        );
        localStorage.setItem(config.accessAuth, loginRequestData.status);

        return history.push("/dashboard");
      } else {
        // console.log(loginRequestData.status);
        this.setState({
          errors: {
            status: loginRequestData.status,
            message: loginRequestData.message
          }
        });
      }
    } catch ({ response }) {
      loginRequest = response;
    }
  };

  render() {
    const { classes } = this.props;
    const { errors } = this.state;
    console.log(errors);
    return (
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={6} md={4}>
            <form onSubmit={this.login}>
              <Card className={classes[this.state.cardAnimaton]}>
                <CardHeader
                  className={`${classes.cardHeader} ${classes.textCenter}`}
                  color="primary"
                >
                  <h4 className={classes.cardTitle}>Log in</h4>
                </CardHeader>
                <CardBody>
                  <CustomInput
                    labelText="Username..."
                    id="email"
                    error={!errors.status}
                    formControlProps={{
                      fullWidth: true,
                      className: classes.formControlClassName
                    }}
                    inputProps={{
                      required: true,
                      name: "username",
                      endAdornment: (
                        <InputAdornment position="end">
                          <Person className={classes.inputAdornmentIcon} />
                        </InputAdornment>
                      )
                    }}
                  />
                  <CustomInput
                    labelText="Password"
                    error={!errors.status}
                    id="password"
                    formControlProps={{
                      fullWidth: true,
                      className: classes.formControlClassName
                    }}
                    inputProps={{
                      type: "password",
                      required: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Icon className={classes.inputAdornmentIcon}>
                            lock_outline
                          </Icon>
                        </InputAdornment>
                      )
                    }}
                  />
                </CardBody>
                <CardFooter className={classes.justifyContentCenter}>
                  <Button type="submit" color="primary" simple size="lg" block>
                    Login
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object,
  errors: PropTypes.object
};

export default withStyles(loginPageStyle)(LoginPage);
