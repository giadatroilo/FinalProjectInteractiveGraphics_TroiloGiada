class BoxDrawer {
	constructor()
	{
		// Compile the shader program
		this.prog = InitShaderProgram( boxVS, boxFS );
		
		// Get the ids of the uniform variables in the shaders
		this.mvp = gl.getUniformLocation( this.prog, 'mvp' );
		
		// Get the ids of the vertex attributes in the shaders
		this.vertPos = gl.getAttribLocation( this.prog, 'pos' );
		
		// Create the buffer objects
		
		this.vertbuffer = gl.createBuffer();
		var scale = 0.5
		var pos = [
			-1 * scale, -1 * scale, -1 * scale,
			-1 * scale, -1 * scale,  1 * scale,
			-1 * scale,  1 * scale, -1 * scale,
			-1 * scale,  1 * scale,  1 * scale,
			1 * scale, -1 * scale, -1 * scale,
			1 * scale, -1 * scale,  1 * scale,
			1 * scale,  1 * scale, -1 * scale,
			1 * scale,  1 * scale,  1 * scale
		];
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);

		this.linebuffer = gl.createBuffer();
		var line = [
			0,1,   1,3,   3,2,   2,0,
			4,5,   5,7,   7,6,   6,4,
			0,4,   1,5,   3,7,   2,6 ];
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.linebuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(line), gl.STATIC_DRAW);
	}
	draw( trans )
	{
		// Draw the line segments
		gl.useProgram( this.prog );
		gl.uniformMatrix4fv( this.mvp, false, trans );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.vertbuffer );
		gl.vertexAttribPointer( this.vertPos, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( this.vertPos );
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.linebuffer );
		gl.drawElements( gl.LINES, 24, gl.UNSIGNED_BYTE, 0 );
	}
}
// Vertex shader source code
var boxVS = `
	attribute vec3 pos;
	uniform mat4 mvp;
	void main()
	{
		gl_Position = mvp * vec4(pos,1);
	}
`;
// Fragment shader source code
var boxFS = `
	precision mediump float;
	void main()
	{
		gl_FragColor = vec4(1,1,1,1);
	}
`;

///////////////////////////////////////////////////////////////////////////////////
// Below is the cclass for drawing the orbits
///////////////////////////////////////////////////////////////////////////////////
var orbitVS = `
	attribute vec3 pos;
	uniform mat4 mvp;
	void main()
	{
		gl_Position = mvp * vec4(pos, 1.0);
	}
`;
// Fragment shader source code
var orbitFS = `
	precision mediump float;
	void main()
	{
		gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	}
`;

// Class for drawing orbits
class OrbitDrawer {
constructor(radius) {
	this.prog = InitShaderProgram(orbitVS, orbitFS);
	this.radius = radius;
	this.numSegments = 360;  // Number of segments for the circle approximation
	this.vertexBuffer = gl.createBuffer();
	this.vertices = [];
	this.mvp = gl.getUniformLocation(this.prog, 'mvp');
	this.vertPos = gl.getAttribLocation(this.prog, 'vertPos');
	this.texCoord = gl.getAttribLocation(this.prog, 'texCoord');

	// Generate vertices for a circle
	for (let i = 0; i <= this.numSegments; i++) {
		let theta = (i / this.numSegments) * 2 * Math.PI;
		let x = this.radius * Math.cos(theta);
		let y = this.radius * Math.sin(theta);
		let z = 3;
		this.vertices.push(x, y, 3);  // Coordinates in 3D space
	}

	// Bind vertex buffer and load data into buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
}

draw(mvp) {
	gl.useProgram(this.prog); 
	
	gl.uniformMatrix4fv(this.mvp, false, mvp);

	// Bind vertex data
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.vertexAttribPointer(this.vertPos, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(this.vertPos);

	// Draw the orbit path
	gl.drawArrays(gl.LINE_STRIP, 0, this.numSegments + 1);
}
}

var meshDrawer1;
var meshDrawer2;
var meshDrawer3;
var meshDrawer4;
var meshDrawer5;
var meshDrawer6;
var meshDrawer7;
var meshDrawer8;
var meshDrawer9;

var sunUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/sun.obj';
var mercuryUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/mercury.obj';
var venusUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/venus.obj';
var earthUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/earth.obj';
var marsUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/mars.obj';
var jupUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/jupiter.obj';
var satUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/saturn.obj';
var urUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/uranus.obj';
var nepUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/neptune.obj'

var sunmapUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/sunmap.jpg'
var mercurymapUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/mercurymap.jpg'
var venusmapUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/venusmap.jpg'
var earthmapUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/earth.jpg'
var marsmapUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/marsmap.jpg'
var jupmapUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/jupitermap.jpg'
var satmapUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/saturnmap.jpg'
var urmapUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/uranusmap.jpg'
var nepmapUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/neptunemap.jpg'

var canvas, gl;
var perspectiveMatrix;	// perspective projection matrix
var rotX=0, rotY=0, transZ=50;
var autorot1 = 0, autorot2 = 0, autorot3 = 0, autorot4 = 0, autorot5 = 0, autorot6 = 0, autorot7 = 0, autorot8 = 0, autorot9 = 0;
var Autorot2 = 0, Autorot3 = 0, Autorot4 = 0, Autorot5 = 0, Autorot6 = 0, Autorot7 = 0, Autorot8 = 0, Autorot9 = 0;
var animationActive = false; 

// Called once to initialize
function InitWebGL()
{
	// Initialize the WebGL canvas
	canvas = document.getElementById("canvas");
	canvas.oncontextmenu = function() {return false;};
	gl = canvas.getContext("webgl", {antialias: false, depth: true});	// Initialize the GL context
	if (!gl) {
		alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		return;
	}
	
	// Initialize settings
	gl.clearColor(0,0,0,0);
	gl.enable(gl.DEPTH_TEST);
	
	// Initialize the programs and buffers for drawing
	
	meshDrawer1 = new MeshDrawer();
	meshDrawer2 = new MeshDrawer();
	meshDrawer3 = new MeshDrawer();
	meshDrawer4 = new MeshDrawer();
	meshDrawer5 = new MeshDrawer();
	meshDrawer6 = new MeshDrawer();
	meshDrawer7 = new MeshDrawer();
	meshDrawer8 = new MeshDrawer();
	meshDrawer9 = new MeshDrawer();


	LoadTexturefromUrl(sunmapUrl, meshDrawer1)
	LoadObjfromUrl(sunUrl, meshDrawer1);
	LoadTexturefromUrl(mercurymapUrl, meshDrawer2);
	LoadObjfromUrl(mercuryUrl, meshDrawer2);
	LoadTexturefromUrl(venusmapUrl, meshDrawer3);
	LoadObjfromUrl(venusUrl, meshDrawer3);
	LoadTexturefromUrl(earthmapUrl, meshDrawer4);
	LoadObjfromUrl(earthUrl, meshDrawer4);
	LoadTexturefromUrl(marsmapUrl, meshDrawer5);
	LoadObjfromUrl(marsUrl, meshDrawer5);
	LoadTexturefromUrl(jupmapUrl, meshDrawer6);
	LoadObjfromUrl(jupUrl, meshDrawer6);
	LoadTexturefromUrl(satmapUrl, meshDrawer7);
	LoadObjfromUrl(satUrl, meshDrawer7);
	LoadTexturefromUrl(urmapUrl, meshDrawer8);
	LoadObjfromUrl(urUrl, meshDrawer8);
	LoadTexturefromUrl(nepmapUrl, meshDrawer9);
	LoadObjfromUrl(nepUrl, meshDrawer9);
	

	// Set the viewport size
	UpdateCanvasSize();

	const scale = SetScale(document.getElementById('scale-input'));
	const checkbox = document.getElementById('animateCheckbox');
    checkbox.addEventListener('change', () => toggleAnimation(checkbox))
	toggleAnimation(checkbox);
	
}

// Called every time the window size is changed.
function UpdateCanvasSize() 
{
	canvas.style.width = "100%";
	canvas.style.height = "100%";
	const pixelRatio = window.devicePixelRatio || 1;
	canvas.width = pixelRatio * canvas.clientWidth;
	canvas.height = pixelRatio * canvas.clientHeight;
	const width = (canvas.width / pixelRatio);
	const height = (canvas.height / pixelRatio);
	canvas.style.width = width + 'px';
	canvas.style.height = height + 'px';
	gl.viewport(0, 0, canvas.width, canvas.height);
	UpdateProjectionMatrix();
}

function UpdateProjectionMatrix() 
{
	var r = canvas.width / canvas.height;
	var n = (transZ - 1.74);
	const min_n = 0.001;
	if (n < min_n) n = min_n;
	var f = (transZ + 1.74);
	var fov = 3.145 * 60 / 180;
	var s = 1 / Math.tan(fov / 2);
	perspectiveMatrix = [
		s / r, 0, 0, 0,
		0, s, 0, 0,
		0, 0, (n + f) / (f - n), 1,
		0, 0, -2 * n * f / (f - n), 0
	];
}


function toggleAnimation(checkbox) {
    animationActive = checkbox.checked;
    if (animationActive) {
        requestAnimationFrame(updateAnimation);
    }
}

function updateAnimation() {
    if (!animationActive) return;
    UpdateScene();
    UpdateScene2(); 
    requestAnimationFrame(updateAnimation);
}

function UpdateScene()
{
	const scale = SetScale(document.getElementById('scale-input'));
	
	Autorot2 += 0.0005 * 4.79 * scale;
	if (Autorot2 > 2 * Math.PI) Autorot2 -= 2 * Math.PI;

	Autorot3 += 0.0005 * 3.50 * scale;
	if (Autorot3 > 2 * Math.PI) Autorot3 -= 2 * Math.PI;

	Autorot4 += 0.0005 * 2.98 * scale;
	if (Autorot4 > 2 * Math.PI) Autorot4 -= 2 * Math.PI;

	Autorot5 += 0.0005 * 2.41 * scale;
	if (Autorot5 > 2 * Math.PI) Autorot5 -= 2 * Math.PI;

	Autorot6 += 0.0005 * 1.31 * scale;
	if (Autorot6 > 2 * Math.PI) Autorot6 -= 2 * Math.PI;

	Autorot7 += 0.0005 * 0.97 * scale;
	if (Autorot7 > 2 * Math.PI) Autorot7 -= 2 * Math.PI;

	Autorot8 += 0.0005 * 0.68 * scale;
	if (Autorot8 > 2 * Math.PI) Autorot8 -= 2 * Math.PI;

	Autorot9 += 0.0005 * 0.54 * scale;
	if (Autorot9 > 2 * Math.PI) Autorot9 -= 2 * Math.PI;

	DrawScene();

	if (animationActive) {
		requestAnimationFrame(UpdateScene);
	}
}

function UpdateScene2()
{
	const scale = SetScale(document.getElementById('scale-input'));
	
	autorot1 += 0.0005 * 193.3 * scale;
	if (autorot1 > 2 * Math.PI) autorot1 -= 2 * Math.PI;

	autorot2 += 0.0005 * 0.302 * scale;
	if (autorot2 > 2 * Math.PI) autorot2 -= 2 * Math.PI;

	autorot3 += 0.0005 * 0.181 * scale;
	if (autorot3 > 2 * Math.PI) autorot3 -= 2 * Math.PI;

	autorot4 += 0.0005 * 46.5 * scale;
	if (autorot4 > 2 * Math.PI) autorot4 -= 2 * Math.PI;

	Autorot5 += 0.0005 * 24.1 * scale;
	if (autorot5 > 2 * Math.PI) autorot5 -= 2 * Math.PI;

	autorot6 += 0.0005 * 1258 * scale;
	if (autorot6 > 2 * Math.PI) autorot6 -= 2 * Math.PI;

	autorot7 += 0.0005 * 987 * scale;
	if (autorot7 > 2 * Math.PI) autorot7 -= 2 * Math.PI;

	autorot8 += 0.0005 * 259 *scale;
	if (autorot8 > 2 * Math.PI) autorot8 -= 2 * Math.PI;

	autorot9 += 0.0005 * 268 * scale;
	if (autorot9 > 2 * Math.PI) autorot9 -= 2 * Math.PI;

	DrawScene();

	if (animationActive) {
		requestAnimationFrame(UpdateScene2);
	}
}
// This is the main function that handled WebGL drawing
function DrawScene() 
{
	console.log(rotX)
	var pos1 = getTranslationPosition(0, 0, rotX);
	var mv1 =  GetModelViewMatrix(pos1.x, pos1.y, transZ, 0, autorot1);
	var mvp1 = MatrixMult(perspectiveMatrix, mv1);

	var pos2 = getTranslationPosition(5, Autorot2, rotX);
	var mv2 = GetModelViewMatrix(pos2.x, pos2.y, transZ, 0, autorot2 + Autorot2);
	var mvp2 = MatrixMult(perspectiveMatrix, mv2);

	var pos3 = getTranslationPosition(10, Autorot3, rotX);
	var mv3 = GetModelViewMatrix(pos3.x, pos3.y, transZ, 0, autorot3 + Autorot3);
	var mvp3 = MatrixMult(perspectiveMatrix, mv3);

	var pos4 = getTranslationPosition(15, Autorot4, rotX);
	var mv4 = GetModelViewMatrix(pos4.x, pos4.y, transZ, 0, autorot4 + Autorot4);
	var mvp4 = MatrixMult(perspectiveMatrix, mv4);

	var pos5 = getTranslationPosition(20, Autorot5, rotX);
	var mv5 = GetModelViewMatrix(pos5.x, pos5.y, transZ, 0, autorot5 + Autorot5);
	var mvp5 = MatrixMult(perspectiveMatrix, mv5);

	var pos6 = getTranslationPosition(25, Autorot6, rotX);
	var mv6 = GetModelViewMatrix(pos6.x, pos6.y, transZ, 0, autorot6 + Autorot6);
	var mvp6 = MatrixMult(perspectiveMatrix, mv6);

	var pos7 = getTranslationPosition(30, Autorot7, rotX);
	var mv7 = GetModelViewMatrix(pos7.x, pos7.y, transZ, 0, autorot7 + Autorot7);
	var mvp7 = MatrixMult(perspectiveMatrix, mv7);

	var pos8 = getTranslationPosition(35, Autorot8, rotX);
	var mv8 = GetModelViewMatrix(pos8.x, pos8.y, transZ, 0, autorot8 + Autorot8);
	var mvp8 = MatrixMult(perspectiveMatrix, mv8);

	var pos9 = getTranslationPosition(40, Autorot9, rotX);
	var mv9 = GetModelViewMatrix(pos9.x, pos9.y, transZ, 0, autorot9 + Autorot9);
	var mvp9 = MatrixMult(perspectiveMatrix, mv9);
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	meshDrawer1.draw(mvp1);
	meshDrawer2.draw(mvp2);
	meshDrawer3.draw(mvp3);
	meshDrawer4.draw(mvp4);
	meshDrawer5.draw(mvp5);
	meshDrawer6.draw(mvp6);
	meshDrawer7.draw(mvp7);
	meshDrawer8.draw(mvp8);
	meshDrawer9.draw(mvp9);
	
}

function getTranslationPosition(radius, phi, theta) 
{
	return {
		x: radius * Math.cos(theta) * Math.sin(phi),
		y: radius * Math.sin(theta) * Math.cos(phi),
	};
}

function SetScale(input) {
	var scale = parseFloat(input.value);
	document.getElementById('scale-value').innerText = scale.toFixed(2);
	return scale
}	
	
// This is a helper function for compiling the given vertex and fragment shader source code into a program.
function InitShaderProgram( vsSource, fsSource )
{
	const vs = CompileShader( gl.VERTEX_SHADER,   vsSource );
	const fs = CompileShader( gl.FRAGMENT_SHADER, fsSource );

	const prog = gl.createProgram();
	gl.attachShader(prog, vs);
	gl.attachShader(prog, fs);
	gl.linkProgram(prog);

	if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
		alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(prog));
		return null;
	}
	return prog;
}

// This is a helper function for compiling a shader, called by InitShaderProgram().
function CompileShader( type, source )
{
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter( shader, gl.COMPILE_STATUS) ) {
		alert('An error occurred compiling shader:\n' + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

// Multiplies two matrices and returns the result A*B.
// The arguments A and B are arrays, representing column-major matrices.
function MatrixMult( A, B )
{
	var C = [];
	for ( var i=0; i<4; ++i ) {
		for ( var j=0; j<4; ++j ) {
			var v = 0;
			for ( var k=0; k<4; ++k ) {
				v += A[j+4*k] * B[k+4*i];
			}
			C.push(v);
		}
	}
	return C;
}

var showBox = true;

window.onload = function() {
	InitWebGL();
	canvas.zoom = function( s ) {
		transZ *= s/canvas.height + 1;
		UpdateProjectionMatrix();
		DrawScene();
	}
	canvas.onwheel = function() { canvas.zoom(0.3*event.deltaY); }
	canvas.onmousedown = function() {
		var cx = event.clientX;
		var cy = event.clientY;
		if ( event.ctrlKey ) {
			canvas.onmousemove = function() {
				canvas.zoom(5*(event.clientY - cy));
				cy = event.clientY;
			}
		} else {
			canvas.onmousemove = function() {
				rotY += (cx - event.clientX)/canvas.width*5;
				rotX += (cy - event.clientY)/canvas.height*5;
				cx = event.clientX;
				cy = event.clientY;
				UpdateProjectionMatrix();
				DrawScene();
			}
		}
	}
	canvas.onmouseup = canvas.onmouseleave = function() {
		canvas.onmousemove = null;
	}
	
	DrawScene();
};

function WindowResize()
{
	UpdateCanvasSize();
	DrawScene();
}

function ShowTexture( param )
{
	meshDrawer.showTexture( param.checked );
	DrawScene();
}


function LoadObjfromUrl(githubUrl, drawer) {
fetch(githubUrl)
	.then(response => response.text())
	.then(objText => {
		var mesh = new ObjMesh();
		mesh.parse(objText);
		var box = mesh.getBoundingBox();
		var shift = [
			-(box.min[0] + box.max[0]) / 2,
			-(box.min[1] + box.max[1]) / 2,
			-(box.min[2] + box.max[2]) / 2
		];
		var size = [
			(box.max[0] - box.min[0]) / 2,
			(box.max[1] - box.min[1]) / 2,
			(box.max[2] - box.min[2]) / 2
		];
		var maxSize = Math.max(size[0], size[1], size[2]);
		var scale = 1 / maxSize;
		mesh.shiftAndScale(shift, scale);
		var buffers = mesh.getVertexBuffers();

		drawer.setMesh(buffers.positionBuffer, buffers.texCoordBuffer);                   
			
		DrawScene();
	})
	.catch(error => {
		console.error('Error loading OBJ:', error);
	});
}

function LoadTexturefromUrl(textureUrl, drawer) {
	fetch(textureUrl)
		.then(response => response.blob())
		.then(blob => {
			var url = URL.createObjectURL(blob);
			var img = new Image();
			img.onload = function() {
				drawer.setTexture(img);
				DrawScene();
			};
			img.src = url;
		})
		.catch(error => {
			console.error('Error loading texture:', error);
		});
}


function GetModelViewMatrix( translationX, translationY, translationZ, rotationX, rotationY )
{
	var transl= [
		[1, 0, 0, translationX],
		[0, 1, 0, translationY],
		[0, 0, 1, translationZ],
		[0, 0, 0, 1]
	];
	
	var rotx=[
		[1, 0, 0, 0],
		[0, Math.cos(-rotationX), Math.sin(-rotationX), 0],
		[0, -Math.sin(-rotationX), Math.cos(-rotationX), 0], 
		[0, 0, 0, 1]
	];

	var roty=[
		[Math.cos(-rotationY), 0, -Math.sin(-rotationY), 0 ],
		[0, 1, 0, 0],
		[Math.sin(-rotationY), 0, Math.cos(-rotationY), 0 ],
		[0, 0, 0, 1]
	];

	transl = ColumnMajorOrder(transl);
	rotx = ColumnMajorOrder(rotx);
	roty = ColumnMajorOrder(roty)
	// first rotationx then rotationY and at least translation 
	var trans1 = MatrixMult(transl, rotx);  
    var trans2 = MatrixMult(trans1, roty);    

	var mv = trans2;
	return mv;
}

function ColumnMajorOrder(matri){
	var vec=[];
	var righe=matri.length;
	var colonne=matri[0].length;
	for (var j=0; j<colonne; j++){
		for (var i=0; i<righe; i++){
			vec.push(matri[i][j]);  
		}
	}

	return vec;
}

class MeshDrawer {
    constructor() {
		this.prog = InitShaderProgram(meshVS, meshFS);
		
		this.mvp = gl.getUniformLocation(this.prog, 'mvp');
		this.showTextureUniform = gl.getUniformLocation(this.prog, 'showTexture');

		this.vertPos = gl.getAttribLocation(this.prog, 'vertPos');
		this.texCoord = gl.getAttribLocation(this.prog, 'texCoord');

		this.vertexBuffer = gl.createBuffer();
		this.textureCoordBuffer = gl.createBuffer();

		this.texture = null;
		this.showTextureFlag = true;
		this.numTriangles = 0;
	}

	setMesh(vertPos, texCoords) {
		this.numTriangles = vertPos.length / 3;

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
	}

    draw(trans) {
		gl.useProgram(this.prog);
		gl.uniformMatrix4fv(this.mvp, false, trans);
	
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.enableVertexAttribArray(this.vertPos);
		gl.vertexAttribPointer(this.vertPos, 3, gl.FLOAT, false, 0, 0);
	
		if (this.showTextureFlag && this.texture) {
			gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
			gl.enableVertexAttribArray(this.texCoord);
			gl.vertexAttribPointer(this.texCoord, 2, gl.FLOAT, false, 0, 0); // <--- Inserisci qui
	
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			gl.uniform1i(gl.getUniformLocation(this.prog, 'texSampler'), 0);
	
			gl.uniform1i(this.showTextureUniform, 1);
		} else {
			gl.uniform1i(this.showTextureUniform, 0);
		}
	
		gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles);
	}
	
    setTexture(img) {
		this.texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
    
    showTexture(show) {
		this.showTextureFlag = show;
	}
}

// Vertex shader source code
var meshVS = `
    attribute vec3 vertPos;
    attribute vec3 texCoord; 
    uniform mat4 mvp;
    varying vec2 fragTexCoord; 
    
    void main() {
        vec4 pos = vec4(vertPos, 1.0);
        gl_Position = mvp * pos;
        fragTexCoord = texCoord.xy; 
    }
`;

// Fragment shader source code
var meshFS = `
    precision mediump float;
    uniform sampler2D texSampler;
    uniform int showTexture;
    varying vec2 fragTexCoord; 
    void main() {
        if (showTexture == 1) {
            gl_FragColor = texture2D(texSampler, fragTexCoord.xy); 
        } else {
            gl_FragColor = vec4(1.0, gl_FragCoord.z*gl_FragCoord.z, 0, 1.0);
        }
    }
`;