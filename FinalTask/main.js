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

            train_3d_scatter_plot = new _3dScatterPlot( train_config, train_data );
            test_3d_scatter_plot = new _3dScatterPlot( test_config, test_data );
            add_3d_scatter_plot = new _3dScatterPlot( add_config, add_data );
            train_3d_scatter_plot.render(train_3d_scatter_plot.config.durationTime);
            test_3d_scatter_plot.render(test_3d_scatter_plot.config.durationTime);
            add_3d_scatter_plot.render(add_3d_scatter_plot.config.durationTime);

            /* ----------- Reset ----------- */
            d3.selectAll('button').on('click', function() {
                d3.selectAll('g').remove();
                train_3d_scatter_plot = new _3dScatterPlot( train_config, train_data );
                test_3d_scatter_plot = new _3dScatterPlot( test_config, test_data );
                add_3d_scatter_plot = new _3dScatterPlot( add_config, add_data );
                train_3d_scatter_plot.render(train_3d_scatter_plot.config.durationTime);
                test_3d_scatter_plot.render(test_3d_scatter_plot.config.durationTime);
                add_3d_scatter_plot.render(add_3d_scatter_plot.config.durationTime);
            });

            /* ----------- Sync ----------- */
            syncCheck = document.getElementById('sync');
            syncCheck.checked = true;
            
            d3.select('#drawing_region_train')
                .call(d3.drag()
                    .on('drag', draggedTrainOrAll)
                    .on('start', dragStartTrainOrAll)
                    .on('end', dragEndTrainOrAll))

            d3.select('#drawing_region_test')
                .call(d3.drag()
                    .on('drag', draggedTestOrAll)
                    .on('start', dragStartTestOrAll)
                    .on('end', dragEndTestOrAll))

            d3.select('#drawing_region_add')
                .call(d3.drag()
                    .on('drag', draggedAddOrAll)
                    .on('start', dragStartAddOrAll)
                    .on('end', dragEndAddOrAll))
            
            /* ----------- 以下、回転処理に関する関数(冗長だが今回はこれで) ----------- */
            function dragStartTrainOrAll() {
                if (syncCheck.checked) {
                    dragStartAll();
                } else {
                    dragStartTrain();
                }
            }

            function draggedTrainOrAll() {
                if (syncCheck.checked) {
                    draggedAll();
                } else {
                    draggedTrain();
                }
            }

            function dragEndTrainOrAll() {
                if (syncCheck.checked) {
                    dragEndAll();
                } else {
                    dragEndTrain();
                }
            }

            function dragStartTestOrAll() {
                if (syncCheck.checked) {
                    dragStartAll();
                } else {
                    dragStartTest();
                }
            }

            function draggedTestOrAll() {
                if (syncCheck.checked) {
                    draggedAll();
                } else {
                    draggedTest();
                }
            }

            function dragEndTestOrAll() {
                if (syncCheck.checked) {
                    dragEndAll();
                } else {
                    dragEndTest();
                }
            }

            function dragStartAddOrAll() {
                if (syncCheck.checked) {
                    dragStartAll();
                } else {
                    dragStartAdd();
                }
            }

            function draggedAddOrAll() {
                if (syncCheck.checked) {
                    draggedAll();
                } else {
                    draggedAdd();
                }
            }

            function dragEndAddOrAll() {
                if (syncCheck.checked) {
                    dragEndAll();
                } else {
                    dragEndAdd();
                }
            }

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

            function dragStartAll() {
                dragStartTrain();
                dragStartTest();
                dragStartAdd();
            }

            function draggedAll() {
                draggedTrain();
                draggedTest();
                draggedAdd();
            }

            function dragEndAll() {
                dragEndTrain();
                dragEndTest();
                dragEndAdd();
            }
        }
    });