class _3dScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent || '#drawing_region',
            width: config.width || 960,
            height: config.height || 500,
            scale: config.scale || 20,
            j: config.j || 10,
            startAngle: config.startAngle || Math.PI/4,
            durationTime: config.durationTime || 1000
            //margin: {top:30, right:10, bottom:50, left:100}
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.self.scatter = [];
        self.yLine = [];
        self.xGrid = [];
        self.beta = 0;
        self.alpha = 0;
        self.mx = 0;
        self.my = 0;
        self.mouseX = 0;
        self.mouseY = 0;
        self.key = function(d){ return d.id; }

        self.color = d3.scaleOriginal(d3.schemeCategory20);

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.grid3d = d3._3d()
            .shape('GRID', 20)
            .origin(self.config.origin)
            .rotateY( self.config.startAngle)
            .rotateX(-self.config.startAngle)
            .scale(self.config.scale);

        self.point3d = d3._3d()
            .x(function(d){ return d.x; })
            .y(function(d){ return d.y; })
            .z(function(d){ return d.z; })
            .origin(self.config.origin)
            .rotateY( self.config.startAngle)
            .rotateX(-self.config.startAngle)
            .scale(scale);
        
        self.yScale3d = d3._3d()
            .shape('LINE_STRIP')
            .origin(self.config.origin)
            .rotateY( self.config.startAngle)
            .rotateX(-self.config.startAngle)
            .scale(self.config.scale);
    }

    update() {
        let self = this;
        /*
        const xmin = d3.min( self.data, d => d.precision );
        const xmax = d3.max( self.data, d => d.precision );
        self.xscale.domain( [0, 1] );

        const ymin = d3.min( self.data, d => d.recall );
        const ymax = d3.max( self.data, d => d.recall );
        self.yscale.domain( [1, 0] );*/

        self.render();
    }

    render() {
        let self = this;
    
        /* ----------- GRID ----------- */
        let xGrid = self.svg.selectAll('path.grid').data(self.data[0], key);

        xGrid
            .enter()
            .append('path')
            .attr('class', '_3d grid')
            .merge(xGrid)
            .attr('stroke', 'black')
            .attr('stroke-width', 0.3)
            .attr('fill', function(d){ return d.ccw ? 'lightgrey' : '#717171'; })
            .attr('fill-opacity', 0.9)
            .attr('d', grid3d.draw);

        xGrid.exit().remove();

        /* ----------- POINTS ----------- */

        let points = svg.selectAll('circle').data(data[1], key);

        points
            .enter()
            .append('circle')
            .attr('class', '_3d')
            .attr('opacity', 0)
            .attr('cx', posPointX)
            .attr('cy', posPointY)
            .merge(points)
            .transition().duration(self.config.duration_time)
            .attr('r', 3)
            .attr('stroke', function(d){ return d3.color(color(d.id)).darker(3); })
            .attr('fill', function(d){ return color(d.id); })
            .attr('opacity', 1)
            .attr('cx', posPointX)
            .attr('cy', posPointY);

        points.exit().remove();

        /* ----------- y-Scale ----------- */

        let yScale = svg.selectAll('path.yScale').data(data[2]);

        yScale
            .enter()
            .append('path')
            .attr('class', '_3d yScale')
            .merge(yScale)
            .attr('stroke', 'black')
            .attr('stroke-width', .5)
            .attr('d', yScale3d.draw);

        yScale.exit().remove();

            /* ----------- y-Scale Text ----------- */

        var yText = svg.selectAll('text.yText').data(data[2][0]);

        yText
            .enter()
            .append('text')
            .attr('class', '_3d yText')
            .attr('dx', '.3em')
            .merge(yText)
            .each(function(d){
                d.centroid = {x: d.rotated.x, y: d.rotated.y, z: d.rotated.z};
            })
            .attr('x', function(d){ return d.projected.x; })
            .attr('y', function(d){ return d.projected.y; })
            .text(function(d){ return d[1]; });

        yText.exit().remove();

        d3.selectAll('._3d').sort(d3._3d().sort);
    }

    posPointX(d) {
        return d.projected.x;
    }

    posPointY(d) {
        return d.projected.y;
    }

    dragStart() {
        let self = this;
        self.mx = d3.event.x;
        self.my = d3.event.y;
    }

    dragged() {
        let self = this;
        //mouseX = mouseX || 0;
        //mouseY = mouseY || 0;
        self.beta   = (d3.event.x - self.mx + self.mouseX) * Math.PI / 230 ;
        self.alpha  = (d3.event.y - self.my + self.mouseY) * Math.PI / 230  * (-1);
        self.data = [
             grid3d.rotateY(self.beta + self.config.startAngle).rotateX(self.alpha - self.config.startAngle)(xGrid),
            point3d.rotateY(self.beta + self.config.startAngle).rotateX(self.alpha - self.config.startAngle)(scatter),
            yScale3d.rotateY(self.beta + self.config.startAngle).rotateX(self.alpha - self.config.startAngle)([yLine]),
        ];
        update(self.data, 0);
    }

    dragEnd() {
        let self = this;
        self.mouseX = d3.event.x - self.mx + self.mouseX;
        self.mouseY = d3.event.y - self.my + self.mouseY;
    }
}
