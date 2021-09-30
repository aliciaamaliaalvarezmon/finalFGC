// Controles para la dirección de la luz


class Rings
{
	constructor(quantity)
	{
		this.rings = new Uint8Array(quantity);
		this.size = quantity;
		for(var i = 0; i < quantity; i++){
			this.rings[i] = new Ring();
		}
		// Dibujamos
		this.draw();
		this.update();
		
		// Evento de click
/*		this.canvas.onmousedown = function() 
		{

			}
		}
		
		this.canvas.onmouseup = this.canvas.onmouseleave = function() 
		{

		}*/
	
	
	update()
	{
		for(var i = 0; i < quantity; i++){
			this.rings[i].update();
		}

	}
	
	draw()
	{
		for(var i = 0; i < quantity; i++){
			this.rings[i].draw();
		}
	}
}




