class my3dScatterPlot {

    constructor( config, data, cent_data ) {
        this.config = {
            parent: config.parent || '#drawing_region',
            origin: config.origin || [480, 300],
            width: config.width || 960,
            height: config.height || 500,
            scale: config.scale || 40,
            startAngle: config.startAngle || 7*Math.PI/6,
            minScale: config.minScale || -5,
            maxScale: config.maxScale ||  5,
            durationTime: config.durationTime || 1000,
            class: config.class || '_3d'
        }
        this.data = data;
        this.cent_data = cent_data;
        this.init();
    }

    init() {
        let self = this;

        self.scatter = [];
        self.xLine = [];
        self.yLine = [];
        self.zLine = [];
        self.beta = 0;
        self.alpha = 0;
        self.mx = 0;
        self.my = 0;
        self.mouseX = 0;
        self.mouseY = 0;
        self.color = d3.schemeSet2;
        self.threshold = threshold;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height)
            .append('g');

        self.point3d = d3._3d()
            .x(function(d){ return d.x; })
            .y(function(d){ return d.y; })
            .z(function(d){ return d.z; })
            .origin(self.config.origin)
            .rotateY( self.config.startAngle)
            .rotateX(-self.config.startAngle)
            .scale(self.config.scale);
        
        self.xScale3d = d3._3d()
            .shape('LINE_STRIP')
            .origin(self.config.origin)
            .rotateY( self.config.startAngle)
            .rotateX(-self.config.startAngle)
            .scale(self.config.scale);
        
        self.yScale3d = d3._3d()
            .shape('LINE_STRIP')
            .origin(self.config.origin)
            .rotateY( self.config.startAngle)
            .rotateX(-self.config.startAngle)
            .scale(self.config.scale);

        self.zScale3d = d3._3d()
            .shape('LINE_STRIP')
            .origin(self.config.origin)
            .rotateY( self.config.startAngle)
            .rotateX(-self.config.startAngle)
            .scale(self.config.scale);

        self.data.forEach(function(d){ self.scatter.push( {x: +d.x, y: +d.y, z: +d.z, label: +d.pred_label, body: 'main'} ) })
        
        d3.range(self.config.minScale, self.config.maxScale+1, 1).forEach(function(d){ self.xLine.push([d, 0, 0]); });
        d3.range(self.config.minScale, self.config.maxScale+1, 1).forEach(function(d){ self.yLine.push([0, d, 0]); });
        d3.range(self.config.minScale, self.config.maxScale+1, 1).forEach(function(d){ self.zLine.push([0, 0, d]); });

        self.data = [
            self.point3d(self.scatter),
            self.xScale3d([self.xLine]),
            self.yScale3d([self.yLine]),
            self.zScale3d([self.zLine]),
        ];
    }

    update(tt, threshold_flag, threshold) {
        let self = this;
        self.threshold = threshold;
        self.scatter = self.scatter.filter(function(elm){
            return elm.body != 'sub'
        })
        if(threshold_flag){
            self.cent_data.forEach(function(d){
                for(let x = +d.cent_x-self.threshold; x <= +d.cent_x+self.threshold; x+= 0.2){
                    for(let z = +d.cent_z-self.threshold; z <= +d.cent_z+self.threshold; z+= 0.2){
                        let disc = self.threshold**2-(x-d.cent_x)**2-(z-d.cent_z)**2;
                        if(disc > 0){
                            let y1 = +d.cent_y + Math.sqrt(disc);
                            let y2 = +d.cent_y - Math.sqrt(disc);
                            self.scatter.push( {x: x, y: +y1, z: z, label: +d.label, body: 'sub'} );
                            self.scatter.push( {x: x, y: +y2, z: z, label: +d.label, body: 'sub'} );
                        }
                    }
                }
            });
        }
        self.data = [
            self.point3d(self.scatter),
            self.xScale3d([self.xLine]),
            self.yScale3d([self.yLine]),
            self.zScale3d([self.zLine]),
        ];
        self.render(tt, threshold_flag);
    }

    render(tt, threshold_flag) {
        let self = this;

        let points = self.svg.selectAll('circle').data(self.data[0]);
        
        points
            .enter()
            .append('circle')
            .attr('class', function(d){ return d.body+' '+self.config.class + ' _3d _' + d.label; });

        if(threshold_flag){
            d3.selectAll('circle.sub')
                .attr('opacity', 0)
                .attr('cx', function(d){ return d.projected.x; })
                .attr('cy', function(d){ return d.projected.y; })
                .merge(points)
                .transition().duration(tt)
                .attr('r', 1)
                //.attr('stroke', function(d){ return d3.color(self.color[d.label]).darker(3); })
                .attr('fill', function(d){ return self.color[d.label]; })
                .attr('opacity', 0.5)
                .attr('cx', function(d){ return d.projected.x; })
                .attr('cy', function(d){ return d.projected.y; });
        }
        d3.selectAll('circle.main')            
            .attr('opacity', 0)
            .attr('cx', function(d){ return d.projected.x; })
            .attr('cy', function(d){ return d.projected.y; })
            .merge(points)
            .transition().duration(tt)
            .attr('r', 3)
            .attr('stroke', function(d){ return d3.color(self.color[d.label]).darker(3); })
            .attr('fill', function(d){ return self.color[d.label]; })
            .attr('opacity', 1)
            .attr('cx', function(d){ return d.projected.x; })
            .attr('cy', function(d){ return d.projected.y; });

        points
            .on('mouseover',function(d) {
                let selected_label = d.label;
                d3.selectAll('circle')
                    .transition()
                    .duration(100)
                    .attr('r', '0');

                d3.selectAll('circle.main._3d._'+selected_label)
                    .transition()
                    .duration(100)
                    .attr('r', '4');

                if(threshold_flag){
                    d3.selectAll('circle.sub._'+selected_label)
                        .transition()
                        .duration(100)
                        .attr('r', '1');
                }
            })
            .on('mouseleave', function() {
                d3.selectAll('circle.main')
                    .transition()
                    .duration(100)
                    .attr('r', '3')

                if(threshold_flag){
                    d3.selectAll('circle.sub')
                        .transition()
                        .duration(100)
                        .attr('r', '1');
                };
               
            });

        points.exit().remove();

        /* ----------- x-Scale ----------- */

        let xScale = self.svg.selectAll('path.xScale').data(self.data[1]);

        xScale
            .enter()
            .append('path')
            .attr('class', self.config.class + '_3d xScale')
            .merge(xScale)
            .attr('stroke', 'red')
            .attr('stroke-width', .5)
            .attr('d', self.xScale3d.draw);

        xScale.exit().remove();

        /* ----------- y-Scale ----------- */

        let yScale = self.svg.selectAll('path.yScale').data(self.data[2]);

        yScale
            .enter()
            .append('path')
            .attr('class', self.config.class + '_3d yScale')
            .merge(yScale)
            .attr('stroke', 'green')
            .attr('stroke-width', .5)
            .attr('d', self.yScale3d.draw);

        yScale.exit().remove();

        /* ----------- z-Scale ----------- */

        let zScale = self.svg.selectAll('path.zScale').data(self.data[3]);
        
        zScale
            .enter()
            .append('path')
            .attr('class', self.config.class + '_3d zScale')
            .merge(zScale)
            .attr('stroke', 'blue')
            .attr('stroke-width', .5)
            .attr('d', self.zScale3d.draw);

        zScale.exit().remove();

        /* ----------- x-Scale Text ----------- */

        let xText = self.svg.selectAll('text.xText').data(self.data[1][0]);

        xText
            .enter()
            .append('text')
            .attr('class', self.config.class + '_3d xText')
            .attr('dx', '.3em')
            .merge(xText)
            .each(function(d){
                d.centroid = {x: d.rotated.x, y: d.rotated.y, z: d.rotated.z};
            })
            .attr('x', function(d){ return d.projected.x; })
            .attr('y', function(d){ return d.projected.y; })
            .text(function(d){ return d[0]; });

        xText.exit().remove();

        //d3.selectAll(self.config.class + '._3d').sort(d3._3d().sort);

        /* ----------- y-Scale Text ----------- */

        let yText = self.svg.selectAll('text.yText').data(self.data[2][0]);

        yText
            .enter()
            .append('text')
            .attr('class', self.config.class + '_3d yText')
            .attr('dx', '.3em')
            .merge(yText)
            .each(function(d){
                d.centroid = {x: d.rotated.x, y: d.rotated.y, z: d.rotated.z};
            })
            .attr('x', function(d){ return d.projected.x; })
            .attr('y', function(d){ return d.projected.y; })
            .text(function(d){ return d[1]; });

        yText.exit().remove();

        //d3.selectAll(self.config.class + '._3d').sort(d3._3d().sort);

        /* ----------- z-Scale Text ----------- */

        let zText = self.svg.selectAll('text.zText').data(self.data[3][0]);

        zText
            .enter()
            .append('text')
            .attr('class', self.config.class + '_3d zText')
            .attr('dx', '.3em')
            .merge(zText)
            .each(function(d){
                d.centroid = {x: d.rotated.x, y: d.rotated.y, z: d.rotated.z};
            })
            .attr('x', function(d){ return d.projected.x; })
            .attr('y', function(d){ return d.projected.y; })
            .text(function(d){ return d[2]; });

        xText.exit().remove();

        //d3.selectAll(self.config.class + '._3d').sort(d3._3d().sort);
    }
}
