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

class OrbitDrawer {
    constructor(radius, segments) {
        this.prog = InitShaderProgram(orbitVS, orbitFS);

        // Get the ids of the uniform variables in the shaders
        this.mvp = gl.getUniformLocation(this.prog, 'mvp');

        // Get the ids of the vertex attributes in the shaders
        this.vertPos = gl.getAttribLocation(this.prog, 'pos');

        // Create the buffer objects
        this.vertbuffer = gl.createBuffer();

        var pos = this.createOrbit(radius, segments);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
    }

    createOrbit(radius, segments) {
        var orbitVertices = [];
        for (var i = 0; i <= segments; i++) {
            var angle = 2 * Math.PI * i/segments;
            var x = radius * Math.cos(angle);
            var y = radius * Math.sin(angle);
            orbitVertices.push(x, y, 0);
        }
        return orbitVertices;
    }

    draw(trans) {
        gl.useProgram(this.prog);
        gl.uniformMatrix4fv(this.mvp, false, trans);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
        gl.vertexAttribPointer(this.vertPos, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.vertPos);
        gl.drawArrays(gl.LINE_LOOP, 0, 101); 
	}
}

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

var meshDrawer1;
var meshDrawer2;
var meshDrawer3;
var meshDrawer4;
var meshDrawer5;
var meshDrawer6;
var meshDrawer7;
var meshDrawer8;
var meshDrawer9;
var orbitDrawers = [];

var sunUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/img/Sun/sun.obj';
var mercuryUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/img/Mercury/mercury.obj';
var venusUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/img/Venus/venus.obj';
var earthUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/img/Earth/earth.obj';
var marsUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/img/Mars/mars.obj';
var jupUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/img/Jupiter/jupiter.obj';
var satUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/img/Saturn/saturn.obj';
var urUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/img/Uranus/uranus.obj';
var nepUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/img/Neptune/neptune.obj'

var sunmapUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/img/Sun/sunmap.jpg'
var mercurymapUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/img/Mercury/mercurymap.jpg'
var venusmapUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/img/Venus/venusmap.jpg'
var earthmapUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/img/Earth/earth.jpg'
var marsmapUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/img/Mars/marsmap.jpg'
var jupmapUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/img/Jupiter/jupitermap.jpg'
var satmapUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/img/Saturn/saturnmap.jpg'
var urmapUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/img/Uranus/uranusmap.jpg'
var nepmapUrl = 'https://raw.githubusercontent.com/giadatroilo/FinalProjectInteractiveGraphics_TroiloGiada/main/img/Neptune/neptunemap.jpg'

var canvas, gl;
var perspectiveMatrix;	
var rotX=0, rotY=0, transZ=5;
var autorot1 = 0, autorot2 = 0, autorot3 = 0, autorot4 = 0, autorot5 = 0, autorot6 = 0, autorot7 = 0, autorot8 = 0, autorot9 = 0;
var Autorot2 = 0, Autorot3 = 0, Autorot4 = 0, Autorot5 = 0, Autorot6 = 0, Autorot7 = 0, Autorot8 = 0, Autorot9 = 0;
var animationActive = false; 
var orbitsActive = false; 

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

	const ORBIT_SEGMENTS = 100;
    orbitDrawers.push(new OrbitDrawer(5, ORBIT_SEGMENTS));
    orbitDrawers.push(new OrbitDrawer(9.23, ORBIT_SEGMENTS));
    orbitDrawers.push(new OrbitDrawer(12.82, ORBIT_SEGMENTS));
    orbitDrawers.push(new OrbitDrawer(19.49, ORBIT_SEGMENTS));
    orbitDrawers.push(new OrbitDrawer(66.67, ORBIT_SEGMENTS));
    orbitDrawers.push(new OrbitDrawer(122.82, ORBIT_SEGMENTS));
    orbitDrawers.push(new OrbitDrawer(246.41, ORBIT_SEGMENTS));
    orbitDrawers.push(new OrbitDrawer(385.26, ORBIT_SEGMENTS));

	LoadTexturefromUrl(sunmapUrl, meshDrawer1)
	LoadSunfromUrl(sunUrl, meshDrawer1);
	LoadTexturefromUrl(mercurymapUrl, meshDrawer2);
	LoadMercuryfromUrl(mercuryUrl, meshDrawer2);
	LoadTexturefromUrl(venusmapUrl, meshDrawer3);
	LoadVenusfromUrl(venusUrl, meshDrawer3);
	LoadTexturefromUrl(earthmapUrl, meshDrawer4);
	LoadEarthfromUrl(earthUrl, meshDrawer4);
	LoadTexturefromUrl(marsmapUrl, meshDrawer5);
	LoadMarsfromUrl(marsUrl, meshDrawer5);
	LoadTexturefromUrl(jupmapUrl, meshDrawer6);
	LoadJupiterfromUrl(jupUrl, meshDrawer6);
	LoadTexturefromUrl(satmapUrl, meshDrawer7);
	LoadSaturnfromUrl(satUrl, meshDrawer7);
	LoadTexturefromUrl(urmapUrl, meshDrawer8);
	LoadUranfromUrl(urUrl, meshDrawer8);
	LoadTexturefromUrl(nepmapUrl, meshDrawer9);
	LoadNepfromUrl(nepUrl, meshDrawer9);
	
	// Set the viewport size
	UpdateCanvasSize();

	const scale = SetScale(document.getElementById('scale-input'));
	const anim_checkbox = document.getElementById('animateCheckbox');
    anim_checkbox.addEventListener('change', () => toggleAnimation(anim_checkbox))
	toggleAnimation(anim_checkbox);
	const orbit_check = document.getElementById('orbitCheckbox')
    orbit_check.addEventListener('change', function() {
		orbitsActive = this.checked;
		DrawScene();
	});
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
	var n = (transZ - 390);
	const min_n = 0.001;
	if (n < min_n) n = min_n;
	var f = (transZ + 390);
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
	var pos1 = getTranslationPosition(0, 0, rotX, rotY);
	var mv1 =  GetModelViewMatrix(pos1.x, pos1.y, transZ + pos1.z, 0, autorot1);
	var mvp1 = MatrixMult(perspectiveMatrix, mv1);

	var pos2 = getTranslationPosition(5, Autorot2, rotX, rotY);
	var mv2 = GetModelViewMatrix(pos2.x, pos2.y, transZ + pos2.z, 0, autorot2 + Autorot2);
	var mvp2 = MatrixMult(perspectiveMatrix, mv2);

	var pos3 = getTranslationPosition(9.23, Autorot3, rotX, rotY);
	var mv3 = GetModelViewMatrix(pos3.x, pos3.y, transZ + pos3.z, 0, autorot3 + Autorot3);
	var mvp3 = MatrixMult(perspectiveMatrix, mv3);

	var pos4 = getTranslationPosition(12.82, Autorot4, rotX, rotY);
	var mv4 = GetModelViewMatrix(pos4.x, pos4.y, transZ + pos4.z, 0, autorot4 + Autorot4);
	var mvp4 = MatrixMult(perspectiveMatrix, mv4);

	var pos5 = getTranslationPosition(19.49, Autorot5, rotX, rotY);
	var mv5 = GetModelViewMatrix(pos5.x, pos5.y, transZ + pos5.z, 0, autorot5 + Autorot5);
	var mvp5 = MatrixMult(perspectiveMatrix, mv5);

	var pos6 = getTranslationPosition(66.67, Autorot6, rotX, rotY);
	var mv6 = GetModelViewMatrix(pos6.x, pos6.y, transZ + pos6.z, 0, autorot6 + Autorot6);
	var mvp6 = MatrixMult(perspectiveMatrix, mv6);

	var pos7 = getTranslationPosition(122.82, Autorot7, rotX, rotY);
	var mv7 = GetModelViewMatrix(pos7.x, pos7.y, transZ + pos7.z, 0, autorot7 + Autorot7);
	var mvp7 = MatrixMult(perspectiveMatrix, mv7);

	var pos8 = getTranslationPosition(246.41, Autorot8, rotX, rotY);
	var mv8 = GetModelViewMatrix(pos8.x, pos8.y, transZ + pos8.z, 0, autorot8 + Autorot8);
	var mvp8 = MatrixMult(perspectiveMatrix, mv8);

	var pos9 = getTranslationPosition(385.26, Autorot9, rotX, rotY);
	var mv9 = GetModelViewMatrix(pos9.x, pos9.y, transZ + pos9.z, 0, autorot9 + Autorot9);
	var mvp9 = MatrixMult(perspectiveMatrix, mv9);
	
	var mvorb =  GetModelViewMatrix(0, 0, transZ, rotX, rotY);
	var mvporb = MatrixMult(perspectiveMatrix, mvorb);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	if (orbitsActive) {
		orbitDrawers[0].draw(mvporb);
		orbitDrawers[1].draw(mvporb);
		orbitDrawers[2].draw(mvporb);
		orbitDrawers[3].draw(mvporb);
		orbitDrawers[4].draw(mvporb);
		orbitDrawers[5].draw(mvporb);
		orbitDrawers[6].draw(mvporb);
		orbitDrawers[7].draw(mvporb);
	}

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

function inverseMatrix3x3(m) {
    var det = m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
              m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
              m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
    
    if (det === 0) {
        throw new Error("Matrix is not invertible");
    }

    var invDet = 1 / det;

    var inv = [
        [
            (m[1][1] * m[2][2] - m[1][2] * m[2][1]) * invDet,
            (m[0][2] * m[2][1] - m[0][1] * m[2][2]) * invDet,
            (m[0][1] * m[1][2] - m[0][2] * m[1][1]) * invDet
        ],
        [
            (m[1][2] * m[2][0] - m[1][0] * m[2][2]) * invDet,
            (m[0][0] * m[2][2] - m[0][2] * m[2][0]) * invDet,
            (m[0][2] * m[1][0] - m[0][0] * m[1][2]) * invDet
        ],
        [
            (m[1][0] * m[2][1] - m[1][1] * m[2][0]) * invDet,
            (m[0][1] * m[2][0] - m[0][0] * m[2][1]) * invDet,
            (m[0][0] * m[1][1] - m[0][1] * m[1][0]) * invDet
        ]
    ];

    return inv;
}

function getTranslationPosition(radius, auto, rotX, rotY) {

    var rotXMatrix = [
        [1, 0, 0],
        [0, Math.cos(rotX), Math.sin(rotX)],
        [0, -Math.sin(rotX), Math.cos(rotX)]
    ];

    var rotYMatrix = [
        [Math.cos(rotY), 0, -Math.sin(rotY)],
        [0, 1, 0],
        [Math.sin(rotY), 0, Math.cos(rotY)]
    ];

    var rotCombined = MatrixMult3x3(rotYMatrix, rotXMatrix);

    var inv_rot = inverseMatrix3x3(rotCombined);

    var vec = [radius * Math.cos(auto), radius * Math.sin(auto), 0];

    var ris = [
        inv_rot[0][0] * vec[0] + inv_rot[0][1] * vec[1] + inv_rot[0][2] * vec[2],
        inv_rot[1][0] * vec[0] + inv_rot[1][1] * vec[1] + inv_rot[1][2] * vec[2],
        inv_rot[2][0] * vec[0] + inv_rot[2][1] * vec[1] + inv_rot[2][2] * vec[2]
    ];

    return {
        x: ris[0],
        y: ris[1],
        z: ris[2],
    };
}

function MatrixMult3x3(a, b) {
    var result = [];
    for (var i = 0; i < 3; i++) {
        result[i] = [];
        for (var j = 0; j < 3; j++) {
            result[i][j] = a[i][0] * b[0][j] + a[i][1] * b[1][j] + a[i][2] * b[2][j];
        }
    }
    return result;
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


function LoadSunfromUrl(githubUrl, drawer) {
fetch(githubUrl)
	.then(response => response.text())
	.then(objText => {
		var mesh = new ObjMesh();
		mesh.parse(objText);
		var box = mesh.getBoundingBox();
		var shift = [
			-(box.min[0] + box.max[0]) / 5,
			-(box.min[1] + box.max[1]) / 5,
			-(box.min[2] + box.max[2]) / 5
		];
		var size = [
			(box.max[0] - box.min[0]) / 5,
			(box.max[1] - box.min[1]) / 5,
			(box.max[2] - box.min[2]) / 5
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

function LoadMercuryfromUrl(githubUrl, drawer) {
	fetch(githubUrl)
		.then(response => response.text())
		.then(objText => {
			var mesh = new ObjMesh();
			mesh.parse(objText);
			var box = mesh.getBoundingBox();
			var shift = [
				-(box.min[0] + box.max[0]) / (100 * 0.0035),
				-(box.min[1] + box.max[1]) / (100 * 0.0035),
				-(box.min[2] + box.max[2]) / (100 * 0.0035)
			];
			var size = [
				(box.max[0] - box.min[0]) / (100 * 0.0035),
				(box.max[1] - box.min[1]) / (100 * 0.0035),
				(box.max[2] - box.min[2]) / (100 * 0.0035)
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

    
function LoadVenusfromUrl(githubUrl, drawer) {
	fetch(githubUrl)
		.then(response => response.text())
		.then(objText => {
			var mesh = new ObjMesh();
			mesh.parse(objText);
			var box = mesh.getBoundingBox();
			var shift = [
				-(box.min[0] + box.max[0]) / (100 * 0.0087),
				-(box.min[1] + box.max[1]) / (100 * 0.0087),
				-(box.min[2] + box.max[2]) / (100 * 0.0087)
			];
			var size = [
				(box.max[0] - box.min[0]) / (100 * 0.0087),
				(box.max[1] - box.min[1]) / (100 * 0.0087), 
				(box.max[2] - box.min[2]) / (100 * 0.0087)
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
	
	
function LoadEarthfromUrl(githubUrl, drawer) {
	fetch(githubUrl)
		.then(response => response.text())
		.then(objText => {
			var mesh = new ObjMesh();
			mesh.parse(objText);
			var box = mesh.getBoundingBox();
			var shift = [
				-(box.min[0] + box.max[0]) / (100 * 0.0092),
				-(box.min[1] + box.max[1]) / (100 * 0.0092),
				-(box.min[2] + box.max[2]) / (100 * 0.0092)
			];
			var size = [
				(box.max[0] - box.min[0]) / (100 * 0.0092),
				(box.max[1] - box.min[1]) / (100 * 0.0092),
				(box.max[2] - box.min[2]) / (100 * 0.0092) 
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
	
function LoadMarsfromUrl(githubUrl, drawer) {
	fetch(githubUrl)
		.then(response => response.text())
		.then(objText => {
			var mesh = new ObjMesh();
			mesh.parse(objText);
			var box = mesh.getBoundingBox();
			var shift = [
				-(box.min[0] + box.max[0]) / (100 * 0.0049),
				-(box.min[1] + box.max[1]) / (100 * 0.0049),
				-(box.min[2] + box.max[2]) / (100 * 0.0049)
			];
			var size = [
				(box.max[0] - box.min[0]) / (100 * 0.0049),
				(box.max[1] - box.min[1]) / (100 * 0.0049),
				(box.max[2] - box.min[2]) / (100 * 0.0049)
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
	
function LoadJupiterfromUrl(githubUrl, drawer) {
	fetch(githubUrl)
		.then(response => response.text())
		.then(objText => {
			var mesh = new ObjMesh();
			mesh.parse(objText);
			var box = mesh.getBoundingBox();
			var shift = [
				-(box.min[0] + box.max[0]) / (50 * 0.1005) ,
				-(box.min[1] + box.max[1]) / (50 * 0.1005),
				-(box.min[2] + box.max[2]) / (50 * 0.1005)
			];
			var size = [
				(box.max[0] - box.min[0]) / (50 * 0.1005),
				(box.max[1] - box.min[1]) / (50 * 0.1005),
				(box.max[2] - box.min[2]) / (50 * 0.1005)
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
	
function LoadSaturnfromUrl(githubUrl, drawer) {
	fetch(githubUrl)
		.then(response => response.text())
		.then(objText => {
			var mesh = new ObjMesh();
			mesh.parse(objText);
			var box = mesh.getBoundingBox();
			var shift = [
				-(box.min[0] + box.max[0]) / (50 * 0.0837),
				-(box.min[1] + box.max[1]) / (50 * 0.0837),
				-(box.min[2] + box.max[2]) / (50 * 0.0837)
			];
			var size = [
				(box.max[0] - box.min[0]) / (50 * 0.0837),
				(box.max[1] - box.min[1]) / (50 * 0.0837),
				(box.max[2] - box.min[2]) / (50 * 0.0837)
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
	
function LoadUranfromUrl(githubUrl, drawer) {
	fetch(githubUrl)
		.then(response => response.text())
		.then(objText => {
			var mesh = new ObjMesh();
			mesh.parse(objText);
			var box = mesh.getBoundingBox();
			var shift = [
				-(box.min[0] + box.max[0]) / (50 * 0.0365),
				-(box.min[1] + box.max[1]) / (50 * 0.0365),
				-(box.min[2] + box.max[2]) / (50 * 0.0365)
			];
			var size = [
				(box.max[0] - box.min[0]) / (50 * 0.0365),
				(box.max[1] - box.min[1]) / (50 * 0.0365),
				(box.max[2] - box.min[2]) / (50 * 0.0365)
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
	
function LoadNepfromUrl(githubUrl, drawer) {
	fetch(githubUrl)
		.then(response => response.text())
		.then(objText => {
			var mesh = new ObjMesh();
			mesh.parse(objText);
			var box = mesh.getBoundingBox();
			var shift = [
				-(box.min[0] + box.max[0]) / (50 * 0.0354),
				-(box.min[1] + box.max[1]) / (50 * 0.0354),
				-(box.min[2] + box.max[2]) / (50 * 0.0354)
			];
			var size = [
				(box.max[0] - box.min[0]) / (50 * 0.0354),
				(box.max[1] - box.min[1]) / (50 * 0.0354),
				(box.max[2] - box.min[2]) / (50 * 0.0354)
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

function GetModelViewMatrix(translationX, translationY, translationZ, rotationX, rotationY) {
    var trans = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        translationX, translationY, translationZ, 1
    ];

    var rotX = [
        1, 0, 0, 0,
        0, Math.cos(rotationX), Math.sin(rotationX), 0,
        0, -Math.sin(rotationX), Math.cos(rotationX), 0,
        0, 0, 0, 1
    ];

    var rotY = [
        Math.cos(rotationY), 0, -Math.sin(rotationY), 0,
        0, 1, 0, 0,
        Math.sin(rotationY), 0, Math.cos(rotationY), 0,
        0, 0, 0, 1
    ];

    var mv = MatrixMult(trans, MatrixMult(rotY, rotX));  
    return mv;
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
			gl.vertexAttribPointer(this.texCoord, 2, gl.FLOAT, false, 0, 0); 
	
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
