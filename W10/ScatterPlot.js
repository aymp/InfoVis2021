class ScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10, axis:10, title:10, label:10}
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height)

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width 
                         - self.config.margin.left
                         - self.config.margin.right 
                         - self.config.margin.label;

        self.inner_height = self.config.height 
                          - self.config.margin.top
                          - self.config.margin.bottom
                          - self.config.margin.title
                          - self.config.margin.label;

        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [0, self.inner_height] );

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(6);

        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(6);

        self.plot_area = self.chart.append('g')
            .attr('transform', `translate(${self.config.margin.label}, ${self.config.margin.title})`);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(${self.config.margin.label}, ${self.config.margin.title + self.inner_height})`);
        
        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(${self.config.margin.label}, ${self.config.margin.title})`);

        self.title = self.chart.append('g')
            .attr('transform', `translate(${self.inner_width/2}, ${self.config.margin.top})`);

        self.xlabel = self.chart.append('g')
            .attr('transform', `translate(${self.config.margin.label + self.inner_width/2}, ${self.config.margin.title + self.inner_height + self.config.margin.bottom})`);

        self.ylabel = self.chart.append('g')
            .attr('transform', `translate(-5, ${self.config.margin.title + self.inner_height/2})`);


    }

    update() {
        let self = this;

        const xmin = d3.min( self.data, d => d.precision );
        const xmax = d3.max( self.data, d => d.precision );
        self.xscale.domain( [0, 1] );

        const ymin = d3.min( self.data, d => d.recall );
        const ymax = d3.max( self.data, d => d.recall );
        self.yscale.domain( [1, 0] );

        self.render();
    }

    render() {
        let self = this;
        let title = ["Precision and Recall of representative","time series anomaly detection methods","based on sample reconstruction(black)","and LSTM-based VAE-GAN(red)"];
        
        /*
        self.plot_area.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", d => d.r )
            .style("fill", d => d.color);*/
        
        let circles = self.plot_area.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle");

        circles
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", d => d.r )
            .style("fill", d => d.color);

        circles
            .on('mouseover', (e,d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">Method, Precision, Recall</div>(${d.label}, ${d.x}, ${d.y})`);
            })
            .on('mousemove', (e) => {
                const padding = 10;
                d3.select('#tooltip')
                    .style('left', (e.pageX + padding) + 'px')
                    .style('top', (e.pageY + padding) + 'px');
            })
            .on('mouseleave', () => {
                d3.select('#tooltip')
                    .style('opacity', 0);
            });
        
        self.xaxis_group
            .call( self.xaxis );

        self.yaxis_group
            .call( self.yaxis );

        self.title.selectAll("text")
            .data(title)
            .enter()
            .append("text")
            .attr("y", (d,i) => 20 * i)
            .attr("text-anchor", "middle")
            .text(d => d)
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .style("alignment-baseline", "text-after-edge");

        self.xlabel
            .append("text")
            .attr("text-anchor", "middle")
            .text("Precision")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .style("alignment-baseline", "text-before-edge");

        self.ylabel
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .text("Recall")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .style("alignment-baseline", "text-after-edge");


    }
}
