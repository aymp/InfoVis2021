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
                startAngle: 7*Math.PI/6,
                minScale: -5,
                maxScale: 5,
                durationTime: 1000,
                class: 'train'
            };

            let test_config = {
                parent: '#drawing_region_test',
                origin: [200, 200],
                width: 400,
                height: 400,
                scale: 30,
                startAngle: 7*Math.PI/6,
                minScale: -5,
                maxScale: 5,
                durationTime: 1000,
                class: 'test'
            };

            let add_config = {
                parent: '#drawing_region_add',
                origin: [200, 200],
                width: 400,
                height: 400,
                scale: 30,
                startAngle: 7*Math.PI/6,
                minScale: -5,
                maxScale: 5,
                durationTime: 1000,
                class: 'add'
            };

            const train_3d_scatter_plot = new _3dScatterPlot( train_config, train_data );
            const test_3d_scatter_plot = new _3dScatterPlot( test_config, test_data );
            const add_3d_scatter_plot = new _3dScatterPlot( add_config, add_data );
            train_3d_scatter_plot.init()
            test_3d_scatter_plot.init()
            add_3d_scatter_plot.init()
            train_3d_scatter_plot.render(train_3d_scatter_plot.config.durationTime);
            test_3d_scatter_plot.render(test_3d_scatter_plot.config.durationTime);
            add_3d_scatter_plot.render(add_3d_scatter_plot.config.durationTime);

            // インタラクティブ
            d3.select('#drawing_region_train')
                .call(d3.drag()
                    .on('drag', draggedTrain)
                    .on('start', dragStartTrain)
                    .on('end', dragEndTrain))

            d3.select('#drawing_region_test')
                .call(d3.drag()
                    .on('drag', draggedTest)
                    .on('start', dragStartTest)
                    .on('end', dragEndTest))

            d3.select('#drawing_region_add')
                .call(d3.drag()
                    .on('drag', draggedAdd)
                    .on('start', dragStartAdd)
                    .on('end', dragEndAdd))

            function dragStartTrain() {
                train_3d_scatter_plot.mx = d3.event.x;
                train_3d_scatter_plot.my = d3.event.y;
            }
        
            function draggedTrain() {
                train_3d_scatter_plot.beta   = (d3.event.x - train_3d_scatter_plot.mx + train_3d_scatter_plot.mouseX) * Math.PI / 230 ;
                train_3d_scatter_plot.alpha  = (d3.event.y - train_3d_scatter_plot.my + train_3d_scatter_plot.mouseY) * Math.PI / 230  * (-1);
                train_3d_scatter_plot.data = [
                    train_3d_scatter_plot.point3d.rotateY(train_3d_scatter_plot.beta + train_3d_scatter_plot.config.startAngle).rotateX(train_3d_scatter_plot.alpha - train_3d_scatter_plot.config.startAngle)(train_3d_scatter_plot.scatter),
                    train_3d_scatter_plot.xScale3d.rotateY(train_3d_scatter_plot.beta + train_3d_scatter_plot.config.startAngle).rotateX(train_3d_scatter_plot.alpha - train_3d_scatter_plot.config.startAngle)([train_3d_scatter_plot.xLine]),
                    train_3d_scatter_plot.yScale3d.rotateY(train_3d_scatter_plot.beta + train_3d_scatter_plot.config.startAngle).rotateX(train_3d_scatter_plot.alpha - train_3d_scatter_plot.config.startAngle)([train_3d_scatter_plot.yLine]),
                    train_3d_scatter_plot.zScale3d.rotateY(train_3d_scatter_plot.beta + train_3d_scatter_plot.config.startAngle).rotateX(train_3d_scatter_plot.alpha - train_3d_scatter_plot.config.startAngle)([train_3d_scatter_plot.zLine]),
                ];
                train_3d_scatter_plot.render(0);
            }
        
            function dragEndTrain() {
                train_3d_scatter_plot.mouseX = d3.event.x - train_3d_scatter_plot.mx + train_3d_scatter_plot.mouseX;
                train_3d_scatter_plot.mouseY = d3.event.y - train_3d_scatter_plot.my + train_3d_scatter_plot.mouseY;
            }

            function dragStartTest() {
                test_3d_scatter_plot.mx = d3.event.x;
                test_3d_scatter_plot.my = d3.event.y;
            }
        
            function draggedTest() {
                test_3d_scatter_plot.beta   = (d3.event.x - test_3d_scatter_plot.mx + test_3d_scatter_plot.mouseX) * Math.PI / 230 ;
                test_3d_scatter_plot.alpha  = (d3.event.y - test_3d_scatter_plot.my + test_3d_scatter_plot.mouseY) * Math.PI / 230  * (-1);
                test_3d_scatter_plot.data = [
                    test_3d_scatter_plot.point3d.rotateY(test_3d_scatter_plot.beta + test_3d_scatter_plot.config.startAngle).rotateX(test_3d_scatter_plot.alpha - test_3d_scatter_plot.config.startAngle)(test_3d_scatter_plot.scatter),
                    test_3d_scatter_plot.xScale3d.rotateY(test_3d_scatter_plot.beta + test_3d_scatter_plot.config.startAngle).rotateX(test_3d_scatter_plot.alpha - test_3d_scatter_plot.config.startAngle)([test_3d_scatter_plot.xLine]),
                    test_3d_scatter_plot.yScale3d.rotateY(test_3d_scatter_plot.beta + test_3d_scatter_plot.config.startAngle).rotateX(test_3d_scatter_plot.alpha - test_3d_scatter_plot.config.startAngle)([test_3d_scatter_plot.yLine]),
                    test_3d_scatter_plot.zScale3d.rotateY(test_3d_scatter_plot.beta + test_3d_scatter_plot.config.startAngle).rotateX(test_3d_scatter_plot.alpha - test_3d_scatter_plot.config.startAngle)([test_3d_scatter_plot.zLine]),
                ];
                test_3d_scatter_plot.render(0);
            }
        
            function dragEndTest() {
                test_3d_scatter_plot.mouseX = d3.event.x - test_3d_scatter_plot.mx + test_3d_scatter_plot.mouseX;
                test_3d_scatter_plot.mouseY = d3.event.y - test_3d_scatter_plot.my + test_3d_scatter_plot.mouseY;
            }

            function dragStartAdd() {
                add_3d_scatter_plot.mx = d3.event.x;
                add_3d_scatter_plot.my = d3.event.y;
            }
        
            function draggedAdd() {
                add_3d_scatter_plot.beta   = (d3.event.x - add_3d_scatter_plot.mx + add_3d_scatter_plot.mouseX) * Math.PI / 230 ;
                add_3d_scatter_plot.alpha  = (d3.event.y - add_3d_scatter_plot.my + add_3d_scatter_plot.mouseY) * Math.PI / 230  * (-1);
                add_3d_scatter_plot.data = [
                    add_3d_scatter_plot.point3d.rotateY(add_3d_scatter_plot.beta + add_3d_scatter_plot.config.startAngle).rotateX(add_3d_scatter_plot.alpha - add_3d_scatter_plot.config.startAngle)(add_3d_scatter_plot.scatter),
                    add_3d_scatter_plot.xScale3d.rotateY(add_3d_scatter_plot.beta + add_3d_scatter_plot.config.startAngle).rotateX(add_3d_scatter_plot.alpha - add_3d_scatter_plot.config.startAngle)([add_3d_scatter_plot.xLine]),
                    add_3d_scatter_plot.yScale3d.rotateY(add_3d_scatter_plot.beta + add_3d_scatter_plot.config.startAngle).rotateX(add_3d_scatter_plot.alpha - add_3d_scatter_plot.config.startAngle)([add_3d_scatter_plot.yLine]),
                    add_3d_scatter_plot.zScale3d.rotateY(add_3d_scatter_plot.beta + add_3d_scatter_plot.config.startAngle).rotateX(add_3d_scatter_plot.alpha - add_3d_scatter_plot.config.startAngle)([add_3d_scatter_plot.zLine]),
                ];
                add_3d_scatter_plot.render(0);
            }
        
            function dragEndAdd() {
                add_3d_scatter_plot.mouseX = d3.event.x - add_3d_scatter_plot.mx + add_3d_scatter_plot.mouseX;
                add_3d_scatter_plot.mouseY = d3.event.y - add_3d_scatter_plot.my + add_3d_scatter_plot.mouseY;
            }
        }
    });