// 3Dscatter
d3.csv("https://aymp.github.io/InfoVis2021/FinalTask/latent_space.csv")
    .then( function(data) {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; d.z = +d.z });

        var config = {
            parent: '#drawing_region',
            width: 960,
            height: 500,
            scale: 20,
            j: 10,
            startAngle: Math.PI/4,
            durationTime: 1000
            //margin: {top:30, right:10, bottom:50, left:100}
        };

        var cnt = 0;
        /* ----------- GRID ----------- */
        var xGrid = [];

        /* ----------- POINTS ----------- */
        var scatter = [];
        var cnt = 0;
        data.forEach(function(d){ scatter.push( {x: +d.x, y: +d.y, z: +z, id: 'point_'+cnt++} ) })
        for(var z = -j; z < j; z++){
            for(var x = -j; x < j; x++){
                xGrid.push([x, -0, z]);
            }
        }
        
        /* ----------- y-Scale ----------- */
        var yLine = [];
        d3.range(-1, 11, 1).forEach(function(d){ yLine.push([-0, -d, -0]); });

        /* ----------- DATA ----------- */
        var data = [
            grid3d(xGrid),
            point3d(scatter),
            yScale3d([yLine])
        ];

        const _3d_scatter_plot = new _3dScatterPlot( config, data );
        _3d_scatter_plot.update();
    
    })
    .catch( error => {
        console.log( error );
    });