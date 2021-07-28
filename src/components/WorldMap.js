import React, {Component} from 'react';
import { feature } from 'topojson-client';
import axios from 'axios';
import { geoKavrayskiy7 } from 'd3-geo-projection';
import { geoGraticule, geoPath } from 'd3-geo';
import { select as d3Select } from 'd3-selection';

import { WORLD_MAP_URL , SAT_API_KEY, SATELLITE_POSITION_URL} from "../constants";

const width = 960;
const height = 600;

class WorldMap extends Component {
    constructor(){
        super();
        this.state = {
            map: null
        }
        this.refMap = React.createRef(); //{current:null}
        this.refTrack = React.createRef(); //{current:null}
    }

    componentDidMount() {
        //fetch world map data
        axios.get(WORLD_MAP_URL)
            .then(res => {
                const { data } = res;
                //convert TopoJSON to GeoJSON
                const land = feature(data, data.objects.countries).features;
                this.generateMap(land);
            })
            .catch(e => console.log('err in fecth world map data ', e))
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.satData !== this.props.satData) {
            //fetch selected sat data
            //step1:get duration and lat,long ...from setting
            const {
                latitude,
                longitude,
                elevation,
                altitude,
                duration
            } = this.props.observerData;
            const endTime = duration * 60;

            //step2: fetch selected sat data
            // - configuration => url
            const urls = this.props.satData.map(sat =>{
                const { satid } = sat;
                const url = `/api/${SATELLITE_POSITION_URL}/${satid}/${latitude}/${longitude}/${elevation}
                /${endTime}/&apiKey=${SAT_API_KEY}`;
                return axios.get(url);
            });
            Promise.all(urls).then(res=>{
                console.log(res)
                const arr = res.map(sat => sat.data);
                this.track(arr);
            })
        }
    }
    track = data => {
        if (!data[0].hasOwnProperty("positions")) {
            throw new Error("no position data");
            return;
        }
        //draw
    }
        generateMap = land => {
        const projection = geoKavrayskiy7()
            .scale(170)
            .translate([width / 2, height / 2])
            .precision(.1);

        const graticule = geoGraticule();

        const canvas = d3Select(this.refMap.current)
            .attr("width", width)
            .attr("height", height);

        let context = canvas.node().getContext("2d");

        let path = geoPath()
            .projection(projection)
            .context(context);

        land.forEach(ele => {
            context.fillStyle = '#B3DDEF';//地图填充颜色
            context.strokeStyle = '#000';//地图边界线
            context.globalAlpha = 0.7;//深浅度
            context.beginPath();//什么时候开始画
            path(ele);//数据传输
            context.fill();//填充
            context.stroke();

            context.strokeStyle = 'rgba(220, 220, 220, 0.1)';
            context.beginPath();
            path(graticule());
            context.lineWidth = 0.1;
            context.stroke();

            context.beginPath();
            context.lineWidth = 0.5;
            path(graticule.outline());
            context.stroke();
        })
    }

    render() {
        return (
            <div className="map-box">
                <canvas className="map" ref={this.refMap} />
                <canvas className="track" ref={this.refTrack} />

            </div>
        );
    }
}

export default WorldMap;

