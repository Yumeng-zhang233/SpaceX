import React, {Component} from 'react';
import { Row, Col } from 'antd';
import axios from 'axios';
import { NEARBY_SATELLITE, SAT_API_KEY, STARLINK_CATEGORY } from '../constants';
import SatSetting from './SatSetting';
import SatelliteList from './SatelliteList';
import WorldMap from './WorldMap';


class Main extends Component {
    //get data
    constructor(){
        super();
        this.state = {
            satInfo: null,
            satList: null,
            setting: null,
            isLoadingList: false
        };
    }
    showNearbySatellite = (setting) => {
        console.log(setting)
        //卫星数据获取
        // this.setState({
        //     settings: setting
        // })
        this.setState({
            settings: setting
        });
        this.fetchSatellite(setting);
    }
    fetchSatellite = setting =>{
        //1.abstract api paras from the setting
        const {latitude, longitude, elevation, altitude} = setting;

        //2.send the request to fetch data （/api/---represents proxy跨域访问，只有提醒功能）
        const url = `/api/${NEARBY_SATELLITE}/${latitude}/${longitude}/${elevation}/${altitude}/${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;
        this.setState({
            isLoadingList: true
        });
        //3.add Spin
        axios.get(url)
            .then(response => {
                console.log(response.data)
                //4.remove spin
                this.setState({
                    satInfo: response.data,
               //4.remove spin
                    isLoadingList: false
                })
            })
            .catch(error => {
                console.log('err in fetch satellite -> ', error);
            })
    }
    showMap = selected => {
        console.log(selected);
        this.setState(preState =>({
            ...preState,
                satList:[...selected]
            // ... select colone
        }))
    }
    render() {
        const { isLoadingList, satInfo, satList, setting } = this.state;
        return (
            <Row className='main'>
                <Col span={8} className="left-side">
                    <SatSetting onShow={this.showNearbySatellite}/>
                    <SatelliteList isLoad={isLoadingList}
                                   satInfo={satInfo}
                                   onShowMap={this.showMap} />
                </Col>
                <Col span={16} className="right-side">
                    <WorldMap satData={satList} observerData={setting} />
                </Col>
            </Row>
        );
    }
}

export default Main;

