import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import APITransport from '../../actions/apitransport/apitransport';
import dashboardAPI from '../../actions/dashboardAPI';
import GlobalFilter from '../common/globalFilter/index';
import { isMobile } from 'react-device-detect';
import { Card } from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { updateGlobalFilterData } from '../../actions/globalFilter/GFilterAction';
import style from './styles';
import PageLayout from '../Charts/pagelayout';
import CustomizedMenus from './download';
import CustomizedShare from './share';
import FilterIcon from '@material-ui/icons/FilterList';
import Button from '@material-ui/core/Button';
import Menu from '../common/CustomMenu'
import _ from 'lodash';
import getChartOptions from '../../actions/getChartOptions';
import getFilterObj from '../../actions/getFilterObj';
import CustomTabs from '../common/Tabs/Tabs';
import ChartsAPI from '../../actions/charts/chartsAPI';
import { Typography } from '@material-ui/core';
import Cards from '../common/Cards/Cards';
import UiTable from '../common/UiTable/UiTable';
import moment from 'moment';

// let page = 'home';
class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      filter: this.props.GFilterData,
      isFilterOpen: false,
      selectedTab: null,
      page: _.get(this.props, 'match.params.pageId'),
      viewAll: _.get(this.props, 'match.params.viewAll')
    }

  }

  componentWillReceiveProps(nextProps) {
    // console.log('dashboard fired', _.get(nextProps, 'match.params.viewAll'))
    let newUrl = _.get(nextProps, 'match.params.viewAll');
    if (newUrl && this.state.viewAll !== newUrl) {
      this.setState({
        viewAll: newUrl
      })
    }
  }

  callDashboardAPI() {
    let dashboardApi = new dashboardAPI(20000);
    this.props.APITransport(dashboardApi, (_.toLower(this.state.page) === 'dashboard' || typeof this.state.page == 'undefined') ? 'home' : this.state.page);
  }

  componentDidMount() {
    let startDate= moment().month(3).startOf('month').unix()
    let endDate = moment().month(2).endOf('month').add(1, 'years').unix()

    let newFilterData = this.state.filter
    
    newFilterData.duration.value.startDate = startDate
    newFilterData.duration.value.endDate = endDate

    this.setState({
      filter: newFilterData
    })

    this.callDashboardAPI();
  }

  share() {

  }
  callAll() {
    let { chartsData } = this.props;
    let filters = getFilterObj(this.props.GFilterData, this.props.globalFilterData, this.state.page);
    _.each(chartsData, (k, v) => {
      let code = v;
      if (code) {
        let requestBody = getChartOptions(code, filters);
        let chartsAPI = new ChartsAPI(2000, 'dashboard', code, requestBody.dataoption);
        this.props.APITransport(chartsAPI)
      }
    })
  }

  applyFilter(filterData) {
    /**
     * next to this step dynamic properties are not avaiblable
     */
    this.setState({
      filter: filterData
    })
    this.props.updateFilterData(filterData);

  }
  applyFiltersLive(filter) {
    this.setState({
      filter: filter
    }, this.callAll())
  }
  setViewAll = (visualCode) =>{
    this.setState({
      viewAll: visualCode
    })
  }
  handleFilters() {
    // let fil = this.state.isFilterOpen
    this.setState({
      isFilterOpen: !this.state.isFilterOpen
    })
  }
  goback() {
    //let pageId = _.get(this.props, 'match.params.pageId');
    //this.props.history.push(`/${pageId}`);

    this.setState({
      viewAll: undefined
    })
  }
  tabChanged(value, v) {
    this.setState({
      selectedTab: v
    });
  }

  renderViewAll() {
    let { classes, strings } = this.props;
    // let codekey = _.chain(this.props).get('chartData').first().get("id").value();
    let data = _.chain(this.props).get("chartsData").get(this.state.viewAll).get('data').map((d, i) => {
      let plot = d.plots[0];
      let label = _.chain(plot.name).split('.').join("_").toUpper().value();
      return {
        "fortable": (strings["TENANT_TENANTS_" + label] || label),
        "order": d.headerValue,
        "label": d.headerName + " " + d.headerValue + " : " + (strings["TENANT_TENANTS_" + label] || label),
        "value": plot.value,
        "label2": (strings[plot.label] || plot.label) + ": ",
        "color": (plot.value > 50) ? "#259b24" : "#e54d42"
      }
    }).compact().value() || [];
    if (data && data.length > 0) {
      let columnData = [];
      columnData.push({ id: 'rank', numeric: true, stickyHeader: false, disablePadding: false, label: 'Rank' })
      columnData.push({ id: 'ULBs', numeric: true, stickyHeader: false, disablePadding: false, label: 'ULBs' })
      columnData.push({ id: 'TargetAchieved', numeric: true, stickyHeader: false, disablePadding: false, label: 'Target Achieved' })
      columnData.push({ id: 'status', numeric: true, stickyHeader: false, disablePadding: false, label: 'Status' })
      let newData = _.chain(data).map((rowData, i) => {
        return {
          rank: (rowData.order),
          ULBs: rowData.fortable,
          TargetAchieved: parseFloat((rowData.value || 0)).toFixed(2) + '%',
          status: rowData.value,
        }
      }).value();


      return (<Cards>
        <Card style={{ overflow: 'initial' }}>
          <div className={classes.heading} onClick={this.goback.bind(this)}>
            <ArrowBack /> <span style={{ marginTop: 'auto', marginBottom: 'auto' }}>{this.props.title}</span>
          </div>
        </Card>
        <UiTable
          data={newData}
          columnData={columnData}
          needHash={true}
          orderBy={"rank"}
          order={(_.get(newData[0], 'rank') === 1 || false) ? 'asc' : 'desc'}
          tableType='ULB'
          noPage={false}
          needSearch={true}
          needExport={true}
          excelName={"All ULBs"}

        />
      </Cards >)
    } else {
      return null;
    }

  }


  renderNormal() {
    let { classes, dashboardConfigData, GFilterData } = this.props;
    // let displayName = [true, false, true, false];
    let tabsInitData = _.chain(dashboardConfigData).first().get("visualizations").groupBy("name").value();
    let tabs = _.map(tabsInitData, (k, v) => {
      return {
        name: v,
        key: v,
        lbl: v
      };
    });
    let defaultTab = this.state.selectedTab ? this.state.selectedTab : _.get(_.first(tabs), 'name')

    return (
      <div>





        {/* </div> */}
        {/* <div id="divToPrint"> */}


        {/* {this.state.isFilterOpen &&
          <GlobalFilter applyFilters={this.applyFilter.bind(this)} hideDepart={false} applyFiltersLive={this.applyFiltersLive.bind(this)} />
        } */}

        <CustomTabs myTabs={tabs} value={defaultTab} handleChange={this.tabChanged.bind(this)}>

        </CustomTabs>

        {
          _.map(tabsInitData, (k, v) => {
            return (<Typography
              component="div"
              role="tabpanel"
              hidden={(defaultTab) !== v}
              id={`simple-tabpanel-${v}`}
              aria-labelledby={`simple-tab-${v}`}
            // {...other}
            >
              <div id={(defaultTab) === v ? "div1ToPrint" : 'divNotToPrint'} className={(defaultTab) === v ? "elemClass" : 'elemClass1'}>
                <PageLayout chartRowData={k} headingTitle="Revenue" GFilterData={GFilterData} displayName={""} page={this.state.page} setViewAll={this.setViewAll.bind(this)}/>
              </div>
            </Typography>)
          })
        }
      </div>
      // </div>
    )
  }

  render() {
    let { classes, dashboardConfigData, GFilterData } = this.props;
    let dashboardName= dashboardConfigData && Array.isArray(dashboardConfigData) && dashboardConfigData.length >= 0 && dashboardConfigData[0] && dashboardConfigData[0].name && dashboardConfigData[0].name

    return (<div id="divToPrint" className={classes.dashboard}>
      <div className={classes.actions}>
        <span className={classes.pageHeader}>
        {dashboardConfigData && Array.isArray(dashboardConfigData) && dashboardConfigData.length >= 0 && dashboardConfigData[0] && dashboardConfigData[0].name && dashboardConfigData[0].name}
      </span>
        {isMobile && <div id="divNotToPrint" data-html2canvas-ignore="true" className={[classes.desktop, classes.posit].join(' ')}>

          <Menu type="download" bgColor="white" color="black" fileHeader="SURE Dashboard" fileName={dashboardName}></Menu>
          <Button className={classes.btn1} data-html2canvas-ignore="true"
            onClick={this.handleFilters.bind(this)}
            fileName={dashboardName}
          >
            <FilterIcon></FilterIcon>
          </Button>
        </div>
        }

        {!isMobile && <div id="divNotToPrint" className={classes.acbtn}>
          <CustomizedMenus key="download" fileName={dashboardName} fileHeader="State Wide Urban Real-Time Executive (SURE) Dashboard" />
          <CustomizedShare key="share" fileName={dashboardName} PDFDownloads={this.share.bind(this)} />
        </div>}
      </div>

      <div className={classes.mobile} style={{ paddingRight: '24px' }}>
        {(this.state.isFilterOpen || !isMobile) &&
          <GlobalFilter applyFilters={this.applyFilter.bind(this)} hideDepart={this.state.page && this.state.page.toLowerCase() !== 'dashboard'} applyFiltersLive={this.applyFiltersLive.bind(this)} />
        }
      </div>
      {
        this.state.viewAll ? this.renderViewAll() : this.renderNormal()
      }

    </div>
    )

  }
}
const mapStateToProps = (state) => {
  return {
    dashboardConfigData: state.firstReducer.dashboardConfigData,
    globalFilterData: state.globalFilter,
    GFilterData: state.GFilterData,
    chartsData: state.chartsData,
    strings: state.lang
  }
}
const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    APITransport: APITransport,
    updateFilterData: updateGlobalFilterData
  }, dispatch)
}
export default withRouter(withStyles(style)(connect(mapStateToProps, mapDispatchToProps)(Dashboard)));
