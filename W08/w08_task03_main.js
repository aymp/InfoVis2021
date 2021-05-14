/*
var data = [
  {label:'Apple', value:100},
  {label:'Banana', value:200},
  {label:'Cookie', value:50},
  {label:'Doughnut', value:120},
  {label:'Egg', value:80}
];

var config = {
  parent: '#drawing_region',
  width: 256,
  height: 256,
};*/

d3.csv("https://aymp.github.io/InfoVis2021/W08/w08_task03_data.csv")
    .then( data => {
        data.forEach( d => { d.label = d.label; d.value = +d.value; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
        };

        const pie_chart = new PieChart( config, data );
        pie_chart.update();
    })
    .catch( error => {
        console.log( error );
    });


class PieChart {
  constructor( config, data ) {
      this.config = {
          parent: config.parent,
          width: config.width || 256,
          height: config.height || 256
      }
      this.data = data;
      this.init()
  }
  init() {
      let self = this;

      self.radius = Math.min( self.config.width, self.config.height ) / 2;

      self.svg = d3.select( self.config.parent )
          .attr('width', self.config.width)
          .attr('height', self.config.height)
          .append('g')
          .attr('transform', `translate(${self.config.width/2}, ${self.config.height/2})`);
  }
  update() {
      let self = this;

      self.pie = d3.pie()
          .value( d => d.value );

      self.arc = d3.arc()
          .innerRadius(self.radius/2)
          .outerRadius(self.radius);

      self.text = d3.arc()
          .innerRadius(Math.round(self.radius * 0.75))
          .outerRadius(Math.round(self.radius * 0.75));

      self.render();
  }
  render() {
      let self = this;

      self.svg.selectAll('pie')
          .data( self.pie(self.data) )
          .enter()    
          .append('path')
          .attr('d', self.arc)
          .attr('fill', 'black')
          .attr('stroke', 'white')
          .style('stroke-width', '2px');

      self.svg.selectAll('pie')
          .data( self.pie(self.data) )
          .enter()
          .append("text")
          .attr("fill", "white")
          .attr("transform", function(d) { return "translate(" + self.text.centroid(d) + ")"; })
          .attr("dy", "5px")
          .attr("font", "10px")
          .attr("text-anchor", "middle")
          .text(function(d) { return d.data.label; });

  }
}

//const pie_chart = new PieChart( config, data );
//pie_chart.update();