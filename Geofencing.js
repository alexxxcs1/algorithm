class Geofencing {
    static rangeList = [];
    static translate_range = [];
    static scale
    static accuracy = 1000;
    constructor(rangeList) {
        rangeList && this.updateRangeInfo(rangeList);
    }
    updateRangeInfo = (rangeList) => {
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
        } = (range || []).reduce((result, posInfo) => {
            !result.minLon && (result.minLon = posInfo.longitude);
            !result.maxLon && (result.maxLon = posInfo.longitude);
            !result.minLat && (result.minLat = posInfo.latitude);
            !result.maxLat && (result.maxLat = posInfo.latitude);

            if (posInfo.longitude <= result.minLon) result.minLon = posInfo.longitude;
            if (posInfo.longitude >= result.maxLon) result.maxLon = posInfo.longitude;
            if (posInfo.latitude <= result.minLat) result.minLat = posInfo.latitude;
            if (posInfo.latitude >= result.maxLat) result.maxLat = posInfo.latitude;

            return result;
        }, {
            minLon: null,
            maxLon: null,
            minLat: null,
            maxLat: null
        });
        const scaleX = ((maxLon - minLon) * 3600) / Geofencing.accuracy;
        const scaleY = ((maxLat - minLat) * 3600) / Geofencing.accuracy;
        return {
            scaleX,
            scaleY,
            minLon,
            maxLon,
            minLat,
            maxLat
        }
    }
    getTranslatePostionList = (targetList) => {
        return (targetList || []).map(targetInfo => this.getTranslatePostion(targetInfo));
    }
    getTranslatePostion = (target) => {
        const { latitude, longitude } = target || {};
        const { scaleX, scaleY, minLon, maxLat } = Geofencing.scale || {};

        if (isNaN(scaleX) || isNaN(scaleY) || !Geofencing.rangeList.length || isNaN(latitude) || isNaN(longitude)) return;
        const screenX = (longitude - minLon) * 3600 / scaleX;
        const screenY = (maxLat - latitude) * 3600 / scaleY;
        return {
            screenX,
            screenY
        }
    }
    getRectPostion = (startPostion, endPostion) => {
        const { screenX: startScreenX, screenY: startScreenY } = startPostion;
        const { screenX: endScreenX, screenY: endScreenY } = endPostion;

        return {
            minX: Math.min(startScreenX, endScreenX),
            minY: Math.min(startScreenY, endScreenY),
            maxX: Math.max(startScreenX, endScreenX),
            maxY: Math.max(startScreenY, endScreenY)
        }
    }
    getIsInRange = (target) => {
        const { screenX: targetScreenX, screenY: targetScreenY } = this.getTranslatePostion(target) || {};
        const { result } = Geofencing.translate_range.reduce((resultObject, currentPostion) => {
            const [lastRangeInfo] = [...Geofencing.translate_range].reverse();
            let { _beforePostion, result } = resultObject;
            _beforePostion = _beforePostion || lastRangeInfo;

            const { minX, maxX, minY, maxY } = this.getRectPostion(currentPostion, _beforePostion);

            //获取在线的左侧还是右侧
            const x1 = _beforePostion.screenX;
            const y1 = _beforePostion.screenY;
            const x2 = currentPostion.screenX;
            const y2 = currentPostion.screenY;
            const x = targetScreenX;
            const y = targetScreenY;
            const inLinePostion = targetScreenX >= minX && targetScreenX <= maxX ? this.getInlinePostion(x1, y1, x2, y2, x, y) <= 0 : true;

            if (targetScreenX <= maxX && targetScreenY >= minY && targetScreenY <= maxY && inLinePostion) resultObject.result = resultObject.result + 1;

            resultObject._beforePostion = currentPostion;
            return resultObject;

        }, {
            _beforePostion: null,
            result: 0,
        })

        return result ? !!((result % 2) === 1) : false
    }
    getInlinePostion = (x1, y1, x2, y2, x, y) => {
        return (y1 - y2) * x + (x2 - x1) * y + x1 * y2 - x2 * y1;
    }
}



const testRange = [{
    "latitude": 30.321752,
    "longitude": 120.17736
},
{
    "latitude": 30.321752,
    "longitude": 120.180522
},
{
    "latitude": 30.316328,
    "longitude": 120.181959
},
{
    "latitude": 30.313827,
    "longitude": 120.186415
},
{
    "latitude": 30.308246,
    "longitude": 120.188571
},
{
    "latitude": 30.310023,
    "longitude": 120.194499
},
{
    "latitude": 30.309742,
    "longitude": 120.1982
},
{
    "latitude": 30.30862,
    "longitude": 120.199314
},
{
    "latitude": 30.305128,
    "longitude": 120.200644
},
{
    "latitude": 30.302883,
    "longitude": 120.201722
},
{
    "latitude": 30.303444,
    "longitude": 120.20377
},
{
    "latitude": 30.303351,
    "longitude": 120.20589
},
{
    "latitude": 30.302633,
    "longitude": 120.207507
},
{
    "latitude": 30.307092,
    "longitude": 120.212825
},
{
    "latitude": 30.304442,
    "longitude": 120.216023
},
{
    "latitude": 30.30254,
    "longitude": 120.219472
},
{
    "latitude": 30.299702,
    "longitude": 120.22285
},
{
    "latitude": 30.295399,
    "longitude": 120.226048
},
{
    "latitude": 30.292468,
    "longitude": 120.22691
},
{
    "latitude": 30.290098,
    "longitude": 120.227377
},
{
    "latitude": 30.286169,
    "longitude": 120.229749
},
{
    "latitude": 30.281616,
    "longitude": 120.230108
},
{
    "latitude": 30.280087,
    "longitude": 120.227557
},
{
    "latitude": 30.27831,
    "longitude": 120.224215
},
{
    "latitude": 30.281553,
    "longitude": 120.230144
},
{
    "latitude": 30.276813,
    "longitude": 120.232731
},
{
    "latitude": 30.274692,
    "longitude": 120.235714
},
{
    "latitude": 30.271947,
    "longitude": 120.239415
},
{
    "latitude": 30.262246,
    "longitude": 120.232803
},
{
    "latitude": 30.256382,
    "longitude": 120.228994
},
{
    "latitude": 30.248645,
    "longitude": 120.223389
},
{
    "latitude": 30.240253,
    "longitude": 120.216777
},
{
    "latitude": 30.227217,
    "longitude": 120.201039
},
{
    "latitude": 30.219603,
    "longitude": 120.186379
},
{
    "latitude": 30.217917,
    "longitude": 120.182786
},
{
    "latitude": 30.212737,
    "longitude": 120.172868
},
{
    "latitude": 30.207806,
    "longitude": 120.159573
},
{
    "latitude": 30.213486,
    "longitude": 120.156483
},
{
    "latitude": 30.214422,
    "longitude": 120.161154
},
{
    "latitude": 30.221725,
    "longitude": 120.141679
},
{
    "latitude": 30.229588,
    "longitude": 120.132696
},
{
    "latitude": 30.237077,
    "longitude": 120.123929
},
{
    "latitude": 30.24625,
    "longitude": 120.122348
},
{
    "latitude": 30.247186,
    "longitude": 120.118179
},
{
    "latitude": 30.240259,
    "longitude": 120.109987
},
{
    "latitude": 30.251179,
    "longitude": 120.097914
},
{
    "latitude": 30.270145,
    "longitude": 120.124791
},
{
    "latitude": 30.282496,
    "longitude": 120.1263
},
{
    "latitude": 30.300645,
    "longitude": 120.125294
},
{
    "latitude": 30.306531,
    "longitude": 120.124611
},
{
    "latitude": 30.309898,
    "longitude": 120.12842
},
{
    "latitude": 30.310865,
    "longitude": 120.129426
},
{
    "latitude": 30.315198,
    "longitude": 120.133594
},
{
    "latitude": 30.319532,
    "longitude": 120.137295
},
{
    "latitude": 30.320748,
    "longitude": 120.138301
},
{
    "latitude": 30.329913,
    "longitude": 120.138409
},
{
    "latitude": 30.331315,
    "longitude": 120.160256
},
{
    "latitude": 30.331378,
    "longitude": 120.162735
},
{
    "latitude": 30.329663,
    "longitude": 120.164748
},
{
    "latitude": 30.33197,
    "longitude": 120.16773
},
{
    "latitude": 30.329227,
    "longitude": 120.172437
},
{
    "latitude": 30.327169,
    "longitude": 120.175743
},
{
    "latitude": 30.324769,
    "longitude": 120.175276
},
{
    "latitude": 30.321745,
    "longitude": 120.177396
}]

const GeofencingTool = new Geofencing(testRange);

const result = GeofencingTool.getIsInRange({ latitude: 30.293455554108856, longitude: 120.13042324909377 });
console.log(result);
