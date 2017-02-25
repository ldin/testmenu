var canvas = document.getElementById('canvas'),
	context = canvas.getContext('2d'),
	selElement = document.getElementById('selected'),
	titles = {
		'1':{name:'title1', items:['ex11','ex12']},
		'2':{name:'title2', items:['ex21','ex22']},
		'3':{name:'title3', items:['ex31','ex32','ex32']},
		'4':{name:'title4', items:['ex41','ex42']},
		'5':{name:'title5', items:['ex51','ex52','ex53','ex54','ex55']},
		'6':{name:'title6', items:['ex61','ex62']},
		'7':{name:'title7', items:['ex71','ex72']},
		'8':{name:'title8', items:['ex81','ex82']}
	},
	c_width = 500,
	c_heigh = 300,
	count_w = 8,
	count_h = 5;	
	offset_w = 10,
	offset_h = 10,
	cell_w = (c_width-2*offset_w)/count_w,
	cell_h = (c_heigh-2*offset_h)/count_h,
	
	selectedIndex=null;		


function drowTable(){
	canvas.width = canvas.width;

	for(var x=0; x<count_w+1; x+=1 ){
		context.moveTo(0.5+x*cell_w+offset_w, 0.5+offset_h);
		context.lineTo(0.5+x*cell_w+offset_w, 0.5+cell_h*count_h+offset_h);
	}


	for(var x=0; x<c_width/cell_w -1; x+=1 ){
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillText(titles[x+1].name, x*cell_w+cell_w/2, cell_h*0.5+offset_h);
	}

	for(var x=0; x<count_h+1; x+=1){
		context.moveTo(0.5+offset_w, 0.5+x*cell_h+offset_h);
		context.lineTo(0.5+cell_w*count_w+offset_w, 0.5+x*cell_h+offset_h);
	}

	context.strokeStyle = "#ccc";
	context.stroke();

}

drowTable();
canvas.addEventListener("click", appOnClick, false);
canvas.addEventListener("mousemove", appOnHover, false);

function showMenu(column, text){
	var width=(column-1)*cell_w+.5+offset_w;
	var height=cell_h+.5+offset_h;

	context.beginPath();
	context.fillStyle = "#eee";
	
	context.fillRect(width, height, cell_w, 30+text.length*20);

	context.textAlign = "left";
	context.fillStyle = "#000";
	context.fillText(titles[column].name, width+5, height+10);
	
	context. moveTo(width+5, height+30);
	context. lineTo(width+cell_w-10, height+30);
	context.strokeStyle = "#ccc";
	context.stroke();

	for(var i=0; i<text.length; i++ ){
		rewriteMenuItem(column, i, "#000", text)
	}

	context.fill();
}
function rewriteMenuItem(column, itemNum, color ){
		var text = titles[column].items
		if(text[itemNum] == undefined ) return;		
		var width=(column-1)*cell_w+.5+offset_w;
		var height=cell_h+.5+offset_h;

		context.fillStyle = "#eee";	
		context.fillRect(width+1, height+31+itemNum*20, cell_w-2, 20);

		context.textAlign = "left";
		context.textBaseline = "middle";
		context.fillStyle = color;
		context.fillText(text[itemNum], width+5, height+30+itemNum*20+10);
}

function appOnClick(e) {
	var that = getCursorPosition(e);	
	var cell = getCell(that);

	if(cell.row === 0){
		drowTable();
		if(selectedIndex !== cell.column){
			showMenu(cell.column+1, titles[cell.column+1].items);
			selectedIndex=cell.column;
		}
		else selectedIndex=null;	
	}

	else if(selectedIndex>0 && selectedIndex===cell.column){
		var h = that.y-cell_h-30;
		h = Math.floor(h/20)-1;
		// alert(titles[cell.column+1].items[h]);
		selElement.innerHTML  = 'Item "'+titles[cell.column+1].items[h]+'" is clicked';
		drowTable();
		selectedIndex=null;
	}
}

function appOnHover(e){
	
	var that = getCursorPosition(e);	
	
	if(selectedIndex > 0 && 
		that.x > selectedIndex*cell_w+offset_w &&
		that.x < (selectedIndex+1)*cell_w+offset_w ){
		
		var h = that.y-cell_h-30;
			h = Math.floor(h/20);
		var itL = titles[selectedIndex+1].items.length;	
		
		if (h >= 0 && h<=itL) {
			for(i=0; i<itL+1; i++)
			rewriteMenuItem(selectedIndex+1, i, (i==(h-1))?"#ff1c00":"#000" )
		}
		
	}
}

function Cell(row, column, items) {	
    this.row = row;
    this.column = column;
}

function getCell(that){
	return new Cell(Math.floor(that.y/cell_h), Math.floor(that.x/cell_w));
}

function  getCursorPosition(e) {
	var that=[];
	
	if (e.pageX != undefined && e.pageY != undefined) {
		that.x = e.pageX;
		that.y = e.pageY;
	}
	else {
		that.x = e.clientX + document.body.scrollLeft +
		document.documentElement.scrollLeft;
		that.y = e.clientY + document.body.scrollTop +
		document.documentElement.scrollTop;
	}
	that.x -= canvas.offsetLeft;
    that.y -= canvas.offsetTop;

    return that;
}
