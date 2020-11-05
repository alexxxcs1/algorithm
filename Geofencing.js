class Geofencing{
    static rangeList = [];
    static translate_range = [];
    static scale
    static accuracy = 1000;
    constructor(rangeList){
        rangeList &&  this.updateRangeInfo(rangeList);
    }
    updateRangeInfo=(rangeList)=>{
        Geofencing.rangeList = rangeList;
        Geofencing.scale = this.getScale(rangeList);
        Geofencing.translate_range = this.getTranslatePostionList(rangeList);
    }
    getScale = (range) => {
        const {
            minLon,
            maxLon,
            minLat,
            maxLat
        } = (range || []).reduce(( result, posInfo )=>{
            !result.minLon && ( result.minLon = posInfo.longitude );
            !result.maxLon && ( result.maxLon = posInfo.longitude );
            !result.minLat && ( result.minLat = posInfo.latitude );
            !result.maxLat && ( result.maxLat = posInfo.latitude );

            if( posInfo.longitude < result.minLon ) result.minLon = posInfo.longitude;
            if( posInfo.longitude > result.maxLon ) result.maxLon = posInfo.longitude;
            if( posInfo.latitude < result.minLat ) result.minLat = posInfo.latitude;
            if( posInfo.latitude > result.maxLat ) result.maxLat = posInfo.latitude;

            return result;
        },{
            minLon:null,
            maxLon:null,
            minLat:null,
            maxLat:null
        });
        const scaleX = ((maxLon-minLon)*3600)/Geofencing.accuracy;
        const scaleY = ((maxLat-minLat)*3600)/Geofencing.accuracy;
        return {
            scaleX,
            scaleY,
            minLon,
            maxLon,
            minLat,
            maxLat
        }
    }
    getTranslatePostionList = ( targetList ) => {
        return (targetList || []).map( targetInfo => this.getTranslatePostion(targetInfo));
    }
    getTranslatePostion = ( target ) =>{
        const { latitude, longitude } = target || {};
        const { scaleX, scaleY, minLon, maxLat } = Geofencing.scale || {};

        if (isNaN(scaleX) || isNaN(scaleY) || !Geofencing.rangeList.length || isNaN(latitude) || isNaN(longitude)) return ;
        const screenX = (longitude - minLon)*3600/scaleX;
        const screenY = (maxLat - latitude)*3600/scaleY;
        return {
            screenX,
            screenY
        }
    }
    getRectPostion = (startPostion, endPostion) => {
        const {screenX:startScreenX, screenY:startScreenY} = startPostion;
        const {screenX:endScreenX, screenY:endScreenY} = endPostion;

        return {
            minX:Math.min(startScreenX, endScreenX),
            minY:Math.min(startScreenY, endScreenY),
            maxX:Math.max(startScreenX, endScreenX),
            maxY:Math.max(startScreenY, endScreenY)
        }
    }
    getIsInRange = (target) => {
        const { screenX:targetScreenX, screenY:targetScreenY } = this.getTranslatePostion(target) || {};
        const { result } = Geofencing.translate_range.reduce( (resultObject, currentPostion) => {
            const [ lastRangeInfo ] = [ ...Geofencing.translate_range ].reverse();
            let { _beforePostion, result  } = resultObject;
            _beforePostion = _beforePostion || lastRangeInfo;

            const { maxX, minY, maxY } = this.getRectPostion( currentPostion, _beforePostion );
            
            if (targetScreenX <= maxX && targetScreenY >= minY && targetScreenY <= maxY ) resultObject.result = resultObject.result + 1;

            resultObject._beforePostion = currentPostion; 
            return resultObject;
            
        },{
            _beforePostion:null,
            result:0,
        })

        return result ? !!((result % 2) === 1) : false
    }
}



const testRange =  [{
    "latitude": 13.764571,
    "longitude": 100.495834
}, {
    "latitude": 13.761237,
    "longitude": 100.49137
}, {
    "latitude": 13.757569,
    "longitude": 100.489139
}, {
    "latitude": 13.754734,
    "longitude": 100.488109
}, {
    "latitude": 13.748231,
    "longitude": 100.489139
}, {
    "latitude": 13.742228,
    "longitude": 100.492915
}, {
    "latitude": 13.740061,
    "longitude": 100.49858
}, {
    "latitude": 13.73806,
    "longitude": 100.506305
}, {
    "latitude": 13.734558,
    "longitude": 100.510768
}, {
    "latitude": 13.728054,
    "longitude": 100.513343
}, {
    "latitude": 13.721551,
    "longitude": 100.514201
}, {
    "latitude": 13.719216,
    "longitude": 100.513
}, {
    "latitude": 13.721551,
    "longitude": 100.571193
}, {
    "latitude": 13.74523,
    "longitude": 100.575484
}, {
    "latitude": 13.750732,
    "longitude": 100.547847
}, {
    "latitude": 13.756402,
    "longitude": 100.542869
}, {
    "latitude": 13.766239,
    "longitude": 100.537719
}, {
    "latitude": 13.770574,
    "longitude": 100.530337
}, {
    "latitude": 13.756068,
    "longitude": 100.523128
}]

const GeofencingTool = new Geofencing( testRange );
const result = GeofencingTool.getIsInRange({latitude: 25.014392890444764, longitude: 102.69228955350938});
console.log(result);




