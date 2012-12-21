Scattering = function(frame) {
	this.ctx = frame.getContext('2d') ;
	
	this.const = {
		u_nat: 931.5*Math.pow(10, 6), // eV/c^2
		u_si: 1.660539 * Math.pow(10, -27), // kg
		c: 3*Math.pow(10, 8), // m/s
		h_: 6.582119 * Math.pow(10, -16), // eV s
		h__si: 1.054572 * Math.pow(10, -34), // J s
		epsilon_0: 8.854187*Math.pow(10, -12), // As/Vm
		//e: 1 // e
		e: 1.602 * Math.pow(10, -19)
	}
	
	console.log(this.const) ;
} ;

Scattering.prototype.calculateAcceleration = function() {
	var radius = Math.sqrt(this.particle.position.x*this.particle.position.x + this.particle.position.y*this.particle.position.y) * Math.pow(10, -15) ;
	
	var coulomb_factor = (Math.pow(this.const.e, 2)) / (4*Math.PI*this.const.epsilon_0 * this.const.h__si * this.const.c) ;

	var h_c = (this.const.h_ * this.const.c) /** Math.pow(10, 15)*/ ;
	
	var factor = coulomb_factor * ( h_c / (this.const.u_nat) ) * ( (this.particle.Z * this.options.nucleus.Z) / (this.particle.A) ) * ( 1 / Math.pow(radius, 3) ) ;
	
	
	//console.log( coulomb_factor * ( h_c / this.const.u_nat ) * ((this.particle.Z * this.options.nucleus.Z)/ this.particle.A ) * (1 / Math.pow(radius, 3)) );
	

	return {
		x: this.particle.position.x * factor,
		y: this.particle.position.y * factor
	} ;
} ;

Scattering.prototype.render = function(options) {
	var self = this ;

	this.options = $.extend({
		delta_t: 1.5*Math.pow(10, -13),
		nucleus: {
			color: "rgba(0, 0, 200, 0.5)",
			radius: 50,
			Z: 79
		},
		particle: {
			position: {
				x: -500,
				y: 3
			},
			Z: 2,
			A: 4,
			kinetic: 5*Math.pow(10, 6) // eV
		},
		draw: true
	}, options) ;
	
	
	this.particle = this.options.particle ;
	
	this.particle.velocity = {
		x: Math.sqrt(2*this.particle.kinetic / (this.particle.A * this.const.u_nat)) * Math.pow(10, 15),
		y: 0
	} ;
	
	if(this.options.draw) {
		this.ctx.translate(750, 500) ;
		this.ctx.scale(1, -1) ;
		
		this.drawNucleus(0, 0) ;
	
		this.drawCross(this.particle.position.x, this.particle.position.y) ;	
	}
	for(i=0;i<130;i++) {
		this.updateVelocity(this.calculateAcceleration()) ;
		
		this.moveParticle() ;
		
		if(this.options.draw) {
			this.drawCross(this.particle.position.x, this.particle.position.y) ;
		}
	}
	
	
	
} ;

Scattering.prototype.updateVelocity = function(a) {
	this.particle.velocity = {
		x: this.particle.velocity.x + a.x * this.options.delta_t,
		y: this.particle.velocity.y + a.y * this.options.delta_t
	} ;
} ;

Scattering.prototype.moveParticle = function() {
	this.particle.position = {
		x: this.particle.position.x + this.particle.velocity.x * this.options.delta_t,
		y: this.particle.position.y + this.particle.velocity.y * this.options.delta_t
	} ;
} ;

Scattering.prototype.drawNucleus = function(x, y) {
	this.ctx.fillStyle = this.options.nucleus.color ;
	this.ctx.beginPath() ;
	this.ctx.arc(x, y, this.options.nucleus.radius, 0, Math.PI*2, false) ;
	this.ctx.fill() ;
	this.ctx.closePath();
} ;


Scattering.prototype.drawCross = function(x, y) {
	var ctx = this.ctx ;
	
	ctx.fillStyle = '#000000' ;
	
	ctx.beginPath() ;
	
	ctx.moveTo(x-2, y-2) ;
	ctx.lineTo(x+2, y+2) ;
	                   
	ctx.moveTo(x+2, y-2) ;
	ctx.lineTo(x-2, y+2) ;
	
	ctx.stroke() ;
	
	ctx.closePath() ;
	
} ;