/*d3.csv("https://aymp.github.io/InfoVis2021/FinalTask/latent_space.csv", function(train_error, train_data) {
    if (train_error) throw train_error;
    d3.csv("https://aymp.github.io/InfoVis2021/FinalTask/test.csv", function(test_error, test_data) {
        if (test_error) throw test_error;
        d3.csv("https://aymp.github.io/InfoVis2021/FinalTask/additional.csv", function(add_error, add_data) {
            if (add_error) throw add_error;

            let train_config = {
                parent: '#drawing_region_train',
                origin: [250, 250],
                width: 500,
                height: 500,
                scale: 40,
                startAngle:  7*Math.PI/6,
                minScale: -5,
                maxScale: 5,
                durationTime: 1000
            };

            let test_config = {
                parent: '#drawing_region_test',
                origin: [250, 250],
                width: 500,
                height: 500,
                scale: 40,
                startAngle:  7*Math.PI/6,
                minScale: -5,
                maxScale: 5,
                durationTime: 1000
            };

            let add_config = {
                parent: '#drawing_region_add',
                origin: [250, 250],
                width: 500,
                height: 500,
                scale: 40,
                startAngle:  7*Math.PI/6,
                minScale: -5,
                maxScale: 5,
                durationTime: 1000
            };

            const train_3d_scatter_plot = new _3dScatterPlot( train_config, train_data );
            const test_3d_scatter_plot = new _3dScatterPlot( test_config, test_data );
            const add_3d_scatter_plot = new _3dScatterPlot( add_config, add_data );
            train_3d_scatter_plot.update();
            test_3d_scatter_plot.update();
            add_3d_scatter_plot.update();
            
        })
    })
})*/

d3.queue()
    .defer(d3.csv, "https://aymp.github.io/InfoVis2021/FinalTask/latent_space.csv")
    .defer(d3.csv, "https://aymp.github.io/InfoVis2021/FinalTask/test.csv")
    .defer(d3.csv, "https://aymp.github.io/InfoVis2021/FinalTask/additional.csv")
    .await(function(error, train_data, test_data, add_data) {
        if (error) {
            console.error('Oh dear, something went wrong: ' + error);
        }
        else {
            let train_config = {
                parent: '#drawing_region_train',
                origin: [200, 200],
                width: 400,
                height: 400,
                scale: 30,
                startAngle:  7*Math.PI/6,
                minScale: -5,
                maxScale: 5,
                durationTime: 1000
            };

            let test_config = {
                parent: '#drawing_region_test',
                origin: [200, 200],
                width: 400,
                height: 400,
                scale: 30,
                startAngle:  7*Math.PI/6,
                minScale: -5,
                maxScale: 5,
                durationTime: 1000
            };

            let add_config = {
                parent: '#drawing_region_add',
                origin: [200, 200],
                width: 400,
                height: 400,
                scale: 30,
                startAngle:  7*Math.PI/6,
                minScale: -5,
                maxScale: 5,
                durationTime: 1000
            };

            const train_3d_scatter_plot = new _3dScatterPlot( train_config, train_data );
            const test_3d_scatter_plot = new _3dScatterPlot( test_config, test_data );
            const add_3d_scatter_plot = new _3dScatterPlot( add_config, add_data );
            train_3d_scatter_plot.update();
            test_3d_scatter_plot.update();
            add_3d_scatter_plot.update();
        }
    });