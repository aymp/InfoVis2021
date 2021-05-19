d3.csv("https://aymp.github.io/InfoVis2021/W06/w06_task.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.precision; d.y = +d.recall; });

        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 512,
            margin: {top:10, right:10, bottom:20, left:25, axis:20, title:80, label:20}
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });